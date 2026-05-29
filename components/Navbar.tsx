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
                className={`ananda-btn rounded-exempt ${mobileOpen ? "menu-active" : ""}`}
                title="Toggle Navigation"
              >
                <div className="ananda-btn-bg rounded-exempt"></div>
                <div className="ananda-btn-icons rounded-exempt">
                  <svg viewBox="0 0 448 512" className="ananda-line">
                    <path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z" />
                  </svg>
                  <svg viewBox="0 0 320 512" className="ananda-close">
                    <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
                  </svg>
                </div>
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
                        className="ananda-nav-link rounded-exempt"
                        style={{
                          color: active ? "var(--color-primary-600)" : "var(--text-secondary)",
                          background: active ? "rgba(22, 163, 74, 0.06)" : "transparent",
                          border: active ? "1px solid rgba(22, 163, 74, 0.12)" : "1px solid transparent",
                        }}
                      >
                        <link.icon className="w-4 h-4 mr-2" />
                        <span>{link.label}</span>
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
