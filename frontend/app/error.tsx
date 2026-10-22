"use client";

import { useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Container } from "@/app/components/ui/container";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const message =
    error instanceof Error ? error.message : "Terjadi kesalahan tak terduga.";

  return (
    <Container className="max-w-2xl py-10">
      <div className="rounded-xl border border-danger-30 bg-danger-10 p-6 text-center">
        <h2 className="text-xl font-bold text-danger-110">
          Oops, terjadi kesalahan!
        </h2>
        <p className="mt-2 text-sm text-danger-100">{message}</p>
        <Button variant="destructive" size="sm" className="mt-4" onClick={() => retry()}>
          Coba lagi
        </Button>
      </div>
    </Container>
  );
}
