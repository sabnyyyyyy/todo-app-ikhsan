export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: string;
}
