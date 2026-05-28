"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Search, Activity, FileText, Heart, Calendar, Shield } from "lucide-react";
import { getUser, isPatient, type User } from "@/lib/auth";
import { getMedicalRecords, type MedicalRecord } from "@/lib/data";
import { SkeletonLine } from "@/components/Skeleton";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const typeConfigs: Record<string, { badgeClass: string; icon: React.ReactNode }> = {
  "Lab Results": {
    badgeClass: "badge-completed",
    icon: <FileText className="w-3 h-3" />,
  },
  "General Checkup": {
    badgeClass: "badge-active",
    icon: <Heart className="w-3 h-3 text-emerald-500" />,
  },
  "X-Ray": {
    badgeClass: "badge-expired",
    icon: <Shield className="w-3 h-3" />,
  },
  "Blood Test": {
    badgeClass: "badge-active",
    icon: <Activity className="w-3 h-3 text-emerald-500" />,
  },
};

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u || !isPatient(u)) {
      setLoading(false);
      return;
    }
    setUser(u);
    setRecords(getMedicalRecords(u.id));
    
    // Simulate premium visual loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <SkeletonLine width="180px" height={28} />
          <SkeletonLine width="260px" height={16} />
        </div>
        <div className="skeleton" style={{ width: 320, height: 48, borderRadius: 12 }} />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-5">
              <div className="skeleton skeleton-avatar flex-shrink-0" style={{ width: 36, height: 36 }} />
              <div className="flex-1 card space-y-3" style={{ padding: 20 }}>
                <div className="flex justify-between flex-wrap gap-2">
                  <SkeletonLine width="110px" height={20} />
                  <SkeletonLine width="90px" height={14} />
                </div>
                <SkeletonLine width="60%" height={18} />
                <SkeletonLine width="40%" height={14} />
                <div className="pt-2">
                  <SkeletonLine width="100%" height={14} />
                  <SkeletonLine width="80%" height={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user || !isPatient(user)) {
    return (
      <div className="card empty-state max-w-lg mx-auto">
        <Clock className="empty-state-icon mx-auto" />
        <p className="empty-state-title">Access Denied</p>
        <p className="empty-state-text">This section is only available for patients</p>
      </div>
    );
  }

  const filtered = records.filter(
    (r) =>
      r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Medical History
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Your chronological health tracker and consultation records
        </p>
      </motion.div>

      <div className="relative max-w-sm">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors"
          style={{ color: search ? "var(--color-primary-500)" : "var(--text-muted)" }}
        />
        <input
          type="text"
          placeholder="Search diagnoses, doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-11"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="relative pl-6 border-l-2" style={{ borderColor: "var(--card-border)" }}>
          <div className="space-y-6">
            {filtered.map((rec, i) => {
              const cfg = typeConfigs[rec.type] || {
                badgeClass: "badge-expired",
                icon: <FileText className="w-3.5 h-3.5" />,
              };
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative group"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-gray-900 transition-colors group-hover:bg-primary-500 group-hover:border-primary-500"
                    style={{ borderColor: "var(--color-primary-500)" }}
                  />

                  <div className="card card-hover" style={{ padding: 20 }}>
                    <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`badge ${cfg.badgeClass} flex items-center gap-1 text-[11px]`}>
                          {cfg.icon}
                          {rec.type}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          By {rec.doctorName}
                        </span>
                      </div>
                      <span className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(rec.date)}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
                      {rec.diagnosis}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {rec.notes}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card empty-state">
          <Clock className="empty-state-icon mx-auto" />
          <p className="empty-state-title">No records found</p>
          <p className="empty-state-text">Your medical consultation history will appear here.</p>
        </div>
      )}
    </div>
  );
}
