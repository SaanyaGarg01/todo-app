const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware"); // Assuming you create a middleware to check for admin

// Create a new TODO
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate, priority, subtasks } = req.body;


    if (!title || !description) {
      return res.status(400).json({ error: "Title and Description are required" });
    }

    const todo = new Todo({
      title,
      description,
      dueDate,
      priority,
      subtasks: subtasks || [], 
      user: req.userId 
    });

    const saved = await todo.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create TODO" });
  }
});

// Get all TODOs with pagination for authenticated user
router.get("/", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; 
    const skip = (page - 1) * limit;

    const todos = await Todo.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Todo.countDocuments({ user: req.userId });

    res.json({ todos, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TODOs" });
  }
});


router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const todos = await Todo.find(); 
    res.json({ todos });
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos" });
  }
});

// Get single TODO by ID for authenticated user
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "TODO not found" });
    if (todo.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized to access this TODO" });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Error fetching TODO" });
  }
});

// Update TODO by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate, priority, subtasks } = req.body;


    if (!title && !description) {
      return res.status(400).json({ error: "At least Title or Description must be provided for update" });
    }

    const updated = await Todo.findByIdAndUpdate(req.params.id, { title, description, dueDate, priority, subtasks }, { new: true });
    if (!updated) return res.status(404).json({ error: "TODO not found" });
    if (updated.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized to update this TODO" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating TODO" });
  }
});

// Delete TODO by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "TODO not found" });
    if (deleted.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized to delete this TODO" });
    }
    res.json({ message: "TODO deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting TODO" });
  }
});

module.exports = router;
