import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface User {
  id: number;
  nama: string;
  email: string;
  password: string;
}

type UserRow = User & RowDataPacket;

export async function findUserByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.execute<UserRow[]>(
    "SELECT id, nama, email, password FROM auth WHERE email = ? LIMIT 1",
    [email],
  );
  return rows[0] ?? null;
}

export async function createUser(data: Omit<User, "id">): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO auth (nama, email, password) VALUES (?, ?, ?)",
    [data.nama, data.email, data.password],
  );
  return result.insertId;
}
