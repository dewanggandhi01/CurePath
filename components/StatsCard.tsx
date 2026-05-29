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
      className="card card-hover flex items-center justify-between group"
      style={{ padding: "28px 24px" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${color}15, ${color}08)`,
            border: `1px solid ${color}15`,
          }}
        >
          {icon}
        </div>
        <div>
          <p
            className="text-[11px] font-semibold tracking-wider uppercase"
            style={{ color: "var(--text-muted)", marginBottom: "2px" }}
          >
            {title}
          </p>
          <p
            className="text-[32px] font-extrabold tracking-tight leading-none"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
          >
            {typeof value === "number" ? (
              <AnimatedCounter value={numericValue} />
            ) : (
              value
            )}
          </p>
        </div>
      </div>

      {trend && (
        <div className="flex flex-col items-end gap-1">
          <div
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{
              background: trend.value >= 0 ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
              color: trend.value >= 0 ? "#16A34A" : "#DC2626",
            }}
          >
            {trend.value >= 0 ? (
              <TrendingUp className="w-2.5 h-2.5" />
            ) : (
              <TrendingDown className="w-2.5 h-2.5" />
            )}
            {trend.value > 0 ? "+" : ""}
            {trend.value}%
          </div>
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            {trend.label}
          </span>
        </div>
      )}
    </motion.div>
  );
}
