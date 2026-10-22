"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface TodoFormProps {
  onAddTodo: (title: string) => void;
}

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAddTodo(trimmed);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <Input
        name="title"
        placeholder="Tambahkan tugas baru..."
        variantSize="sm"
        className="flex-1"
        aria-label="Judul tugas"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button type="submit" size="sm" className="px-6" disabled={!title.trim()}>
        Tambah
      </Button>
    </form>
  );
}
