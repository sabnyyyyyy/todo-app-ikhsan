import { NextRequest, NextResponse } from "next/server";
import { getTaskById } from "@/lib/tasks";
import type { ApiResponse, ApiTask } from "@/types/api-todo";

type TodoRouteContext = RouteContext<"/api/todos/[id]">;

// GET /api/todos/:id
export async function GET(_request: NextRequest, context: TodoRouteContext) {
  const { id } = await context.params;
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, message: "ID tugas tidak valid." },
      { status: 400 },
    );
  }

  try {
    const task = await getTaskById(taskId);

    if (!task) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, data: null, message: `Tugas dengan ID ${taskId} tidak ditemukan.` },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<ApiTask>>({ success: true, data: task });
  } catch (error) {
    console.error(`GET /api/todos/${id} gagal`, error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, message: "Gagal mengambil detail tugas." },
      { status: 500 },
    );
  }
}
