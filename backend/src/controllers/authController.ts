import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";
import { sendError, sendSuccess } from "../utils/response";

const SALT_ROUNDS = 10;

// Hash palsu untuk dibandingkan saat email tidak terdaftar, supaya waktu respons
// login sama saja dan tidak bisa dipakai menebak email mana yang terdaftar.
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", SALT_ROUNDS);

function isDuplicateEntry(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY";
}

export async function register(req: Request, res: Response) {
  const { nama, email, password } = req.body as RegisterRequest;

  if (await findUserByEmail(email)) {
    sendError(res, "Email sudah terdaftar", 409);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const id = await createUser({ nama, email, password: hashedPassword });
    const data: AuthResponse = { user: { id, nama, email } };
    sendSuccess(res, data, "Registrasi berhasil", 201);
  } catch (error) {
    // Bisa terjadi jika dua request register dengan email sama masuk bersamaan
    if (isDuplicateEntry(error)) {
      sendError(res, "Email sudah terdaftar", 409);
      return;
    }
    throw error;
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginRequest;

  const user = await findUserByEmail(email);
  const passwordMatches = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);

  if (!user || !passwordMatches) {
    sendError(res, "Email atau password salah", 401);
    return;
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    algorithm: "HS256",
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as jwt.SignOptions["expiresIn"],
  });

  const data: AuthResponse = {
    user: { id: user.id, nama: user.nama, email: user.email },
    token,
  };
  sendSuccess(res, data, "Login berhasil");
}
