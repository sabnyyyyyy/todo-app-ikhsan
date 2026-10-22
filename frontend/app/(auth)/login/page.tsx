import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./components/LoginForm";

export const metadata: Metadata = {
  title: "Login | Todo App",
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-6 space-y-1 text-center">
        <h1 className="text-2xl font-bold text-dark-70">Selamat datang kembali</h1>
        <p className="text-sm text-muted">Masuk untuk mengelola tugasmu.</p>
      </div>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-primary-70 hover:underline">
          Daftar
        </Link>
      </p>
    </>
  );
}
