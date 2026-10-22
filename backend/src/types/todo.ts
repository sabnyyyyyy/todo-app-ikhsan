// Kontrak request & response untuk endpoint /api/todos

export interface CreateTodoRequest {
  task: string;
}

export interface UpdateTodoRequest {
  task?: string;
  completed?: boolean;
}

export interface TodoResponse {
  id: number;
  userId: number;
  task: string;
  completed: boolean;
}

export interface TodoQuery {
  page: number;
  perPage: number;
}
