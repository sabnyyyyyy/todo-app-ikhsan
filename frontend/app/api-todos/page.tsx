import type { Metadata } from "next";
import { Container } from "@/app/components/ui/container";
import { getTasks } from "@/lib/tasks";
import ApiTodoList from "./components/ApiTodoList";

export const metadata: Metadata = {
  title: "API Todos | Todo App",
};

export default async function ApiTodosPage() {
  const { tasks, total } = await getTasks({ limit: 10 });

  return (
    <Container className="max-w-2xl py-10">
      <ApiTodoList initialTasks={tasks} total={total} />
    </Container>
  );
}
