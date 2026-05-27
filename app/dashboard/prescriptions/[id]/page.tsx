"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Edit,
  Calendar,
  User as UserIcon,
  Stethoscope,
} from "lucide-react";
import { getUser, isDoctor, DEMO_USERS, type User } from "@/lib/auth";
import { getPrescriptionById, updatePrescription, type Prescription } from "@/lib/data";
import { generatePrescriptionPDF } from "@/lib/pdf";
import PrescriptionForm from "@/components/PrescriptionForm";

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
  const [rx, setRx] = useState<Prescription | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    const data = getPrescriptionById(id);
    setRx(data || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  if (!rx) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-400">Prescription not found</p>
        <button
          onClick={() => router.push("/dashboard/prescriptions")}
          className="btn btn-primary mt-4"
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
    if (updated) setRx(updated);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <button
          onClick={() => router.push("/dashboard/prescriptions")}
          className="btn btn-ghost -ml-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Prescriptions
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="section-title text-2xl">Prescription Details</h1>
            <span className={`badge text-sm ${statusStyles[rx.status]}`}>
              {rx.status}
            </span>
          </div>
          <div className="flex gap-2">
            {doctor && (
              <button onClick={() => setIsFormOpen(true)} className="btn btn-secondary btn-sm">
                <Edit className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
            <button
              onClick={() => generatePrescriptionPDF(rx)}
              className="btn btn-primary btn-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <Stethoscope className="w-[18px] h-[18px] text-primary-500" />
              </div>
              <h3 className="font-semibold text-gray-900 text-[15px]">Doctor Information</h3>
            </div>
            <div className="space-y-2.5 text-sm">
              <p>
                <span className="text-gray-400">Name:</span>{" "}
                <span className="font-medium text-gray-700">{rx.doctorName}</span>
              </p>
              <p>
                <span className="text-gray-400">Date:</span>{" "}
                <span className="font-medium text-gray-700">{formatDate(rx.createdAt)}</span>
              </p>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <UserIcon className="w-[18px] h-[18px] text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 text-[15px]">Patient Information</h3>
            </div>
            <div className="space-y-2.5 text-sm">
              <p>
                <span className="text-gray-400">Name:</span>{" "}
                <span className="font-medium text-gray-700">{rx.patientName}</span>
              </p>
              <p>
                <span className="text-gray-400">ID:</span>{" "}
                <span className="font-medium text-gray-700">{rx.patientId}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2 text-[15px]">Diagnosis</h3>
          <p className="text-gray-600 leading-relaxed">{rx.diagnosis}</p>
        </div>

        <div className="card overflow-hidden">
          <h3 className="font-semibold text-gray-900 mb-4 text-[15px]">Medications</h3>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-primary-50/60">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-[13px] rounded-l-xl">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-[13px]">Dosage</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-[13px]">Frequency</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-[13px]">Duration</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-[13px] rounded-r-xl">
                    Instructions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rx.medications.map((med, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-gray-50/50" : ""}>
                    <td className="py-3 px-4 font-medium text-gray-800">{med.name}</td>
                    <td className="py-3 px-4 text-gray-500">{med.dosage}</td>
                    <td className="py-3 px-4 text-gray-500">{med.frequency}</td>
                    <td className="py-3 px-4 text-gray-500">{med.duration}</td>
                    <td className="py-3 px-4 text-gray-400">{med.instructions || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {rx.notes && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2 text-[15px]">Notes</h3>
            <p className="text-gray-600 leading-relaxed">{rx.notes}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-6 text-xs text-gray-400 pt-2">
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
