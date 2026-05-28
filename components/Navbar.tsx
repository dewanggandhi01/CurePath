"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill,
  LayoutDashboard,
  FileText,
  Users,
  Clock,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import type { User } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";

const doctorLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/dashboard/patients", label: "Patients", icon: Users },
];

const patientLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/prescriptions", label: "My Prescriptions", icon: FileText },
  { href: "/dashboard/history", label: "Medical History", icon: Clock },
];

export default function Navbar({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const links = user.role === "doctor" ? doctorLinks : patientLinks;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[72px] glass transition-all duration-300"
        style={{
          background: "var(--navbar-bg)",
          borderBottom: `1px solid ${scrolled ? "var(--navbar-border)" : "transparent"}`,
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        }}
      >
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))" }}>
                <Pill className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                CurePath
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium transition-all"
                  style={{
                    color: isActive(link.href) ? "var(--color-primary-600)" : "var(--text-muted)",
                    background: isActive(link.href) ? "var(--color-primary-50)" : "transparent",
                  }}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                      style={{ background: "var(--color-primary-500)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button className="relative p-2.5 rounded-xl transition-colors hidden sm:flex"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-gray-50)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
                style={{ border: "2px solid var(--navbar-bg)" }} />
            </button>

            <div className="hidden sm:block w-px h-6" style={{ background: "var(--color-gray-200)" }} />

            <div className="hidden sm:flex items-center gap-3 pl-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "var(--color-primary-50)" }}>
                <span className="text-xs font-bold" style={{ color: "var(--color-primary-600)" }}>
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {user.name}
                </p>
                <p className="text-[11px] capitalize" style={{ color: "var(--text-muted)" }}>{user.role}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="hidden sm:flex p-2.5 rounded-xl transition-colors group"
              title="Logout"
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(220,38,38,0.06)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <LogOut className="w-[18px] h-[18px] text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 glass md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[72px] left-0 right-0 z-40 md:hidden"
              style={{
                background: "var(--card-bg)",
                borderBottom: "1px solid var(--card-border)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div className="container py-4 flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all"
                    style={{
                      color: isActive(link.href) ? "var(--color-primary-600)" : "var(--text-muted)",
                      background: isActive(link.href) ? "var(--color-primary-50)" : "transparent",
                    }}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}

                <div className="mt-2 pt-3 flex items-center justify-between px-4"
                  style={{ borderTop: "1px solid var(--card-border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "var(--color-primary-50)" }}>
                      <span className="text-xs font-bold" style={{ color: "var(--color-primary-600)" }}>
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{user.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
