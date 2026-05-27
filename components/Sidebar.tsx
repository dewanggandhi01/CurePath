"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill, LayoutDashboard, FileText, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

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

export default function Sidebar({ role }: { role: "doctor" | "patient" }) {
  const pathname = usePathname();
  const links = role === "doctor" ? doctorLinks : patientLinks;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-gray-200 flex flex-col z-40"
    >
      <div className="px-6 h-[84px] flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
          <Pill className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-primary-500">CurePath</span>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary-50 text-primary-500 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[15px]">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
