import { apiClient } from "@/services/api";
import type { DummyTodo } from "@/types/api-todo";

// Operasi mutasi (Create & Update) langsung ke DummyJSON.
// DummyJSON hanya mensimulasikan perubahan, data aslinya tidak ikut berubah.
export const todoService = {
  create(title: string, userId = 1) {
    return apiClient<DummyTodo>("/todos/add", {
      method: "POST",
      body: JSON.stringify({ todo: title, completed: false, userId }),
    });
  },

  updateStatus(id: number, completed: boolean) {
    return apiClient<DummyTodo>(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ completed }),
    });
  },
};
