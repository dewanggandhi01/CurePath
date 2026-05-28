"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Phone, Calendar, ClipboardList, Activity, Download, FileText } from "lucide-react";
import { getUser, isDoctor, DEMO_USERS, type User } from "@/lib/auth";
import {
  getPrescriptionsByPatient,
  getMedicalRecords,
  type Prescription,
  type MedicalRecord,
} from "@/lib/data";
import PrescriptionCard from "@/components/PrescriptionCard";
import { generatePrescriptionPDF } from "@/lib/pdf";
import { useToast } from "@/components/Toast";
import { SkeletonCard, SkeletonLine } from "@/components/Skeleton";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [tab, setTab] = useState<"prescriptions" | "history">("prescriptions");
  const [loading, setLoading] = useState(true);

  const patient = DEMO_USERS.find((u) => u.id === id);

  useEffect(() => {
    const u = getUser();
    if (!u || !isDoctor(u)) {
      setLoading(false);
      return;
    }
    setUser(u);
    setPrescriptions(getPrescriptionsByPatient(id));
    setRecords(getMedicalRecords(id));
    
    // Simulate slight transition delay for skeleton loading experience
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const handleDownload = (rx: Prescription) => {
    try {
      generatePrescriptionPDF(rx);
      toast("success", "Success", "Prescription PDF downloaded successfully");
    } catch (err) {
      toast("error", "Error", "Failed to download prescription PDF");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="skeleton" style={{ width: 140, height: 32, borderRadius: 8 }} />
        <div className="card flex items-center gap-5" style={{ padding: 24 }}>
          <div className="skeleton skeleton-avatar" style={{ width: 56, height: 56 }} />
          <div className="flex-1 space-y-2">
            <SkeletonLine width="200px" height={22} />
            <SkeletonLine width="300px" height={14} />
            <SkeletonLine width="150px" height={12} />
          </div>
        </div>
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 pb-2">
          <div className="skeleton" style={{ width: 120, height: 36 }} />
          <div className="skeleton" style={{ width: 120, height: 36 }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SkeletonCard height={200} />
          <SkeletonCard height={200} />
        </div>
      </div>
    );
  }

  if (!user || !isDoctor(user)) {
    return (
      <div className="card empty-state max-w-lg mx-auto">
        <Activity className="empty-state-icon mx-auto" />
        <p className="empty-state-title">Access Denied</p>
        <p className="empty-state-text">This section is only available for doctors</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => router.push("/dashboard/patients")} 
        className="btn btn-secondary inline-flex items-center gap-2 btn-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patients
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--card-bg) 0%, rgba(var(--color-primary-rgb), 0.03) 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-md border-2 border-white dark:border-gray-800"
              style={{
                background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))",
                color: "#ffffff",
              }}
            >
              {patient?.name.charAt(0) || "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {patient?.name || "Unknown"}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary-500" />
                  {patient?.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary-500" />
                  {patient?.phone}
                </span>
              </div>
            </div>
          </div>
          <div 
            className="flex flex-row sm:flex-col items-start sm:items-end gap-3 sm:gap-1.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-dashed" 
            style={{ borderColor: "var(--card-border)" }}
          >
            <div className="flex gap-2">
              <span className="badge badge-active flex items-center gap-1 text-[11px]">
                <ClipboardList className="w-3.5 h-3.5" />
                {prescriptions.length} prescriptions
              </span>
              <span className="badge badge-info flex items-center gap-1 text-[11px]">
                <Activity className="w-3.5 h-3.5" />
                {records.length} records
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 border-b" style={{ borderColor: "var(--card-border)" }}>
        {(["prescriptions", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-5 py-3 text-sm font-semibold transition-colors capitalize ${
              tab === t ? "text-primary-600" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            }`}
          >
            {t === "history" ? "Medical History" : t}
            {tab === t && (
              <motion.div
                layoutId="patient-detail-tabs"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "prescriptions" ? (
          <motion.div
            key="prescriptions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {prescriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {prescriptions.map((rx, i) => (
                  <PrescriptionCard
                    key={rx.id}
                    prescription={rx}
                    onView={(rxId) => router.push(`/dashboard/prescriptions/${rxId}`)}
                    onDownload={handleDownload}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="card empty-state">
                <ClipboardList className="empty-state-icon mx-auto" />
                <p className="empty-state-title">No prescriptions found</p>
                <p className="empty-state-text">No prescriptions have been issued to this patient yet.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {records.length > 0 ? (
              <div className="relative pl-6 border-l-2 space-y-6" style={{ borderColor: "var(--card-border)" }}>
                {records.map((rec, i) => (
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
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="badge badge-active text-xs capitalize">
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
                      <h4 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                        {rec.diagnosis}
                      </h4>
                      <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {rec.notes}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card empty-state">
                <Activity className="empty-state-icon mx-auto" />
                <p className="empty-state-title">No medical records</p>
                <p className="empty-state-text">No medical history records found for this patient.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
