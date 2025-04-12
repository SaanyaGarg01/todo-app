'use client';

import { useEffect, useState } from "react";
import { Todo, NewTodo } from "../types/todo";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../lib/api";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState<NewTodo>({
    title: "",
    description: "",
    date: "", // initially empty
    completed: false,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadTodos();
  }, [page]);

  // Set date only on client to avoid hydration issues
  useEffect(() => {
    setNewTodo((prev) => ({
      ...prev,
      date: new Date().toISOString(),
    }));
  }, []);

  const loadTodos = async () => {
    const { todos, totalPages } = await fetchTodos(page);
    setTodos(todos);
    setTotalPages(totalPages);
  };

  const handleAdd = async () => {
    if (!newTodo.title.trim()) return;
    const added = await addTodo(newTodo);
    setTodos((prev) => [added, ...prev]);
    setNewTodo({
      title: "",
      description: "",
      date: new Date().toISOString(), // still okay here since it's not during initial render
      completed: false,
    });
  };

  const handleUpdate = async (field: keyof Todo, value: any) => {
    if (!selectedTodo) return;
    const updatedTodo = { ...selectedTodo, [field]: value };
    setSelectedTodo(updatedTodo);
    await updateTodo(selectedTodo._id, { [field]: value });
    await loadTodos();
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    await deleteTodo(id);
    setTodos((prev) => prev.filter((todo) => todo._id !== id));
    setSelectedTodo(null);
  };

  const toggleComplete = async (todo: Todo) => {
    await updateTodo(todo._id, { completed: !todo.completed });
    await loadTodos();
  };

  return (
    <>
      {/* LOGO HEADER */}
      <header className="flex justify-center items-center gap-3 py-6 bg-white shadow-md">
        <h1 className="text-4xl font-extrabold text-blue-700">TODO List</h1>
      </header>

      {/* MAIN TODO APP */}
      <main className="min-h-screen flex text-gray-800 bg-gradient-to-tr from-blue-50 to-purple-100 font-sans">
        {/* Left Panel: Todo List */}
        <div className="w-1/2 p-6 border-r border-gray-300 overflow-y-auto bg-white/70 backdrop-blur-md shadow-xl">
          <img src="favicon.ico" alt="Logo" className="w-50 h-12" />
          <h2 className="text-2xl font-bold mb-6 text-blue-700">📋 Your Todos</h2>

          <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
            {todos.map((todo) => (
              <div
                key={todo._id}
                onClick={() => setSelectedTodo(todo)}
                className={`p-4 rounded-xl shadow hover:shadow-lg transition duration-300 border cursor-pointer ${
                  selectedTodo?._id === todo._id ? "bg-blue-100 border-blue-400" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-blue-600"
                    />
                    <h2 className={`font-semibold text-lg ${todo.completed ? "line-through text-gray-400" : ""}`}>
                      {todo.title}
                    </h2>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-1">{todo.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(todo.date).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Status: {todo.completed ? "✅ Completed" : "⏳ Incomplete"}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 disabled:opacity-40"
            >
              ◀ Prev
            </button>
            <span className="text-sm font-medium text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 disabled:opacity-40"
            >
              Next ▶
            </button>
          </div>

          {/* Add Todo */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-purple-700 mb-2">➕ Add New Todo</h2>
            <input
              type="text"
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="w-full p-2 border rounded mb-2 focus:outline-blue-300"
            />
            <textarea
              placeholder="Description"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="w-full p-2 border rounded mb-2 focus:outline-blue-300"
            />
            <button
              onClick={handleAdd}
              className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition"
            >
              Add Todo
            </button>
          </div>
        </div>

        {/* Right Panel: Edit Todo */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md">
          {selectedTodo ? (
            <div className="w-full max-w-xl">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">📝 Edit Todo</h2>
              <input
                type="text"
                value={selectedTodo.title}
                onChange={(e) => handleUpdate("title", e.target.value)}
                className="w-full p-3 border rounded mb-3 focus:outline-blue-400"
              />
              <textarea
                value={selectedTodo.description}
                onChange={(e) => handleUpdate("description", e.target.value)}
                className="w-full p-3 border rounded mb-4 focus:outline-blue-400"
                rows={5}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdate("completed", !selectedTodo.completed)}
                  className={`px-4 py-2 rounded text-white shadow ${
                    selectedTodo.completed ? "bg-gray-500 hover:bg-gray-600" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {selectedTodo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                </button>
                <button
                  onClick={() => handleDelete(selectedTodo._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 shadow"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-lg text-center">Click a todo to view & edit</p>
          )}
        </div>
      </main>
    </>
  );
}
