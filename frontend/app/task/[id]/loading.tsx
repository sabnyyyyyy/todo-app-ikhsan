import { Container } from "@/app/components/ui/container";

export default function TaskDetailLoading() {
  return (
    <Container className="max-w-2xl py-10">
      <div className="animate-pulse rounded-xl border border-border bg-background p-6">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-gray-70" />
          <div className="h-5 w-14 rounded-full bg-gray-70" />
        </div>
        <div className="mt-4 h-7 w-3/4 rounded-md bg-gray-80" />
        <div className="mt-6 space-y-2">
          <div className="h-4 rounded-md bg-gray-70" />
          <div className="h-4 w-5/6 rounded-md bg-gray-70" />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted">Memuat detail tugas...</p>
    </Container>
  );
}
