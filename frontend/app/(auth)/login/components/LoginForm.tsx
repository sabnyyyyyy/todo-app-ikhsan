"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setError("");
    // Belum ada backend autentikasi, langsung arahkan ke halaman todo.
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-dark-70">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="nama@email.com"
          variantSize="sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-dark-70">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Masukkan password"
          variantSize="sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-danger-80">{error}</p>}
      <Button type="submit" className="w-full">
        Masuk
      </Button>
    </form>
  );
}
