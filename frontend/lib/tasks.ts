import { ApiError, apiClient } from "@/services/api";
import type {
  ApiTask,
  DummyTodo,
  DummyTodoListResponse,
  TaskListResult,
  TaskStats,
} from "@/types/api-todo";

// Data di-cache selama 60 detik di server Next.js
const REVALIDATE_SECONDS = 60;

export function formatTask(todo: DummyTodo): ApiTask {
  return {
    id: todo.id,
    title: todo.todo,
    completed: todo.completed,
    userId: todo.userId,
  };
}

export async function getTasks({ limit = 10, skip = 0 } = {}): Promise<TaskListResult> {
  const data = await apiClient<DummyTodoListResponse>(
    `/todos?limit=${limit}&skip=${skip}`,
    { revalidate: REVALIDATE_SECONDS },
  );

  return {
    tasks: data.todos.map(formatTask),
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  };
}

export async function getTaskById(id: number): Promise<ApiTask | null> {
  try {
    const todo = await apiClient<DummyTodo>(`/todos/${id}`, {
      revalidate: REVALIDATE_SECONDS,
    });
    return formatTask(todo);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function getTaskStats(tasks: ApiTask[]): TaskStats {
  const completed = tasks.filter((task) => task.completed).length;
  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed,
    completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
  };
}
