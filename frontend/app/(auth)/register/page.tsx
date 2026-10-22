import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "./components/RegisterForm";

export const metadata: Metadata = {
  title: "Register | Todo App",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6 space-y-1 text-center">
        <h1 className="text-2xl font-bold text-dark-70">Buat akun baru</h1>
        <p className="text-sm text-muted">Daftar untuk mulai mencatat tugas.</p>
      </div>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-primary-70 hover:underline">
          Masuk
        </Link>
      </p>
    </>
  );
}
