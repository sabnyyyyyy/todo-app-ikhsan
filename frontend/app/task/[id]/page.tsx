import { Container } from "@/app/components/ui/container";
import { delay, getTodoById } from "@/lib/todos";
import TaskDetailCard from "./components/taskdetailcard";
import TaskNotFound from "./components/tasknotfound";

export default async function TaskDetailPage({ params }: PageProps<"/task/[id]">) {
  const { id } = await params;

  // Simulasi delay agar loading.tsx terlihat
  await delay(1500);
  const todo = await getTodoById(Number(id));

  return (
    <Container className="max-w-2xl py-10">
      {todo ? <TaskDetailCard todo={todo} /> : <TaskNotFound id={id} />}
    </Container>
  );
}
