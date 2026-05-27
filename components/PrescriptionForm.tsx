"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Prescription, Medication } from "@/lib/data";

interface PrescriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    patientId: string;
    patientName: string;
    diagnosis: string;
    medications: Medication[];
    notes: string;
    status: "active" | "completed";
  }) => void;
  patients: { id: string; name: string }[];
  initialData?: Prescription | null;
  doctorId: string;
  doctorName: string;
}

const emptyMed: Medication = { name: "", dosage: "", frequency: "", duration: "" };

export default function PrescriptionForm({
  isOpen,
  onClose,
  onSubmit,
  patients,
  initialData,
}: PrescriptionFormProps) {
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState<Medication[]>([{ ...emptyMed }]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"active" | "completed">("active");

  useEffect(() => {
    if (initialData) {
      setPatientId(initialData.patientId);
      setDiagnosis(initialData.diagnosis);
      setMedications(initialData.medications);
      setNotes(initialData.notes || "");
      setStatus(initialData.status === "expired" ? "completed" : initialData.status);
    } else {
      setPatientId("");
      setDiagnosis("");
      setMedications([{ ...emptyMed }]);
      setNotes("");
      setStatus("active");
    }
  }, [initialData, isOpen]);

  const handleMedChange = (i: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[i] = { ...updated[i], [field]: value };
    setMedications(updated);
  };

  const addMedication = () => setMedications([...medications, { ...emptyMed }]);

  const removeMedication = (i: number) => {
    if (medications.length > 1) setMedications(medications.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient || !diagnosis || medications.some((m) => !m.name)) return;

    onSubmit({
      patientId: patient.id,
      patientName: patient.name,
      diagnosis,
      medications: medications.filter((m) => m.name),
      notes,
      status,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[28px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {initialData ? "Edit Prescription" : "New Prescription"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="select"
                  required
                >
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="input"
                  placeholder="Enter diagnosis"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medications</label>
                <div className="flex flex-col gap-3">
                  {medications.map((med, i) => (
                    <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 items-start">
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleMedChange(i, "name", e.target.value)}
                        className="input"
                        placeholder="Name"
                        required
                      />
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedChange(i, "dosage", e.target.value)}
                        className="input"
                        placeholder="Dosage"
                      />
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => handleMedChange(i, "frequency", e.target.value)}
                        className="input"
                        placeholder="Frequency"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedChange(i, "duration", e.target.value)}
                          className="input"
                          placeholder="Duration"
                        />
                        {medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedication(i)}
                            className="shrink-0 p-3 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addMedication}
                  className="btn btn-secondary btn-sm mt-3"
                >
                  <Plus className="w-4 h-4" />
                  Add Medication
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input h-auto py-3"
                  rows={3}
                  placeholder="Additional notes (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "completed")}
                  className="select"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {initialData ? "Update" : "Create"} Prescription
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
