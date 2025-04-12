
const Todo = require("../models/Todo");

exports.getTodos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const todos = await Todo.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Todo.countDocuments();

    res.json({ todos, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.addTodo = async (req, res) => {
  const { title, description, dueDate, priority, subtasks } = req.body;

  const newTodo = new Todo({
    title,
    description,
    dueDate,
    priority,
    subtasks,
  });

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
