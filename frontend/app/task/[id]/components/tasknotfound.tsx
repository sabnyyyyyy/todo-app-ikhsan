import { LinkButton } from "@/app/components/ui/button";

interface TaskNotFoundProps {
  id: string;
}

export default function TaskNotFound({ id }: TaskNotFoundProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-80 bg-background p-10 text-center">
      <p className="text-5xl font-bold text-gray-90">404</p>
      <h1 className="mt-3 text-xl font-bold text-dark-70">Tugas tidak ditemukan</h1>
      <p className="mt-2 text-sm text-muted">
        Tugas dengan ID <span className="font-semibold">{id}</span> tidak ada atau
        sudah dihapus.
      </p>
      <LinkButton href="/" size="sm" className="mt-6">
        Kembali ke daftar tugas
      </LinkButton>
    </div>
  );
}
