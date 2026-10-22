import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Container } from "@/app/components/ui/container";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/satoshi/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "Aplikasi todo-list dengan Next.js App Router",
};

const navLinks = [
  { href: "/", label: "Todo" },
  { href: "/cached", label: "Cached" },
  { href: "/api-todos", label: "API Todos" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${satoshi.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="border-b border-border bg-background">
          <Container className="flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-bold text-primary-70">
              TodoApp
            </Link>
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-dark-50 transition-colors hover:bg-gray-50 hover:text-primary-70"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </Container>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
