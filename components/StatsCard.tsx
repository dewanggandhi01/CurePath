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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card card-hover min-h-[160px] flex flex-col"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>
      <p className="text-sm text-gray-500 font-medium mt-4">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend.value >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
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
