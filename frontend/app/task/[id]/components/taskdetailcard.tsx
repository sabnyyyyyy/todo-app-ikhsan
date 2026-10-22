import PriorityBadge from "@/app/components/PriorityBadge";
import { Badge } from "@/app/components/ui/badge";
import { LinkButton } from "@/app/components/ui/button";
import type { Todo } from "@/types/todo";

interface TaskDetailCardProps {
  todo: Todo;
}

export default function TaskDetailCard({ todo }: TaskDetailCardProps) {
  return (
    <article className="rounded-xl border border-border bg-background shadow-smooth">
      <div className="flex flex-col gap-3 border-b border-border p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={todo.completed ? "green" : "gray"}>
            {todo.completed ? "Selesai" : "Belum selesai"}
          </Badge>
          <PriorityBadge priority={todo.priority} />
        </div>
        <h1 className="text-2xl font-bold text-dark-70">{todo.title}</h1>
      </div>

      <div className="space-y-4 p-6">
        <p className="leading-relaxed text-dark-50">{todo.description}</p>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted">ID Tugas</dt>
            <dd className="font-medium text-dark-70">#{todo.id}</dd>
          </div>
          <div>
            <dt className="text-muted">Dibuat</dt>
            <dd className="font-medium text-dark-70">
              {new Date(todo.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>

      <div className="p-6 pt-0">
        <LinkButton href="/" variant="outline" size="sm">
          &larr; Kembali
        </LinkButton>
      </div>
    </article>
  );
}
