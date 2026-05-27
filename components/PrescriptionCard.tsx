"use client";

import { motion } from "framer-motion";
import { Eye, Download } from "lucide-react";
import type { Prescription } from "@/lib/data";

const statusStyles: Record<string, string> = {
  active: "badge-active",
  completed: "badge-completed",
  expired: "badge-expired",
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="card card-hover cursor-pointer"
      onClick={() => onView(prescription.id)}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`badge ${statusStyles[prescription.status]}`}>
          {prescription.status}
        </span>
        <span className="text-xs text-gray-400">
          {formatDate(prescription.createdAt)}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1 leading-snug">
        {prescription.diagnosis}
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        {prescription.doctorName} → {prescription.patientName}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {prescription.medications.slice(0, 3).map((med) => (
          <span
            key={med.name}
            className="text-[11px] bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full border border-gray-100"
          >
            {med.name}
          </span>
        ))}
        {prescription.medications.length > 3 && (
          <span className="text-[11px] text-gray-400 px-2 py-1">
            +{prescription.medications.length - 3}
          </span>
        )}
      </div>

      {showActions && (
        <div
          className="flex gap-2 pt-3 border-t border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onView(prescription.id)}
            className="btn btn-primary btn-sm flex-1"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          {onDownload && (
            <button
              onClick={() => onDownload(prescription)}
              className="btn btn-secondary btn-sm"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
