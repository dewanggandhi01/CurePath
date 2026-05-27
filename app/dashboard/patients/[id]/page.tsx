"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getUser, isDoctor, DEMO_USERS, type User } from "@/lib/auth";
import {
  getPrescriptionsByPatient,
  getMedicalRecords,
  type Prescription,
  type MedicalRecord,
} from "@/lib/data";
import PrescriptionCard from "@/components/PrescriptionCard";
import { generatePrescriptionPDF } from "@/lib/pdf";

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
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  if (!user || !isDoctor(user)) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">Access denied. Doctors only.</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/dashboard/patients")}
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patients
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {patient?.name.charAt(0) || "?"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient?.name || "Unknown"}</h1>
            <p className="text-gray-500">{patient?.email} · {patient?.phone}</p>
            <p className="text-sm text-gray-400 mt-1">{prescriptions.length} prescriptions · {records.length} records</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {(["prescriptions", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 capitalize ${
              tab === t
                ? "border-primary-500 text-primary-500"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "history" ? "Medical History" : t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "prescriptions" ? (
          <motion.div
            key="prescriptions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {prescriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {prescriptions.map((rx, i) => (
                  <PrescriptionCard
                    key={rx.id}
                    prescription={rx}
                    onView={(rxId) => router.push(`/dashboard/prescriptions/${rxId}`)}
                    onDownload={generatePrescriptionPDF}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-500">No prescriptions for this patient</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {records.length > 0 ? (
              records.map((rec, i) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-l-2 border-primary-200 pl-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="badge badge-active text-xs">{rec.type}</span>
                    <span className="text-xs text-gray-400">{formatDate(rec.date)}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{rec.diagnosis}</h4>
                  <p className="text-sm text-gray-500 mt-1">By {rec.doctorName}</p>
                  <p className="text-sm text-gray-600 mt-2">{rec.notes}</p>
                </motion.div>
              ))
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-500">No medical records for this patient</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
