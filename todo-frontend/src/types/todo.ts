export interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  
}

export interface NewTodo {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  
}
