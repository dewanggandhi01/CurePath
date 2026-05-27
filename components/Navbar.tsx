"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
                <Pill className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                CurePath
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors hidden sm:flex">
              <Bell className="w-[18px] h-[18px] text-gray-400" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            <div className="hidden sm:block w-px h-6 bg-gray-200" />

            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-600">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="hidden sm:flex p-2.5 rounded-xl hover:bg-red-50 transition-colors group"
              title="Logout"
            >
              <LogOut className="w-[18px] h-[18px] text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-lg md:hidden"
          >
            <div className="container py-4 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 mt-2 pt-3 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-600">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
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
        )}
      </AnimatePresence>
    </>
  );
}
