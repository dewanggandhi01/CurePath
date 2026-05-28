"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Edit,
  Trash2,
  Calendar,
  User as UserIcon,
  Stethoscope,
  Pill,
} from "lucide-react";
import { getUser, isDoctor, DEMO_USERS, type User } from "@/lib/auth";
import { getPrescriptionById, updatePrescription, deletePrescription, type Prescription } from "@/lib/data";
import { generatePrescriptionPDF } from "@/lib/pdf";
import { useToast } from "@/components/Toast";
import PrescriptionForm from "@/components/PrescriptionForm";
import { SkeletonTable } from "@/components/Skeleton";

const statusStyles: Record<string, string> = {
  active: "badge-active",
  completed: "badge-completed",
  expired: "badge-expired",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PrescriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [rx, setRx] = useState<Prescription | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    const data = getPrescriptionById(id);
    setRx(data || null);
    setTimeout(() => setLoading(false), 300);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="skeleton" style={{ width: 180, height: 36, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: "100%", height: 60, borderRadius: 16 }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="skeleton" style={{ height: 140, borderRadius: 16 }} />
          <div className="skeleton" style={{ height: 140, borderRadius: 16 }} />
        </div>
        <SkeletonTable rows={3} />
      </div>
    );
  }

  if (!rx) {
    return (
      <div className="card empty-state max-w-lg mx-auto">
        <Pill className="empty-state-icon mx-auto" />
        <p className="empty-state-title">Prescription not found</p>
        <p className="empty-state-text mb-4">This prescription may have been deleted or doesn&apos;t exist</p>
        <button
          onClick={() => router.push("/dashboard/prescriptions")}
          className="btn btn-primary"
        >
          Back to Prescriptions
        </button>
      </div>
    );
  }

  const doctor = user && isDoctor(user);
  const patients = DEMO_USERS.filter((u) => u.role === "patient").map((u) => ({
    id: u.id,
    name: u.name,
  }));

  const handleUpdate = (data: Partial<Prescription>) => {
    const updated = updatePrescription(rx.id, data);
    if (updated) {
      setRx(updated);
      toast("success", "Prescription Updated", "Changes saved successfully");
    }
  };

  const handleDelete = () => {
    deletePrescription(rx.id);
    toast("success", "Prescription Deleted", `Prescription for ${rx.patientName} removed`);
    router.push("/dashboard/prescriptions");
  };

  const handleDownload = () => {
    generatePrescriptionPDF(rx);
    toast("success", "PDF Downloaded", `Prescription saved as PDF`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/prescriptions")}
          className="btn btn-ghost -ml-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Prescriptions
        </button>

        {/* Header with Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Prescription Details
            </h1>
            <span className={`badge text-sm ${statusStyles[rx.status]}`}>
              {rx.status}
            </span>
          </div>
          <div className="flex gap-2">
            {doctor && (
              <>
                <button onClick={() => setIsFormOpen(true)} className="btn btn-secondary btn-sm">
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-sm"
                  style={{
                    background: "transparent",
                    color: "var(--color-error)",
                    border: "1.5px solid rgba(220,38,38,0.2)",
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <button onClick={handleDownload} className="btn btn-primary btn-sm">
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="card"
            style={{ borderColor: "rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.03)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Are you sure you want to delete this prescription?
            </p>
            <p className="text-xs mt-1 mb-3" style={{ color: "var(--text-muted)" }}>
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                <Trash2 className="w-3.5 h-3.5" />
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost btn-sm">
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Doctor & Patient Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--color-primary-50)" }}
              >
                <Stethoscope className="w-[18px] h-[18px]" style={{ color: "var(--color-primary-500)" }} />
              </div>
              <h3 className="font-semibold text-[15px]" style={{ color: "var(--text-primary)" }}>
                Doctor Information
              </h3>
            </div>
            <div className="space-y-2.5 text-sm">
              <p>
                <span style={{ color: "var(--text-muted)" }}>Name:</span>{" "}
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{rx.doctorName}</span>
              </p>
              <p>
                <span style={{ color: "var(--text-muted)" }}>Date:</span>{" "}
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{formatDate(rx.createdAt)}</span>
              </p>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(37,99,235,0.08)" }}
              >
                <UserIcon className="w-[18px] h-[18px] text-blue-500" />
              </div>
              <h3 className="font-semibold text-[15px]" style={{ color: "var(--text-primary)" }}>
                Patient Information
              </h3>
            </div>
            <div className="space-y-2.5 text-sm">
              <p>
                <span style={{ color: "var(--text-muted)" }}>Name:</span>{" "}
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{rx.patientName}</span>
              </p>
              <p>
                <span style={{ color: "var(--text-muted)" }}>ID:</span>{" "}
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{rx.patientId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Diagnosis Card */}
        <div className="card">
          <h3 className="font-semibold mb-2 text-[15px]" style={{ color: "var(--text-primary)" }}>Diagnosis</h3>
          <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{rx.diagnosis}</p>
        </div>

        {/* Medications Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px 16px" }}>
            <h3 className="font-semibold text-[15px]" style={{ color: "var(--text-primary)" }}>
              Medications ({rx.medications.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table-modern" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {rx.medications.map((med, i) => (
                  <tr key={i}>
                    <td className="font-medium" style={{ color: "var(--text-primary)" }}>{med.name}</td>
                    <td>{med.dosage}</td>
                    <td>{med.frequency}</td>
                    <td>{med.duration}</td>
                    <td style={{ color: "var(--text-muted)" }}>{med.instructions || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {rx.notes && (
          <div className="card">
            <h3 className="font-semibold mb-2 text-[15px]" style={{ color: "var(--text-primary)" }}>Notes</h3>
            <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{rx.notes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex flex-wrap gap-6 text-xs pt-2" style={{ color: "var(--text-muted)" }}>
          <p className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Created: {formatDate(rx.createdAt)}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Updated: {formatDate(rx.updatedAt)}
          </p>
        </div>
      </motion.div>

      {doctor && user && (
        <PrescriptionForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={(data) => {
            handleUpdate(data);
            setIsFormOpen(false);
          }}
          patients={patients}
          initialData={rx}
          doctorId={user.id}
          doctorName={user.name}
        />
      )}
    </div>
  );
}
