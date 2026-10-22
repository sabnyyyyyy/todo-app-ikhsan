import type { Todo } from "@/types/todo";

// Data dummy sementara, nanti diganti dengan data dari API.
const todos: Todo[] = [
  {
    id: 1,
    title: "Belajar App Router Next.js",
    description:
      "Memahami routing berbasis folder, route group, dan dynamic route di Next.js.",
    completed: true,
    priority: "high",
    createdAt: "2026-10-20",
  },
  {
    id: 2,
    title: "Membuat loading.tsx dan error.tsx",
    description:
      "Menambahkan UI fallback saat data diproses dan error boundary di sisi klien.",
    completed: true,
    priority: "medium",
    createdAt: "2026-10-21",
  },
  {
    id: 3,
    title: "Modularisasi komponen todo-list",
    description:
      "Memecah UI menjadi TodoForm, TodoItem, dan TodoList agar mudah di-maintain.",
    completed: false,
    priority: "high",
    createdAt: "2026-10-22",
  },
  {
    id: 4,
    title: "Push project ke GitHub",
    description: "Commit semua perubahan lalu push ke repository GitHub.",
    completed: false,
    priority: "low",
    createdAt: "2026-10-22",
  },
];

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createTodo(title: string): Todo {
  return {
    id: Date.now(),
    title,
    description: "",
    completed: false,
    priority: "medium",
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

export async function getTodos(): Promise<Todo[]> {
  return todos;
}

export async function getTodoById(id: number): Promise<Todo | undefined> {
  return todos.find((todo) => todo.id === id);
}
