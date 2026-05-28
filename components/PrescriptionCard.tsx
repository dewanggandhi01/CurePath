"use client";

import { motion } from "framer-motion";
import { Eye, Download } from "lucide-react";
import type { Prescription } from "@/lib/data";

const statusStyles: Record<string, { badge: string; accent: string }> = {
  active: { badge: "badge-active", accent: "card-accent-green" },
  completed: { badge: "badge-completed", accent: "card-accent-blue" },
  expired: { badge: "badge-expired", accent: "card-accent-gray" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface PrescriptionCardProps {
  prescription: Prescription;
  onView: (id: string) => void;
  onDownload?: (p: Prescription) => void;
  showActions?: boolean;
  index?: number;
}

export default function PrescriptionCard({
  prescription,
  onView,
  onDownload,
  showActions = true,
  index = 0,
}: PrescriptionCardProps) {
  const style = statusStyles[prescription.status] || statusStyles.active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`card card-hover cursor-pointer ${style.accent}`}
      style={{ padding: "16px 20px" }}
      onClick={() => onView(prescription.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`badge ${style.badge} text-[10px] px-2 py-0.5`}>
          {prescription.status}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {formatDate(prescription.createdAt)}
        </span>
      </div>

      <h3
        className="font-semibold mb-0.5 leading-snug text-[15px]"
        style={{ color: "var(--text-primary)" }}
      >
        {prescription.diagnosis}
      </h3>
      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
        {prescription.doctorName} → {prescription.patientName}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {prescription.medications.slice(0, 3).map((med) => (
          <span
            key={med.name}
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--card-border)",
            }}
          >
            {med.name}
          </span>
        ))}
        {prescription.medications.length > 3 && (
          <span className="text-[10px] px-1.5 py-0.5" style={{ color: "var(--text-muted)" }}>
            +{prescription.medications.length - 3}
          </span>
        )}
      </div>

      {showActions && (
        <div
          className="flex gap-2 pt-2.5"
          style={{ borderTop: "1px solid var(--card-border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onView(prescription.id)}
            className="btn btn-primary btn-sm flex-1 py-1.5 h-8 text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          {onDownload && (
            <button
              onClick={() => onDownload(prescription)}
              className="btn btn-secondary btn-sm py-1.5 h-8"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
