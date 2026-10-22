"use client";

import TodoForm from "@/app/components/TodoForm";
import TodoList from "@/app/components/TodoList";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createTodo } from "@/lib/todos";
import type { Todo } from "@/types/todo";

interface TodoCachedAppProps {
  initialTodos: Todo[];
}

export default function TodoCachedApp({ initialTodos }: TodoCachedAppProps) {
  const [todos, setTodos, clearTodos, isCached] = useLocalStorage<Todo[]>(
    "TODO_LIST_CACHE",
    initialTodos,
  );

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

  const handleReset = () => {
    clearTodos();
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-dark-70">Todo List (Cached)</h1>
          <p className="text-muted">
            {completedCount} dari {todos.length} tugas selesai
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isCached ? "green" : "gray"} size="sm">
            {isCached ? "Tersimpan di localStorage" : "Data awal server"}
          </Badge>
          <Button
            type="button"
            variant="outline-secondary"
            size="xs"
            onClick={handleReset}
            disabled={!isCached}
          >
            Reset
          </Button>
        </div>
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
