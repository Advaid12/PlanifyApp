require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");
const router = express.Router();
const bodyParser = require("body-parser");


const app = express();
const PORT = process.env.PORT || 5000;

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json()); 

// **✅ PostgreSQL Connection**
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});





const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key"); // Replace with your actual secret key
    req.user = decoded; // Attach decoded user details to request object
    next();
  } catch (error) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

module.exports = authenticateUser;





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
    const roleQuery = await pool.query("SELECT id FROM roles WHERE role_name = $1", [role]);
    if (roleQuery.rows.length === 0) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const roleId = roleQuery.rows[0].id;

    const existingUser = await pool.query("SELECT 1 FROM users WHERE email = $1 LIMIT 1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ error: "Password must be at least 8 characters, include a number and a special character." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    // ✅ Fetch user details with role and worker status
    const userQuery = await pool.query(
      `SELECT users.id, users.name, users.email, users.password, roles.role_name, 
              COALESCE(workers.status, NULL) AS worker_status
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       LEFT JOIN workers ON users.id = workers.id  
       WHERE users.email = $1 LIMIT 1`,
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = userQuery.rows[0];

    // ✅ Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // ✅ Check if the user is a worker and NOT already in the `workers` table`
    if (user.role_name === "Worker" && user.worker_status === null) {
      const existingWorker = await pool.query("SELECT id FROM workers WHERE id = $1", [user.id]);

      if (existingWorker.rows.length === 0) {
        await pool.query("INSERT INTO workers (id, name) VALUES ($1, $2)", [user.id, user.name]);
      }
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role_name },
      process.env.SECRET_KEY || "your_secret_key",
      { expiresIn: "1h" }
    );

    // ✅ Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
        status: user.worker_status, // ✅ Status remains unchanged until set
      },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// **🟢 Get Worker Profile by ID**
app.get("/api/worker-profile", async (req, res) => {
  const { worker_id } = req.query;

  console.log("📌 Worker Profile API Request Received - worker_id:", worker_id); // ✅ Debug Log

  if (!worker_id) {
    return res.status(400).json({ error: "Worker ID is required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, status FROM workers WHERE id = $1",
      [worker_id]
    );

    if (result.rows.length === 0) {
      console.log("❌ Worker not found in database for ID:", worker_id);
      return res.status(404).json({ error: "Worker not found" });
    }

    console.log("✅ Worker Found in Database:", result.rows[0]); // ✅ Debug Log
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching worker profile:", error);
    res.status(500).json({ error: "Failed to fetch worker profile" });
  }
});


const { v4: uuidv4 } = require("uuid");












// **🟢 Save Extracted Tasks (Milestones)**
app.post("/api/save-tasks", async (req, res) => {
  const { project_id, tasks } = req.body;

  if (!project_id || !tasks || !Array.isArray(tasks)) {
    return res.status(400).json({ error: "Invalid project ID or tasks format" });
  }

  try {
    const values = tasks.map(task => `(${project_id}, '${task.task}', '${task.milestone}')`).join(",");
    await pool.query(`INSERT INTO milestones (project_id, name, deadline) VALUES ${values}`);

    res.json({ message: "Tasks saved as milestones" });
  } catch (error) {
    console.error("Error saving tasks:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// **🟢 Fetch Project Details**
app.get("/api/projects/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// **🟢 Fetch Tasks for a Project**
app.get("/api/project-tasks/:project_id", async (req, res) => {
  const { project_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM milestones WHERE project_id = $1", [project_id]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// **🟠 Worker Updates Availability**
app.put("/api/update-status", async (req, res) => {
  const { worker_id, status } = req.body;

  if (!worker_id || !status) {
    console.log("❌ Missing worker_id or status in request.");
    return res.status(400).json({ error: "Worker ID and status are required" });
  }

  try {
    console.log(`🔄 Updating Worker ID: ${worker_id} to Status: ${status}`);

    // ✅ Check if worker exists
    const workerExists = await pool.query("SELECT id FROM workers WHERE id = $1", [worker_id]);
    if (workerExists.rows.length === 0) {
      console.log("❌ Worker does not exist in database.");
      return res.status(404).json({ error: "Worker not found" });
    }

    // ✅ Update worker status in the database
    const result = await pool.query(
      "UPDATE workers SET status = $1 WHERE id = $2 RETURNING id, name, status",
      [status, worker_id]
    );

    if (result.rowCount === 0) {
      console.log("❌ UPDATE query did not modify any rows.");
      return res.status(500).json({ error: "Failed to update worker status" });
    }

    console.log(`✅ Worker status successfully updated: ${result.rows[0].status}`);

    res.json({
      message: `Worker status updated to ${status}`,
      worker: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Database update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});






// ✅ Get Worker Status API
app.get("/api/worker-status", async (req, res) => {
  const { worker_id } = req.query;

  if (!worker_id) {
    return res.status(400).json({ error: "Worker ID is required" });
  }

  try {
    const result = await pool.query("SELECT status FROM workers WHERE id = $1", [worker_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Worker not found" });
    }

    res.json({ status: result.rows[0].status });
  } catch (error) {
    res.status(500).json({ error: "Error fetching worker status" });
  }
})

// **🔴 Assign Task to Worker**
app.post("/api/assign-task", async (req, res) => {
  const { milestone_id, task_description, start_date, end_date } = req.body;

  try {
      // Get an available worker
      const workerResult = await pool.query(
          "SELECT id FROM workers WHERE status = 'Available' LIMIT 1"
      );

      if (workerResult.rows.length === 0) {
          return res.status(400).json({ error: "No available workers" });
      }

      const worker_id = workerResult.rows[0].id;

      // Assign task to worker
      const taskResult = await pool.query(
          "INSERT INTO tasks (milestone_id, worker_id, task_description, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5, 'Assigned') RETURNING *",
          [milestone_id, worker_id, task_description, start_date, end_date]
      );

      // Mark worker as busy
      await pool.query("UPDATE workers SET status = 'Busy' WHERE id = $1", [worker_id]);

      res.json({ message: "Task assigned successfully!", task: taskResult.rows[0] });
  } catch (error) {
      console.error("Task assignment error:", error);
      res.status(500).json({ error: "Failed to assign task" });
  }
});
app.get("/api/worker-tasks", async (req, res) => {
  const { worker_id } = req.query;

  if (!worker_id) {
      return res.status(400).json({ error: "Worker ID is required" });
  }

  try {
      const result = await pool.query(
          "SELECT id, task_description AS task, status FROM tasks WHERE worker_id = $1",
          [worker_id]
      );

      res.json(result.rows);
  } catch (error) {
      res.status(500).json({ error: "Error fetching worker tasks" });
  }
});


// **🟢 Budget Tracking**
// app.post("/api/update-budget", async (req, res) => {
//   const { project_id, new_expense } = req.body;

//   try {
//     const budget = await pool.query("SELECT total_budget, spent_amount FROM project_budget WHERE project_id = $1", [project_id]);

//     if (budget.rows.length > 0) {
//       const { total_budget, spent_amount } = budget.rows[0];
//       const updated_spent = spent_amount + new_expense;

//       if (updated_spent > total_budget) {
//         return res.json({ status: "over-budget", message: "Budget exceeded!" });
//       }

//       await pool.query("UPDATE project_budget SET spent_amount = $1 WHERE project_id = $2", [updated_spent, project_id]);
//       return res.json({ status: "ok", message: "Budget updated." });
//     }

//     res.status(404).json({ error: "Project not found" });

//   } catch (error) {
//     res.status(500).json({ error: "Error updating budget" });
//   }
// });

app.get("/api/available-tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, task_description, milestone FROM tasks WHERE assigned_worker IS NULL"
    );

    if (result.rows.length === 0) {
      return res.json({ tasks: [] }); // ✅ Return empty array instead of hanging
    }

    res.json({ tasks: result.rows });
  } catch (error) {
    console.error("❌ Error fetching available tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.get("/api/accepted-tasks", async (req, res) => {
  const { worker_id } = req.query;

  if (!worker_id) {
    return res.status(400).json({ error: "Worker ID is required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, task_description AS task, status FROM tasks WHERE assigned_worker = $1",
      [worker_id]
    );

    res.json({ tasks: result.rows });
  } catch (error) {
    console.error("❌ Error fetching worker tasks:", error);
    res.status(500).json({ error: "Error fetching worker tasks" });
  }
});

// **🟢 Save Project Details API**
// app.post("/api/save-project-details", async (req, res) => {
//   const { project_id, name, budget, beginningDate, deadline } = req.body;

//   if (!project_id || !name || !budget || !beginningDate || !deadline) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     // Check if project_id already exists
//     const projectExists = await pool.query("SELECT id FROM projects WHERE project_id = $1", [project_id]);

//     if (projectExists.rows.length > 0) {
//       return res.status(400).json({ error: "Project with this ID already exists" });
//     }

//     // Insert project details into the database
//     const result = await pool.query(
//       "INSERT INTO projects (project_id, name, budget, beginningDate, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//       [project_id, name, budget, beginningDate, deadline]
//     );

//     res.status(201).json({ message: "Project details saved successfully", project: result.rows[0] });
//   } catch (error) {
//     console.error("Error saving project details:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

app.post("/api/save-project-details", async (req, res) => {
  console.log("🔍 Incoming request body:", req.body);

  const parsedEmail = typeof req.body.email === "string" ? req.body.email : req.body.email?.email;
  console.log("📧 Parsed Email:", parsedEmail);

  const { project_id, name, budget, beginningDate, deadline } = req.body;
  const email = parsedEmail;

  if (!project_id || !name || !budget || !beginningDate || !deadline || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await pool.query("BEGIN");

    // ✅ Step 1: Check if project already exists
    const projectExists = await pool.query("SELECT project_id FROM projects WHERE project_id = $1", [project_id]);
    if (projectExists.rows.length > 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({ error: "Project with this ID already exists" });
    }

    // ✅ Step 2: Insert project (removed id column)
    const projectResult = await pool.query(
      "INSERT INTO projects (project_id, name, budget, beginningDate, deadline, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [project_id, name, budget, beginningDate, deadline, email]
    );

    await pool.query("COMMIT");
    res.status(201).json({ message: "Project details saved successfully", project: projectResult.rows[0] });

  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("❌ Error saving project details:", error);
    res.status(500).json({ error: "Server error" });
  }
});



// app.post("/api/save-project-details", async (req, res) => {
//   console.log("🔍 Incoming request body:", req.body);

//   // ✅ Properly extract email if it's in a JSON object
//   const parsedEmail = typeof req.body.email === "string" ? req.body.email : req.body.email?.email;
//   console.log("📧 Parsed Email:", parsedEmail);

//   const { project_id, name, budget, beginningDate, deadline } = req.body;
//   const email = parsedEmail; // Assign extracted email

//   if (!project_id || !name || !budget || !beginningDate || !deadline || !email) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     await pool.query("BEGIN");

//     const projectExists = await pool.query("SELECT id FROM projects WHERE project_id = $1", [project_id]);
//     if (projectExists.rows.length > 0) {
//       await pool.query("ROLLBACK");
//       return res.status(400).json({ error: "Project with this ID already exists" });
//     }

//     const projectResult = await pool.query(
//       "INSERT INTO projects (project_id, name, budget, beginningDate, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//       [project_id, name, budget, beginningDate, deadline]
//     );

//     const userUpdateResult = await pool.query(
//       "UPDATE users SET project_id = $1 WHERE email = $2 RETURNING email",
//       [project_id, email]
//     );

//     if (userUpdateResult.rowCount === 0) {
//       await pool.query("ROLLBACK");
//       return res.status(404).json({ error: "User with this email not found" });
//     }

//     await pool.query("COMMIT");
//     res.status(201).json({ message: "Project details saved successfully", project: projectResult.rows[0] });

//   } catch (error) {
//     await pool.query("ROLLBACK");
//     console.error("❌ Error saving project details:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });




app.post("/api/save-milestone", async (req, res) => {
  const { project_id, milestone_name, description, budget, beginningDate, deadline, status } = req.body;

  if (!project_id || !milestone_name || !budget || !beginningDate || !deadline || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await pool.query("BEGIN");

    // ✅ Step 1: Check if project exists
    const projectResult = await pool.query("SELECT project_id FROM projects WHERE project_id = $1", [project_id]);

    if (projectResult.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({ error: "Project ID does not exist" });
    }

    // ✅ Step 2: Insert milestone (without id, since milestone_id is auto-generated)
    const result = await pool.query(
      "INSERT INTO milestones (project_id, milestone_name, description, budget, beginningdate, deadline, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [project_id, milestone_name, description, budget, beginningDate, deadline, status]
    );

    await pool.query("COMMIT");
    res.status(201).json({ message: "Milestone saved successfully", milestone: result.rows[0] });

  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("❌ Error saving milestone:", error);
    res.status(500).json({ error: "Server error" });
  }
});




// ✅ Save milestones route
// app.post("/api/save-milestone", async (req, res) => {
//   const { project_id, milestone_name, description, budget, beginningDate, deadline, status } = req.body;

//   if (!project_id || !milestone_name || !budget || !beginningDate || !deadline || !status) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     // Check if the project exists before inserting the milestone
//     const projectExists = await pool.query("SELECT id FROM projects WHERE project_id = $1", [project_id]);

//     if (projectExists.rows.length === 0) {
//       return res.status(400).json({ error: "Project ID does not exist" });
//     }

//     // Insert milestone details into the database
//     const result = await pool.query(
//       "INSERT INTO milestones (project_id, milestone_name, description, budget, beginningdate, deadline, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
//       [project_id, milestone_name, description, budget, beginningDate, deadline, status]
//     );

//     res.status(201).json({ message: "Milestone saved successfully", milestone: result.rows[0] });
//   } catch (error) {
//     console.error("Error saving milestone:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// Get all projects
app.get("/api/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT project_id FROM projects");
    res.json({ projects: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Get milestones for a project
app.get("/api/site-engineer/project/:projectId", async (req, res) => {
  const { projectId } = req.params;
  try {
    const result = await pool.query(
      "SELECT milestone_name, status FROM milestones WHERE project_id = $1",
      [projectId]
    );
    res.json({ milestones: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// Update milestone status
app.put("/api/site-engineer/milestone", async (req, res) => {
  const { project_id, milestone_name, status } = req.body;
  if (!project_id || !milestone_name || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await pool.query(
      "UPDATE milestones SET status = $1 WHERE project_id = $2 AND milestone_name = $3",
      [status, project_id, milestone_name]
    );
    res.json({ message: "Milestone updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});







// **🏗️ Start Server**
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
