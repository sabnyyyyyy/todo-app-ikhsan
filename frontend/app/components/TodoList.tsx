"use client";

import TodoItem from "@/app/components/TodoItem";
import type { Todo } from "@/types/todo";

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

export default function TodoList({ todos, onToggleTodo, onDeleteTodo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-80 p-8 text-center text-muted">
        Belum ada tugas. Tambahkan tugas pertamamu!
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
        />
      ))}
    </ul>
  );
}
