"use client";

import { useState, useEffect } from "react";
import { X, Plus, Loader2 } from "lucide-react";
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
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setErrors({});
    setSubmitting(false);
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

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!patientId) errs.patient = "Please select a patient";
    if (!diagnosis.trim()) errs.diagnosis = "Diagnosis is required";
    if (medications.some((m) => !m.name.trim())) errs.medications = "All medications must have a name";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 300));

    onSubmit({
      patientId: patient.id,
      patientName: patient.name,
      diagnosis,
      medications: medications.filter((m) => m.name),
      notes,
      status,
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 glass"
          style={{ background: "var(--modal-overlay)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{
              background: "var(--card-bg)",
              borderRadius: "var(--radius-2xl)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--shadow-xl)",
              padding: "32px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {initialData ? "Edit Prescription" : "New Prescription"}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  {initialData ? "Update prescription details" : "Fill in the prescription details below"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Patient & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                    Patient <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={patientId}
                    onChange={(e) => { setPatientId(e.target.value); setErrors((p) => ({ ...p, patient: "" })); }}
                    className="select"
                    required
                  >
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {errors.patient && <p className="text-xs text-red-500 mt-1 font-medium">{errors.patient}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "active" | "completed")}
                    className="select"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Diagnosis <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => { setDiagnosis(e.target.value); setErrors((p) => ({ ...p, diagnosis: "" })); }}
                  className="input"
                  placeholder="Enter diagnosis"
                  required
                />
                {errors.diagnosis && <p className="text-xs text-red-500 mt-1 font-medium">{errors.diagnosis}</p>}
              </div>

              {/* Medications */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
                  Medications <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {medications.map((med, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-2 items-start"
                      >
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedChange(i, "name", e.target.value)}
                          className="input"
                          placeholder="Name *"
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
                              className="shrink-0 p-3 rounded-xl transition-colors"
                              style={{ color: "var(--color-error)" }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {errors.medications && <p className="text-xs text-red-500 mt-1 font-medium">{errors.medications}</p>}
                <button
                  type="button"
                  onClick={addMedication}
                  className="btn btn-secondary btn-sm mt-3"
                >
                  <Plus className="w-4 h-4" />
                  Add Medication
                </button>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input h-auto py-3"
                  rows={3}
                  placeholder="Additional notes (optional)"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4" style={{ borderTop: "1px solid var(--card-border)" }}>
                <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {initialData ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{initialData ? "Update" : "Create"} Prescription</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
