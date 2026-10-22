"use client";

import Link from "next/link";
import PriorityBadge from "@/app/components/PriorityBadge";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 shadow-smooth">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Tandai ${todo.title} selesai`}
        className="h-5 w-5 shrink-0 cursor-pointer accent-primary-70"
      />
      <div className="min-w-0 flex-1">
        <Link
          href={`/task/${todo.id}`}
          className={cn(
            "block truncate font-medium text-dark-70 hover:text-primary-70",
            todo.completed && "text-gray-100 line-through",
          )}
        >
          {todo.title}
        </Link>
        {todo.description && (
          <p className="truncate text-sm text-muted">{todo.description}</p>
        )}
      </div>
      <PriorityBadge priority={todo.priority} />
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className="text-danger-80 hover:bg-danger-10 hover:text-danger-100"
        onClick={() => onDelete(todo.id)}
      >
        Hapus
      </Button>
    </li>
  );
}
