"use client";

import { useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { getTaskStats } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { todoService } from "@/services/todoService";
import type { ApiTask } from "@/types/api-todo";

interface ApiTodoListProps {
  initialTasks: ApiTask[];
  total: number;
}

export default function ApiTodoList({ initialTasks, total }: ApiTodoListProps) {
  const [tasks, setTasks] = useState<ApiTask[]>(initialTasks);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const [error, setError] = useState("");

  const setTaskCompleted = (id: number, completed: boolean) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed } : task)),
    );
  };

  const handleToggle = async (task: ApiTask) => {
    const nextCompleted = !task.completed;

    // Optimistic update: ubah UI dulu, baru kirim request ke API.
    setTaskCompleted(task.id, nextCompleted);
    setPendingIds((prev) => [...prev, task.id]);
    setError("");

    try {
      await todoService.updateStatus(task.id, nextCompleted);
    } catch (err) {
      console.error(err);
      // Kembalikan ke kondisi semula jika request gagal.
      setTaskCompleted(task.id, task.completed);
      setError(`Gagal memperbarui "${task.title}". Perubahan dibatalkan.`);
    } finally {
      setPendingIds((prev) => prev.filter((id) => id !== task.id));
    }
  };

  const stats = getTaskStats(tasks);

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-dark-70">API Todos</h1>
          <p className="text-muted">
            Menampilkan {tasks.length} dari {total} tugas dari DummyJSON API
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="blue" size="sm">Total: {stats.total}</Badge>
          <Badge variant="green" size="sm">Selesai: {stats.completed}</Badge>
          <Badge variant="yellow" size="sm">Belum: {stats.pending}</Badge>
          <Badge variant="purple" size="sm">Progress: {stats.completionRate}%</Badge>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-danger-30 bg-danger-10 px-4 py-3 text-sm text-danger-100">
          {error}
        </p>
      )}

      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-80 p-8 text-center text-muted">
          Tidak ada data tugas dari API.
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const isPending = pendingIds.includes(task.id);
            return (
              <li
                key={task.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border border-border bg-background p-4 shadow-smooth transition-opacity",
                  isPending && "opacity-60",
                )}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task)}
                  disabled={isPending}
                  aria-label={`Tandai ${task.title} selesai`}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-primary-70"
                />
                <span
                  className={cn(
                    "flex-1 font-medium text-dark-70",
                    task.completed && "text-gray-100 line-through",
                  )}
                >
                  {task.title}
                </span>
                <span className="text-xs text-muted">
                  {isPending ? "Menyimpan..." : `#${task.id}`}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
