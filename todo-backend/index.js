const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/todos")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Todo Model
const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});
const Todo = mongoose.model("Todo", TodoSchema);

// Routes
app.get("/", (req, res) => {
  res.send("🎉 Todo API is running");
});

// GET todos (paginated)
app.get("/api/todos", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const todos = await Todo.find()
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Todo.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({ todos, totalPages });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch todos", error: err });
  }
});

// POST new todo
app.post("/api/todos", async (req, res) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ message: "Failed to add todo", error: err });
  }
});

// PUT update todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update todo", error: err });
  }
});

// DELETE todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete todo", error: err });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
