"use client";

import { motion } from "framer-motion";
import { Stethoscope, User, Download, ArrowRight } from "lucide-react";
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
  const isExpired = prescription.status === "expired";
  const isActive = prescription.status === "active";

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
          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
          <span className={`status-dot ${isActive ? "status-dot-pulse" : ""}`}>●</span>
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
          <Stethoscope className="w-4 h-4 text-teal-600 dark:text-emerald-400" />
          <span className="info-label">Doctor:</span>
          <span className="info-val">{prescription.doctorName.startsWith("Dr.") ? prescription.doctorName : `Dr. ${prescription.doctorName}`}</span>
        </div>
        <div className="prescription-patient">
          <User className="w-4 h-4 text-slate-400" />
          <span className="info-label">Patient:</span>
          <span className="info-val">{prescription.patientName}</span>
        </div>
      </div>

      {/* Medications pills */}
      <div className="prescription-medications">
        {prescription.medications.slice(0, 3).map((med) => (
          <span key={med.name} className="rounded-exempt">{med.name}</span>
        ))}
        {prescription.medications.length > 3 && (
          <span className="meds-more rounded-exempt">
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
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 view-arrow" />
          </button>
          {onDownload && (
            <button
              onClick={() => onDownload(prescription)}
              className="prescription-download-btn rounded-exempt"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

