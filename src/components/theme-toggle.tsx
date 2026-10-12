"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={`inline-flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-brass hover:text-brass ${className}`}
    >
      {mounted ? isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" /> : <span className="size-[18px]" />}
    </button>
  );
}
