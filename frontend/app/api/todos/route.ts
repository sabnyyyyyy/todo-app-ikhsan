import { NextRequest, NextResponse } from "next/server";
import { formatTask, getTasks } from "@/lib/tasks";
import { todoService } from "@/services/todoService";
import type { ApiResponse, ApiTask } from "@/types/api-todo";

function toNumber(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (value === null || !Number.isInteger(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

// GET /api/todos?limit=10&skip=0
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = toNumber(searchParams.get("limit"), 10, 1, 100);
  const skip = toNumber(searchParams.get("skip"), 0, 0, Number.MAX_SAFE_INTEGER);

  try {
    const result = await getTasks({ limit, skip });

    return NextResponse.json<ApiResponse<ApiTask[]>>({
      success: true,
      data: result.tasks,
      meta: { total: result.total, skip: result.skip, limit: result.limit },
    });
  } catch (error) {
    console.error("GET /api/todos gagal", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, message: "Gagal mengambil daftar tugas." },
      { status: 500 },
    );
  }
}

// POST /api/todos  body: { "title": "..." }
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, message: "Body request harus berupa JSON." },
      { status: 400 },
    );
  }

  const title =
    typeof body === "object" && body !== null && "title" in body ? body.title : undefined;

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, message: "Field 'title' wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const created = await todoService.create(title.trim());

    return NextResponse.json<ApiResponse<ApiTask>>(
      { success: true, data: formatTask(created), message: "Tugas berhasil dibuat (simulasi)." },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/todos gagal", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, message: "Gagal membuat tugas." },
      { status: 500 },
    );
  }
}
