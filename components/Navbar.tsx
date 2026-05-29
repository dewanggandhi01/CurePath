"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Users,
  Clock,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  Pill,
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
            
            {/* Left Section: 3-Lines menu toggle + text branding */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 cursor-pointer flex items-center justify-center rounded-exempt"
                style={{ height: "40px", width: "40px" }}
                title="Open Navigation"
              >
                {mobileOpen ? <X className="w-[22px] h-[22px]" /> : <Menu className="w-[22px] h-[22px]" />}
              </button>

              <Link href="/dashboard" className="flex flex-col justify-center">
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
              </Link>
            </div>

            {/* Right Section: Compact Search Bar (Desktop Only) + Notification Bell + Profile Avatar + Logout */}
            <div className="flex items-center gap-3">
              {/* Search Bar - hidden on mobile/phone screens */}
              <div className="hidden sm:flex navbar-search-wrapper">
                <Search className="search-icon w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="navbar-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>

              {/* Notification Icon with Red Badge */}
              <button
                className="relative p-2 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                style={{ padding: "10px" }}
              >
                <Bell className="w-[18px] h-[18px]" />
                <span className="bell-badge animate-pulse" />
              </button>

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

              {/* Logout Action (Desktop Only) */}
              <button
                onClick={onLogout}
                className="hidden sm:flex p-2 rounded-xl transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 group"
                title="Logout"
                style={{ padding: "10px" }}
              >
                <LogOut className="w-[18px] h-[18px] text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Global Navigation Dropdown (opened by 3-lines menu) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/10 dark:bg-black/40 backdrop-blur-[2px]"
              onClick={() => setMobileOpen(false)}
            />
            {/* Menu Card Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-[74px] left-4 lg:left-8 z-50 w-[300px] rounded-2xl border p-4 shadow-xl rounded-exempt"
              style={{
                background: "var(--card-bg-glass)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex flex-col gap-4">
                {/* Search Bar inside Drawer (Mobile Only) */}
                <div className="block sm:hidden">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5 px-2">Search</p>
                  <div className="navbar-search-wrapper w-full">
                    <Search className="search-icon w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="navbar-search w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      style={{ width: "100% !important" }}
                    />
                  </div>
                </div>

                {/* Navigation links */}
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 px-2">Navigation</p>
                  {links.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/40"
                        style={{
                          color: active ? "var(--color-primary-600)" : "var(--text-secondary)",
                          background: active ? "rgba(22, 163, 74, 0.06)" : "transparent",
                          border: active ? "1px solid rgba(22, 163, 74, 0.12)" : "1px solid transparent",
                        }}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Dark Mode toggle option inside menu */}
                <div className="border-t border-dashed pt-3" style={{ borderColor: "var(--card-border)" }}>
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[13px] font-semibold text-gray-600 dark:text-gray-400">Dark Mode</span>
                    <ThemeToggle />
                  </div>
                </div>

                {/* Mobile logout and profile section */}
                <div className="border-t border-dashed pt-3 sm:hidden" style={{ borderColor: "var(--card-border)" }}>
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className="avatar w-8 h-8 min-w-[32px] min-h-[32px]">
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
                      <div className="leading-none text-left">
                        <p className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>{user.name}</p>
                        <p className="text-[9px] text-gray-400 capitalize mt-0.5">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        onLogout();
                      }}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
