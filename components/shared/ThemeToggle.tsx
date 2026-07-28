"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    // Update color-scheme for native elements
    document.documentElement.style.colorScheme = next ? "dark" : "light";
  };

  // Render a placeholder with fixed dimensions during SSR to avoid layout shift
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 shrink-0" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 group ${
        isDark
          ? "bg-slate-800 border border-slate-600 hover:bg-slate-700 text-amber-400"
          : "bg-slate-100 border border-slate-200/60 hover:bg-slate-200 text-slate-700"
      }`}
      title={isDark ? "Ganti ke Tema Terang" : "Ganti ke Tema Gelap"}
      aria-label={isDark ? "Ganti ke Tema Terang" : "Ganti ke Tema Gelap"}
      id="theme-toggle"
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <Sun
          className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        {/* Moon icon */}
        <Moon
          className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  );
}
