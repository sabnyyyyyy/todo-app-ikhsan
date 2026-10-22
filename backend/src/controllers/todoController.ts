import type { Request, Response } from "express";
import {
  countTodosByUserId,
  createTodo as insertTodo,
  deleteTodo as deleteTodoById,
  findTodoById,
  findTodosByUserId,
  updateTodo as updateTodoById,
  type Todo,
} from "../models/todoModel";
import type {
  CreateTodoRequest,
  PaginationMeta,
  TodoQuery,
  TodoResponse,
  UpdateTodoRequest,
} from "../types";
import { sendError, sendPaginated, sendSuccess } from "../utils/response";

// Ubah nama kolom database (snake_case) menjadi field response
function toTodoResponse(todo: Todo): TodoResponse {
  return {
    id: todo.id,
    userId: todo.user_id,
    task: todo.task,
    completed: todo.is_completed,
  };
}

function buildPagination({ page, perPage }: TodoQuery, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / perPage);
  return {
    page,
    perPage,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

function notFound(res: Response, id: number) {
  sendError(res, `Todo dengan id ${id} tidak ditemukan`, 404);
}

export async function getTodos(req: Request, res: Response) {
  const userId = req.user!.id;
  const query = res.locals.pagination as TodoQuery;

  const [todos, total] = await Promise.all([
    findTodosByUserId(userId, { limit: query.perPage, offset: (query.page - 1) * query.perPage }),
    countTodosByUserId(userId),
  ]);

  sendPaginated(res, todos.map(toTodoResponse), buildPagination(query, total), "Daftar todo berhasil diambil");
}

export async function getTodoById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const todo = await findTodoById(id, req.user!.id);

  if (!todo) {
    notFound(res, id);
    return;
  }
  sendSuccess(res, toTodoResponse(todo), "Detail todo berhasil diambil");
}

export async function createTodo(req: Request, res: Response) {
  const { task } = req.body as CreateTodoRequest;
  const todo = await insertTodo(req.user!.id, task);

  sendSuccess(res, toTodoResponse(todo), "Todo berhasil ditambahkan", 201);
}

export async function updateTodo(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { task, completed } = req.body as UpdateTodoRequest;
  const todo = await updateTodoById(id, req.user!.id, {
    ...(task !== undefined && { task }),
    ...(completed !== undefined && { is_completed: completed }),
  });

  if (!todo) {
    notFound(res, id);
    return;
  }
  sendSuccess(res, toTodoResponse(todo), "Todo berhasil diperbarui");
}

export async function deleteTodo(req: Request, res: Response) {
  const id = Number(req.params.id);
  const deleted = await deleteTodoById(id, req.user!.id);

  if (!deleted) {
    notFound(res, id);
    return;
  }
  sendSuccess(res, null, `Todo dengan id ${id} berhasil dihapus`);
}
