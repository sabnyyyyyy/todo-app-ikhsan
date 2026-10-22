import type { Metadata } from "next";
import { Container } from "@/app/components/ui/container";
import { getTodos } from "@/lib/todos";
import TodoCachedApp from "./components/TodoCachedApp";

export const metadata: Metadata = {
  title: "Cached Todo | Todo App",
};

export default async function CachedPage() {
  const initialTodos = await getTodos();

  return (
    <Container className="max-w-2xl py-10">
      <TodoCachedApp initialTodos={initialTodos} />
    </Container>
  );
}
