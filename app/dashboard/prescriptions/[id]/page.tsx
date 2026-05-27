"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Edit, Calendar, User as UserIcon, Stethoscope } from "lucide-react";
import { getUser, isDoctor, DEMO_USERS, type User } from "@/lib/auth";
import {
  getPrescriptionById,
  updatePrescription,
  type Prescription,
} from "@/lib/data";
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
        <p className="text-xl text-gray-500">Prescription not found</p>
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
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => router.push("/dashboard/prescriptions")}
          className="btn btn-ghost mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Prescriptions
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Prescription Details</h1>
            <span className={`badge text-sm ${statusStyles[rx.status]}`}>
              {rx.status}
            </span>
          </div>
          <div className="flex gap-3">
            {doctor && (
              <button onClick={() => setIsFormOpen(true)} className="btn btn-secondary btn-sm">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
            <button
              onClick={() => generatePrescriptionPDF(rx)}
              className="btn btn-primary btn-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Doctor Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> <span className="font-medium">{rx.doctorName}</span></p>
              <p><span className="text-gray-500">Date:</span> <span className="font-medium">{formatDate(rx.createdAt)}</span></p>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Patient Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> <span className="font-medium">{rx.patientName}</span></p>
              <p><span className="text-gray-500">Patient ID:</span> <span className="font-medium">{rx.patientId}</span></p>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Diagnosis</h3>
          <p className="text-gray-700">{rx.diagnosis}</p>
        </div>

        <div className="card mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Medications</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 rounded-l-xl">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Dosage</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Frequency</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 rounded-r-xl">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {rx.medications.map((med, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                    <td className="py-3 px-4 font-medium text-gray-900">{med.name}</td>
                    <td className="py-3 px-4 text-gray-600">{med.dosage}</td>
                    <td className="py-3 px-4 text-gray-600">{med.frequency}</td>
                    <td className="py-3 px-4 text-gray-600">{med.duration}</td>
                    <td className="py-3 px-4 text-gray-500">{med.instructions || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {rx.notes && (
          <div className="card mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-700">{rx.notes}</p>
          </div>
        )}

        <div className="flex gap-6 text-xs text-gray-400">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Created: {formatDate(rx.createdAt)}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
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
