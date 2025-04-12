
"use client";

import { Todo } from "../types/todo";

interface Props {
  todo: Todo;
}

export default function TodoDetail({ todo }: Props) {
  return (
    <div className="p-4 border rounded bg-gray-100 mt-4">
      <h2 className="text-lg font-bold mb-2">Todo Details</h2>
      <p><strong>Title:</strong> {todo.title}</p>
      <p><strong>Description:</strong> {todo.description || "N/A"}</p>
      <p><strong>Status:</strong> {todo.completed ? "Completed" : "Incomplete"}</p>
      <p><strong>Date:</strong> {new Date(todo.date).toLocaleString()}</p>
    </div>
  );
}
