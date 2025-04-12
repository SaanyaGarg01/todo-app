const mongoose = require("mongoose");


const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false } 
);
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: false },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    subtasks: [subtaskSchema], 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who created the todo
  },
  { timestamps: true } 
);


const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
