"use client";

import { useEffect, useState } from "react";

interface Todo {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  dueDate?: string;
  priority?: string;
  subtasks?: { title: string; completed: boolean }[];
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    subtasks: [{ title: "", completed: false }],
  });

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found, please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/todos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch todos: ${res.status}`);
        }

        const data = await res.json();
        setTodos(data.todos || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (!res.ok) {
        throw new Error(`Failed to add todo: ${res.status}`);
      }

      const data = await res.json();
      setTodos([...todos, data]);
      setNewTodo({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        subtasks: [{ title: "", completed: false }],
      }); // Reset form after submission
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Todos</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && todos.length === 0 && <p>No todos found.</p>}

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="p-4 border rounded shadow-sm hover:bg-gray-100"
          >
            <h2 className="font-semibold">{todo.title}</h2>
            <p>{todo.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(todo.createdAt).toLocaleString()}
            </p>
            {todo.dueDate && (
              <p className="text-sm">Due Date: {new Date(todo.dueDate).toLocaleDateString()}</p>
            )}
            {todo.priority && (
              <p className="text-sm">Priority: {todo.priority}</p>
            )}
            {todo.subtasks && (
              <ul className="ml-4">
                {todo.subtasks.map((subtask, index) => (
                  <li key={index}>
                    {subtask.title} -{" "}
                    {subtask.completed ? "Completed" : "Incomplete"}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Add Todo Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="p-2 border rounded w-full"
          value={newTodo.title}
          onChange={(e) =>
            setNewTodo({ ...newTodo, title: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          className="p-2 border rounded w-full"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
        />
        <input
          type="date"
          className="p-2 border rounded w-full"
          value={newTodo.dueDate}
          onChange={(e) =>
            setNewTodo({ ...newTodo, dueDate: e.target.value })
          }
        />
        <select
          className="p-2 border rounded w-full"
          value={newTodo.priority}
          onChange={(e) =>
            setNewTodo({ ...newTodo, priority: e.target.value })
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Add Todo
        </button>
      </form>
    </div>
  );
}
