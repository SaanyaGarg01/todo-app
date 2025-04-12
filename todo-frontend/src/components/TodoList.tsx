"use client";

import { useState, useEffect } from "react";
import { Todo } from "../types/todo";
import { fetchTodos as fetchTodosAPI, updateTodo, deleteTodo } from "../lib/api";

interface Props {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  addedTodo: Todo | null;
  onSelect: (todo: Todo) => void;
}

export default function TodoList({ setTodos, addedTodo, onSelect }: Props) {
  const [todos, setLocalTodos] = useState<Todo[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTodos = async () => {
    const { todos, totalPages } = await fetchTodosAPI(page);
    setLocalTodos(todos);
    setTodos(todos);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    fetchTodos();
  }, [page]);

  useEffect(() => {
    if (addedTodo) fetchTodos();
  }, [addedTodo]);

  const toggleComplete = async (todo: Todo) => {
    const updated = await updateTodo(todo._id!, {
      completed: !todo.completed,
    });
    setLocalTodos((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
    setTodos((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    setLocalTodos((prev) => prev.filter((t) => t._id !== id));
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <span
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
              onClick={() => {
                toggleComplete(todo);
                onSelect(todo);
              }}
            >
              {todo.title}
            </span>
            <button
              onClick={() => handleDelete(todo._id!)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
