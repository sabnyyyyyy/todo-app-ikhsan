import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    sendError(res, "Token tidak ditemukan. Gunakan header Authorization: Bearer <token>", 401);
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string, {
      algorithms: ["HS256"],
    });

    const userId = typeof payload === "object" ? Number(payload.userId) : NaN;
    if (!Number.isInteger(userId) || userId <= 0) {
      sendError(res, "Token tidak valid", 401);
      return;
    }

    req.user = { id: userId };
    next();
  } catch (error) {
    const message =
      error instanceof jwt.TokenExpiredError
        ? "Token sudah kedaluwarsa, silakan login ulang"
        : "Token tidak valid";
    sendError(res, message, 401);
  }
}
