import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-border bg-background p-8 shadow-smooth">
        {children}
      </div>
    </div>
  );
}
