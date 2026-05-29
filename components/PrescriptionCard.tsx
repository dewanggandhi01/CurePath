"use client";

import { motion } from "framer-motion";
import type { Prescription } from "@/lib/data";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
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
      className={`prescription-card rounded-exempt status-${prescription.status} cursor-pointer`}
      onClick={() => onView(prescription.id)}
    >
      {/* Top row: Status Badge & Date */}
      <div className="prescription-card-header">
        <span className={`prescription-status-badge badge-${prescription.status}`}>
          ● {prescription.status}
        </span>
        <span className="prescription-card-date">
          {formatDate(prescription.createdAt)}
        </span>
      </div>

      {/* Disease Name */}
      <h3 className="prescription-disease-name">
        {prescription.diagnosis}
      </h3>

      {/* Doctor & Patient Info */}
      <div className="prescription-people-info">
        <div className="prescription-doctor">
          👨‍⚕️ {prescription.doctorName}
        </div>
        <div className="prescription-patient">
          👤 {prescription.patientName}
        </div>
      </div>

      {/* Medications pills */}
      <div className="prescription-medications">
        {prescription.medications.slice(0, 3).map((med) => (
          <span key={med.name}>{med.name}</span>
        ))}
        {prescription.medications.length > 3 && (
          <span style={{ background: "transparent", border: "none", padding: "6px 4px", color: "var(--text-muted)" }}>
            +{prescription.medications.length - 3} more
          </span>
        )}
      </div>

      {/* Card Actions */}
      {showActions && (
        <div className="prescription-card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onView(prescription.id)}
            className="prescription-view-btn rounded-exempt"
          >
            View Details &rarr;
          </button>
          {onDownload && (
            <button
              onClick={() => onDownload(prescription)}
              className="prescription-download-btn rounded-exempt"
              title="Download PDF"
            >
              ⬇
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
