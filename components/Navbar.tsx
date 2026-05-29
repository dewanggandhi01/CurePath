"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  CheckCircle2,
  Search,
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
  const router = useRouter();
  const links = user.role === "doctor" ? doctorLinks : patientLinks;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/dashboard/prescriptions?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full flex justify-center"
        style={{
          paddingTop: "10px",
          background: "transparent",
        }}
      >
        <nav
          className="mx-auto max-w-[1440px] px-6 md:px-8 flex items-center justify-between transition-all duration-300 border navbar rounded-exempt"
          style={{
            width: "calc(100% - 32px)",
          }}
        >
          {/* ECG repeating heartbeat wave background */}
          <div className="navbar-bg"></div>

          {/* Nav contents container */}
          <div className="navbar-content">
            {/* Logo Section */}
            <div className="flex items-center gap-10">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div
                  className="w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))",
                    boxShadow: "0 2px 8px rgba(22, 115, 92, 0.2)",
                  }}
                >
                  <Pill className="w-[18px] h-[18px] text-white" />
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-[16px] leading-none logo-text"
                    style={{ color: "var(--text-primary)" }}
                  >
                    CurePath
                  </span>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-widest mt-0.5"
                    style={{ color: "var(--color-primary-500)", letterSpacing: "0.5px" }}
                  >
                    Healthcare
                  </span>
                </div>
              </Link>

              {/* Navigation links with sliding pill */}
              <div className="hidden md:flex items-center gap-2">
                {links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-[12px] text-[13px] nav-link font-medium"
                      style={{
                        fontWeight: active ? 600 : 500,
                        color: active ? "var(--color-primary-600)" : "var(--text-secondary)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                      {active && (
                        <motion.div
                          layoutId="nav-active-pill"
                          className="absolute inset-0 -z-10 rounded-[12px]"
                          style={{
                            background: "rgba(22, 163, 74, 0.08)",
                            border: "1px solid rgba(22, 163, 74, 0.15)",
                          }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Actions & Profile Box */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden xl:flex navbar-search-wrapper">
                <Search className="search-icon w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients, prescriptions..."
                  className="navbar-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>

              {/* Sync Indicator */}
              <div className="hidden sm:flex items-center">
                <div className="live-badge">
                  <span className="live-dot" />
                  <span>Live Synced</span>
                </div>
              </div>

              <ThemeToggle />

              {/* Notification Icon with Red Badge Pulse */}
              <button
                className="relative p-2 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                style={{ padding: "10px" }}
              >
                <Bell className="w-[18px] h-[18px]" />
                <span className="bell-badge animate-pulse" />
              </button>

              <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-800" />

              {/* Profile section rounded container */}
              <div
                onClick={() => router.push(user.role === "doctor" ? "/dashboard/patients" : "/dashboard/history")}
                className="profile cursor-pointer"
              >
                <div className="relative">
                  <div className="avatar">
                    <div
                      className="w-full h-full flex items-center justify-center font-bold text-xs"
                      style={{
                        background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))",
                        color: "white",
                      }}
                    >
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  {/* Green online dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
                <div className="hidden lg:block leading-none text-left">
                  <p className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {user.name}
                  </p>
                  <p className="text-[9px] font-semibold text-gray-400 capitalize mt-0.5">{user.role}</p>
                </div>
              </div>

              {/* Logout Action */}
              <button
                onClick={onLogout}
                className="hidden sm:flex p-2 rounded-xl transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 group"
                title="Logout"
                style={{ padding: "10px" }}
              >
                <LogOut className="w-[18px] h-[18px] text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ color: "var(--text-secondary)" }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Glass Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[4px] md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-[84px] left-4 right-4 z-40 md:hidden rounded-2xl border"
              style={{
                background: "var(--card-bg-glass)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: "var(--card-border)",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <div className="p-4 flex flex-col gap-1">
                {links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all"
                      style={{
                        color: active ? "var(--color-primary-600)" : "var(--text-secondary)",
                        background: active ? "var(--navbar-active-bg)" : "transparent",
                        border: active ? "1px solid var(--navbar-active-border)" : "1px solid transparent",
                      }}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}

                <div
                  className="mt-3 pt-3 flex items-center justify-between px-4 border-t border-dashed"
                  style={{ borderColor: "var(--card-border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                        style={{
                          background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))",
                          color: "white",
                        }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                        {user.name}
                      </p>
                      <p className="text-[10px] text-gray-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
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
