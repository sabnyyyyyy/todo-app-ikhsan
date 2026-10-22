import { Badge } from "@/app/components/ui/badge";
import type { TodoPriority } from "@/types/todo";

const priorityConfig: Record<
  TodoPriority,
  { label: string; variant: "red" | "yellow" | "blue" }
> = {
  high: { label: "Tinggi", variant: "red" },
  medium: { label: "Sedang", variant: "yellow" },
  low: { label: "Rendah", variant: "blue" },
};

export default function PriorityBadge({ priority }: { priority: TodoPriority }) {
  const { label, variant } = priorityConfig[priority];
  return <Badge variant={variant}>{label}</Badge>;
}
