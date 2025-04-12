"use client";

import { useState } from "react";
import { addTodo } from "../lib/api";
import { Todo } from "../types/todo";

interface Props {
  onAdd: (todo: Todo) => void;
}

interface NewTodo {
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export default function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo: NewTodo = {
      title,
      description,
      date: new Date().toISOString(),
      completed: false,
    };

    const saved = await addTodo(newTodo);
    onAdd(saved);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="p-2 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description (optional)"
        className="p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
}
