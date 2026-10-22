import type { Response } from "express";
import type {
  ErrorResponse,
  PaginatedResponse,
  PaginationMeta,
  ResponseMeta,
  SuccessResponse,
} from "../types";

export function getTimestamp(): string {
  return new Date().toISOString();
}

function buildMeta(res: Response): ResponseMeta {
  const requestId = res.getHeader("X-Request-Id");
  return {
    timestamp: getTimestamp(),
    ...(typeof requestId === "string" && { requestId }),
  };
}

export function sendSuccess<T>(res: Response, data: T, message = "Berhasil", status = 200) {
  const body: SuccessResponse<T> = { success: true, message, data, meta: buildMeta(res) };
  res.status(status).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message = "Berhasil",
  status = 200,
) {
  const body: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    meta: { ...buildMeta(res), pagination },
  };
  res.status(status).json(body);
}

export function sendError(res: Response, message: string, status = 500, errors?: string[]) {
  const body: ErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
    meta: buildMeta(res),
  };
  res.status(status).json(body);
}
