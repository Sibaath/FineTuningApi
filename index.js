const express = require('express');
require('dotenv').config
const { Pool } =  require('pg')
const app = express();
app.use(express.json());

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'db_talks',
//     password: 'sibaath@2004',
//     port: 5432,
// });

const pool = new Pool({
  connectionString: "postgresql://sibaath:zVsxEl09tK0jABjbT47KMfPbNRItw1F4@dpg-ct7e2jpu0jms73dpogjg-a.singapore-postgres.render.com/db_talks",
  ssl: {
    rejectUnauthorized: false  
  }
});

app.post('/executeQuery', async (req, res) => {
    const { query } = req.body;
    console.log('Received body:', req.body);
  
    if (!query) {
      return res.status(400).json({ error: 'Query string is required.' });
    }
  
    let client;
    try {
      client = await pool.connect();
      console.log("Database Connected!!!");
      const result = await client.query(query);
      return res.json(result.rows);
    } catch (error) {
      console.error('Error executing query:', error.message);
      return res.status(500).json({ error: 'Database query failed', details: error.message });
    } finally {
      if (client) {
        client.release();
      }
    }
  });

app.listen(3000, () => {
    console.log('Server is running');
});
