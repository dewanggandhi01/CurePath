"use client";

import { motion } from "framer-motion";

export function SkeletonLine({ width = "100%", height = 14 }: { width?: string; height?: number }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 6, marginBottom: 8 }}
    />
  );
}

export function SkeletonCard({ height = 200 }: { height?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="skeleton skeleton-card"
      style={{ height }}
    />
  );
}

export function SkeletonStatCards({ count = 4 }: { count?: number }) {
  return (
    <div
      className={`grid gap-5 ${
        count === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: 24 }}>
          <div className="skeleton skeleton-avatar" style={{ width: 44, height: 44, marginBottom: 16 }} />
          <SkeletonLine width="60%" height={12} />
          <SkeletonLine width="40%" height={28} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPrescriptionCards({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: 24 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <div className="skeleton" style={{ width: 70, height: 24, borderRadius: 999 }} />
            <SkeletonLine width="80px" height={12} />
          </div>
          <SkeletonLine width="80%" height={18} />
          <SkeletonLine width="60%" height={14} />
          <div className="flex gap-2 mt-4">
            <div className="skeleton" style={{ width: 60, height: 22, borderRadius: 999 }} />
            <div className="skeleton" style={{ width: 60, height: 22, borderRadius: 999 }} />
          </div>
          <div className="flex gap-2 mt-4 pt-3" style={{ borderTop: "1px solid var(--card-border)" }}>
            <div className="skeleton" style={{ flex: 1, height: 36, borderRadius: 8 }} />
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 4 }: { rows?: number }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border)" }}>
        <SkeletonLine width="30%" height={20} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4"
          style={{ padding: "14px 20px", borderBottom: i < rows - 1 ? "1px solid var(--card-border)" : "none" }}
        >
          <SkeletonLine width="25%" height={14} />
          <SkeletonLine width="15%" height={14} />
          <SkeletonLine width="20%" height={14} />
          <SkeletonLine width="15%" height={14} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <SkeletonLine width="200px" height={28} />
        <SkeletonLine width="300px" height={16} />
      </div>
      <SkeletonStatCards count={4} />
      <SkeletonCard height={320} />
      <div>
        <SkeletonLine width="200px" height={20} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} height={180} />
          ))}
        </div>
      </div>
    </div>
  );
}
