require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
// server.js

// MySQL Connection

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Create 'todos' table if not exists
db.query(
  `CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL
  )`,
  (err) => {
    if (err) {
      console.error("Error creating todos table:", err);
    } else {
      console.log("Todos table created or already exists");
    }
  }
);

// API routes

// Get all todos
app.get("/todos", (req, res) => {
  db.query("SELECT * FROM todos", (err, result) => {
    if (err) {
      console.error("Error fetching todos:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Todos from the server:", result);
      res.json(result);
    }
  });
});

// Add a new todo
app.post("/todos", (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400).send("Text is required");
    return;
  }

  db.query("INSERT INTO todos (text) VALUES (?)", [text], (err, result) => {
    if (err) {
      console.error("Error adding todo:", err);
      res.status(500).send("Internal Server Error");
    } else {
      const newTodo = { id: result.insertId, text };
      res.json(newTodo);
    }
  });
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM todos WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting todo:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json({ message: "Todo deleted successfully" });
    }
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
