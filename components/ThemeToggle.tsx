"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("curepath_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("curepath_theme", next ? "dark" : "light");
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ background: dark ? "rgba(255,255,255,0.06)" : undefined }}
    >
      <motion.div
        key={dark ? "moon" : "sun"}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {dark ? (
          <Moon className="w-[18px] h-[18px] text-amber-400" />
        ) : (
          <Sun className="w-[18px] h-[18px] text-gray-500" />
        )}
      </motion.div>
    </button>
  );
}
