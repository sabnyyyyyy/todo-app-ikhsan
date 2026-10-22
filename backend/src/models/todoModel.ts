import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

export interface Todo {
  id: number;
  user_id: number;
  task: string;
  is_completed: boolean;
}

interface TodoRow extends RowDataPacket {
  id: number;
  user_id: number;
  task: string;
  is_completed: number; // TINYINT(1) dari MySQL berupa 0 / 1
}

function toTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    user_id: row.user_id,
    task: row.task,
    is_completed: Boolean(row.is_completed),
  };
}

export async function findTodosByUserId(
  userId: number,
  { limit, offset }: { limit: number; offset: number },
): Promise<Todo[]> {
  // pool.query (bukan execute) karena prepared statement MySQL 8 menolak LIMIT ? bertipe angka
  const [rows] = await pool.query<TodoRow[]>(
    "SELECT id, user_id, task, is_completed FROM todos WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?",
    [userId, limit, offset],
  );
  return rows.map(toTodo);
}

export async function countTodosByUserId(userId: number): Promise<number> {
  const [rows] = await pool.execute<(RowDataPacket & { total: number })[]>(
    "SELECT COUNT(*) AS total FROM todos WHERE user_id = ?",
    [userId],
  );
  return Number(rows[0]?.total ?? 0);
}

// Selalu filter dengan user_id agar user tidak bisa mengakses todo milik user lain
export async function findTodoById(id: number, userId: number): Promise<Todo | null> {
  const [rows] = await pool.execute<TodoRow[]>(
    "SELECT id, user_id, task, is_completed FROM todos WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId],
  );
  return rows[0] ? toTodo(rows[0]) : null;
}

export async function createTodo(userId: number, task: string): Promise<Todo> {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO todos (user_id, task, is_completed) VALUES (?, ?, 0)",
    [userId, task],
  );
  return { id: result.insertId, user_id: userId, task, is_completed: false };
}

export interface TodoUpdate {
  task?: string;
  is_completed?: boolean;
}

export async function updateTodo(
  id: number,
  userId: number,
  changes: TodoUpdate,
): Promise<Todo | null> {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (changes.task !== undefined) {
    fields.push("task = ?");
    values.push(changes.task);
  }
  if (changes.is_completed !== undefined) {
    fields.push("is_completed = ?");
    values.push(changes.is_completed ? 1 : 0);
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE todos SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
    [...values, id, userId],
  );
  if (result.affectedRows === 0) return null;

  return findTodoById(id, userId);
}

export async function deleteTodo(id: number, userId: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM todos WHERE id = ? AND user_id = ?",
    [id, userId],
  );
  return result.affectedRows > 0;
}
