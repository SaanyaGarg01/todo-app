const mongoose = require("mongoose");

// Subtask schema for individual subtasks
const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false } // Prevents generating an _id for each subtask
);

// Todo schema
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: false }, // Optional field
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    subtasks: [subtaskSchema], // Array of subtasks
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who created the todo
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Todo model
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
