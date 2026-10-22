"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }
    setError("");
    // Belum ada backend autentikasi, arahkan ke halaman login.
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-dark-70">
          Nama Lengkap
        </label>
        <Input
          id="name"
          placeholder="Nama lengkap"
          variantSize="sm"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-dark-70">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="nama@email.com"
          variantSize="sm"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-dark-70">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Minimal 8 karakter"
          variantSize="sm"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-dark-70">
          Konfirmasi Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Ulangi password"
          variantSize="sm"
          value={form.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-danger-80">{error}</p>}
      <Button type="submit" className="w-full">
        Daftar
      </Button>
    </form>
  );
}
