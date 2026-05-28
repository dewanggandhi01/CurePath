"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/Toast";
import { getUser, logout, type User } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/");
      return;
    }
    setUser(u);
    setReady(true);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="spinner" />
          <p className="text-sm text-gray-400 font-medium">Loading CurePath...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
        <Navbar user={user!} onLogout={handleLogout} />
        <main className="pt-[72px]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="container py-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </ToastProvider>
  );
}
