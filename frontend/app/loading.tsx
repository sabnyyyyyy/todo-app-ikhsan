import { Container } from "@/app/components/ui/container";

export default function Loading() {
  return (
    <Container className="max-w-2xl py-10">
      <div className="animate-pulse space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-md bg-gray-80" />
          <div className="h-4 w-72 rounded-md bg-gray-70" />
        </div>
        <div className="h-12 rounded-md bg-gray-70" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-70" />
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted">Memuat data...</p>
    </Container>
  );
}
