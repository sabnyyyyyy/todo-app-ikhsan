import TodoStateOnlyApp from "@/app/components/TodoStateOnlyApp";
import { Container } from "@/app/components/ui/container";
import { delay, getTodos } from "@/lib/todos";

export default async function Home() {
  // Simulasi delay 3 detik agar loading.tsx terlihat
  await delay(3000);
  const initialTodos = await getTodos();

  return (
    <Container className="max-w-2xl py-10">
      <TodoStateOnlyApp initialTodos={initialTodos} />
    </Container>
  );
}
