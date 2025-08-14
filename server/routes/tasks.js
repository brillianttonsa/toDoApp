import express from "express";
import pool from "../config/database.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all tasks for user
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json({ tasks: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, priority, category, due_date } = req.body;

    const result = await pool.query(
      "INSERT INTO tasks (user_id, title, description, priority, category, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.user.id, title, description, priority, category, due_date]
    );

    res.status(201).json({ task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, category, due_date, completed } = req.body;

    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, priority = $3, category = $4, due_date = $5, completed = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 AND user_id = $8 RETURNING *",
      [title, description, priority, category, due_date, completed, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
