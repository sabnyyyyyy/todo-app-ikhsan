// Bentuk data asli dari DummyJSON API (https://dummyjson.com/todos)
export interface DummyTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface DummyTodoListResponse {
  todos: DummyTodo[];
  total: number;
  skip: number;
  limit: number;
}

// Bentuk data yang sudah dirapikan untuk dipakai di UI
export interface ApiTask {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface TaskListResult {
  tasks: ApiTask[];
  total: number;
  skip: number;
  limit: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

// Format respons standar untuk semua Route Handler internal
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  meta?: Record<string, number>;
}
