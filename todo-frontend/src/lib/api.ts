import axios from "axios";
import { Todo } from "../types/todo";
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/todos`;
export const fetchTodos = async (page = 1, limit = 5) => {
  const res = await axios.get(`${API_BASE}?page=${page}&limit=${limit}`);
  return {
    todos: res.data.todos,
    totalPages: res.data.totalPages,
  };
};
export const addTodo = async (todo: Partial<Todo>) => {
  const res = await axios.post(API_BASE, todo);
  return res.data;
};

export const updateTodo = async (id: string, updated: Partial<Todo>) => {
  const res = await axios.put(`${API_BASE}/${id}`, updated);
  return res.data;
};

export const deleteTodo = async (id: string) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};
