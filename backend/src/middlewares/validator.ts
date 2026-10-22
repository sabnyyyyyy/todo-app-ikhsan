import type { NextFunction, Request, Response } from "express";
import type {
  CreateTodoRequest,
  LoginRequest,
  RegisterRequest,
  TodoQuery,
  UpdateTodoRequest,
} from "../types";
import { sendError } from "../utils/response";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PER_PAGE = 100;

type Body = Record<string, unknown>;

function getBody(req: Request): Body {
  return typeof req.body === "object" && req.body !== null ? (req.body as Body) : {};
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function rejectIfErrors(res: Response, errors: string[]): boolean {
  if (errors.length === 0) return false;
  sendError(res, "Validasi gagal", 400, errors);
  return true;
}

// POST /api/auth/register  body: { nama | username, email, password }
export function validateRegister(req: Request, res: Response, next: NextFunction) {
  const body = getBody(req);
  const data: RegisterRequest = {
    nama: asTrimmedString(body.nama ?? body.username),
    email: asTrimmedString(body.email).toLowerCase(),
    password: typeof body.password === "string" ? body.password : "",
  };
  const errors: string[] = [];

  if (data.nama.length < 3 || data.nama.length > 100) {
    errors.push("nama/username wajib diisi (3-100 karakter)");
  }
  if (!EMAIL_PATTERN.test(data.email) || data.email.length > 150) {
    errors.push("email wajib diisi dengan format yang valid");
  }
  // bcrypt hanya memproses 72 byte pertama, jadi batasi panjang password
  if (data.password.length < 8 || Buffer.byteLength(data.password) > 72) {
    errors.push("password wajib diisi (8-72 karakter)");
  }

  if (rejectIfErrors(res, errors)) return;
  req.body = data;
  next();
}

// POST /api/auth/login  body: { email, password }
export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const body = getBody(req);
  const data: LoginRequest = {
    email: asTrimmedString(body.email).toLowerCase(),
    password: typeof body.password === "string" ? body.password : "",
  };
  const errors: string[] = [];

  if (!EMAIL_PATTERN.test(data.email)) errors.push("email wajib diisi dengan format yang valid");
  if (!data.password) errors.push("password wajib diisi");

  if (rejectIfErrors(res, errors)) return;
  req.body = data;
  next();
}

// POST /api/todos  body: { task }
export function validateTodo(req: Request, res: Response, next: NextFunction) {
  const data: CreateTodoRequest = { task: asTrimmedString(getBody(req).task) };
  const errors: string[] = [];

  if (!data.task || data.task.length > 255) errors.push("task wajib diisi (maksimal 255 karakter)");

  if (rejectIfErrors(res, errors)) return;
  req.body = data;
  next();
}

// PUT /api/todos/:id  body: { task?, completed? } (minimal salah satu)
// is_completed masih diterima agar request lama (Tugas #5) tetap berjalan
export function validateUpdateTodo(req: Request, res: Response, next: NextFunction) {
  const body = getBody(req);
  const completed = body.completed ?? body.is_completed;
  const data: UpdateTodoRequest = {};
  const errors: string[] = [];

  if (body.task !== undefined) {
    const task = asTrimmedString(body.task);
    if (!task || task.length > 255) errors.push("task harus berupa teks (1-255 karakter)");
    else data.task = task;
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") errors.push("completed harus bernilai true atau false");
    else data.completed = completed;
  }

  if (body.task === undefined && completed === undefined) {
    errors.push("kirim minimal salah satu field: task atau completed");
  }

  if (rejectIfErrors(res, errors)) return;
  req.body = data;
  next();
}

// Untuk rute /api/todos/:id — id harus bilangan bulat positif
export function validateIdParam(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    sendError(res, "ID todo harus berupa angka positif", 400);
    return;
  }
  next();
}

function parsePositiveInt(value: unknown, fallback: number): number | null {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

// GET /api/todos?page=1&perPage=5
export function validatePagination(req: Request, res: Response, next: NextFunction) {
  const page = parsePositiveInt(req.query.page, 1);
  const perPage = parsePositiveInt(req.query.perPage, 10);
  const errors: string[] = [];

  if (page === null) errors.push("page harus berupa angka positif");
  if (perPage === null || perPage > MAX_PER_PAGE) {
    errors.push(`perPage harus berupa angka 1-${MAX_PER_PAGE}`);
  }

  if (rejectIfErrors(res, errors)) return;
  const query: TodoQuery = { page: page as number, perPage: perPage as number };
  res.locals.pagination = query;
  next();
}
