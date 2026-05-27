"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: string;
  index?: number;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  color = "#16735C",
  index = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="card card-hover flex flex-col"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}12` }}
      >
        {icon}
      </div>
      <p className="text-[13px] text-gray-400 font-medium mt-4 tracking-wide uppercase">
        {title}
      </p>
      <p className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">{value}</p>
      {trend && (
        <div className="flex items-center gap-1.5 mt-3">
          {trend.value >= 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          )}
          <span
            className={`text-xs font-medium ${
              trend.value >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        </div>
      )}
    </motion.div>
  );
}
