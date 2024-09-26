// Import required modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000; // Use PORT from environment variables or default to 3000

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection setup using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // Use environment variable
  user: process.env.DB_USER,       // Use environment variable
  password: process.env.DB_PASSWORD, // Use environment variable
  database: process.env.DB_NAME     // Use environment variable
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL.');
});

// Root route (handles GET request for `/`)
app.get('/', (req, res) => {
  res.send('Welcome to the Chatbot API');
});

// POST route to handle user questions
app.post('/ask', (req, res) => {
  const { question } = req.body;

  const sqlQuery = `
    SELECT q.answer
    FROM Questions q
    WHERE q.question = ?;
  `;

  db.query(sqlQuery, [question], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }

    if (results.length > 0) {
      res.json({ answer: results[0].answer });
    } else {
      res.json({ answer: "Sorry, I don't know the answer to that question." });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
