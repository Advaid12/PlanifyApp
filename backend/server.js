require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());

// **✅ PostgreSQL Connection**
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// **✅ Test Database Connection**
pool.connect((err) => {
  if (err) console.error("❌ Database connection error:", err.stack);
  else console.log("✅ Connected to PostgreSQL Database");
});

// **🟢 User Registration API**
app.post("/api/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Validate role
    const roleQuery = await pool.query("SELECT id FROM roles WHERE role_name = $1", [role]);
    if (roleQuery.rows.length === 0) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const roleId = roleQuery.rows[0].id;

    // Check if user already exists
    const existingUser = await pool.query("SELECT 1 FROM users WHERE email = $1 LIMIT 1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Enforce strong password
    if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ error: "Password must be at least 8 characters, include a number and a special character." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role_id",
      [name, email, hashedPassword, roleId]
    );

    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// **🔵 User Login API**
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Get user from database
    const userQuery = await pool.query(
      "SELECT users.id, users.name, users.email, users.password, roles.role_name FROM users JOIN roles ON users.role_id = roles.id WHERE email = $1 LIMIT 1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userQuery.rows[0];

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role_name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ✅ Send token in response
    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
      },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// **🏗️ Start the server**
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
