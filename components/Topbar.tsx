"use client";

import { Bell, LogOut } from "lucide-react";
import type { User } from "@/lib/auth";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Topbar({
  user,
  onLogout,
}: {
  user: User | null;
  onLogout: () => void;
}) {
  if (!user) return null;

  return (
    <header className="sticky top-0 h-[84px] bg-white/80 backdrop-blur-xl border-b border-gray-100 z-30 flex items-center justify-between px-8">
      <h2 className="text-xl font-semibold text-gray-800">
        {getGreeting()},{" "}
        <span className="text-primary-500">{user.name.split(" ")[0]}</span>
      </h2>

      <div className="flex items-center gap-5">
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-px h-6 bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-bold text-primary-600">
              {user.name.charAt(0)}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="p-2 rounded-xl hover:bg-red-50 transition-colors group"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </header>
  );
}
