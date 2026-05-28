"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: string;
  index?: number;
}

function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  color = "#16735C",
  index = 0,
}: StatsCardProps) {
  const numericValue = typeof value === "number" ? value : parseInt(value) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="card card-hover flex flex-col group"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${color}15, ${color}08)`,
            border: `1px solid ${color}15`,
          }}
        >
          {icon}
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{
              background: trend.value >= 0 ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
              color: trend.value >= 0 ? "#16A34A" : "#DC2626",
            }}
          >
            {trend.value >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.value > 0 ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>

      <p
        className="text-[12px] font-semibold tracking-wider uppercase mb-1"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </p>
      <p
        className="text-[28px] font-extrabold tracking-tight leading-none"
        style={{ color: "var(--text-primary)" }}
      >
        {typeof value === "number" ? (
          <AnimatedCounter value={numericValue} />
        ) : (
          value
        )}
      </p>
      {trend && (
        <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
          {trend.label}
        </p>
      )}
    </motion.div>
  );
}
