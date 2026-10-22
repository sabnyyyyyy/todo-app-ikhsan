"use client";

import { useState } from "react";
import TodoForm from "@/app/components/TodoForm";
import TodoList from "@/app/components/TodoList";
import { createTodo } from "@/lib/todos";
import type { Todo } from "@/types/todo";

interface TodoStateOnlyAppProps {
  initialTodos: Todo[];
}

export default function TodoStateOnlyApp({ initialTodos }: TodoStateOnlyAppProps) {
  // State hanya di memori: semua perubahan hilang saat halaman di-refresh.
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleAddTodo = (title: string) => {
    setTodos((prev) => [createTodo(title), ...prev]);
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-dark-70">Todo List</h1>
        <p className="text-muted">
          {completedCount} dari {todos.length} tugas selesai
        </p>
      </div>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </section>
  );
}
