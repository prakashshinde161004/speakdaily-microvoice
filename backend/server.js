const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---- MySQL connection (edit these to match your setup) ----
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",          // your mysql password
  database: "simple_login"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL");
});

// ---- Register ----
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "Username and password required" });
  }

  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.json({ success: false, message: "Username already exists" });
      }
      return res.json({ success: false, message: "Error registering user" });
    }
    res.json({ success: true, message: "Registered successfully" });
  });
});

// ---- Login ----
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      return res.json({ success: false, message: "Server error" });
    }
    if (results.length > 0) {
      res.json({ success: true, username: results[0].username });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
