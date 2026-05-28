"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, FileText } from "lucide-react";
import PrescriptionCard from "@/components/PrescriptionCard";
import PrescriptionForm from "@/components/PrescriptionForm";
import SearchFilter from "@/components/SearchFilter";
import { SkeletonPrescriptionCards } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import { getUser, isDoctor, DEMO_USERS, type User } from "@/lib/auth";
import {
  getPrescriptions,
  getPrescriptionsByPatient,
  searchPrescriptions,
  createPrescription,
  updatePrescription,
  getAllPatients,
  type Prescription,
} from "@/lib/data";
import { generatePrescriptionPDF } from "@/lib/pdf";

export default function PrescriptionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filtered, setFiltered] = useState<Prescription[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback((u: User) => {
    const data = isDoctor(u) ? getPrescriptions() : getPrescriptionsByPatient(u.id);
    setPrescriptions(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    const u = getUser();
    if (!u) return;
    setUser(u);
    loadData(u);
    setTimeout(() => setLoading(false), 300);
  }, [loadData]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setFiltered(searchPrescriptions(q, filters));
  };

  const handleFilterChange = (f: Record<string, string>) => {
    setFilters(f);
    setFiltered(searchPrescriptions(query, f));
  };

  const handleSubmit = (
    data: Omit<Prescription, "id" | "createdAt" | "updatedAt" | "doctorId" | "doctorName">
  ) => {
    if (editing) {
      updatePrescription(editing.id, data);
      toast("success", "Prescription Updated", `Updated prescription for ${data.patientName}`);
    } else {
      createPrescription({ ...data, doctorId: user!.id, doctorName: user!.name });
      toast("success", "Prescription Created", `New prescription for ${data.patientName}`);
    }
    loadData(user!);
    setEditing(null);
  };

  const handleDownload = (rx: Prescription) => {
    generatePrescriptionPDF(rx);
    toast("success", "PDF Downloaded", `Prescription for ${rx.patientName} saved`);
  };

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <div>
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-text" style={{ width: "200px" }} />
        </div>
        <SkeletonPrescriptionCards count={6} />
      </div>
    );
  }

  const doctor = isDoctor(user);
  const patients = doctor
    ? DEMO_USERS.filter((u) => u.role === "patient").map((u) => ({ id: u.id, name: u.name }))
    : [];

  const filterConfig = [
    {
      label: "All Status",
      key: "status",
      options: [
        { value: "active", label: "Active" },
        { value: "completed", label: "Completed" },
        { value: "expired", label: "Expired" },
      ],
    },
    ...(doctor
      ? [
          {
            label: "All Patients",
            key: "patientId",
            options: getAllPatients().map((p) => ({
              value: p.patientId,
              label: p.patientName,
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {doctor ? "Prescriptions" : "My Prescriptions"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {doctor ? "Manage all prescriptions" : "View your prescriptions"}{" "}
            <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
              · {prescriptions.length} total
            </span>
          </p>
        </motion.div>
        {doctor && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              setEditing(null);
              setIsFormOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            New Prescription
          </motion.button>
        )}
      </div>

      <SearchFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filterConfig}
      />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((rx, i) => (
            <PrescriptionCard
              key={rx.id}
              prescription={rx}
              onView={(id) => router.push(`/dashboard/prescriptions/${id}`)}
              onDownload={handleDownload}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <FileText className="empty-state-icon mx-auto" />
          <p className="empty-state-title">No prescriptions found</p>
          <p className="empty-state-text">Try adjusting your search or filters</p>
        </div>
      )}

      <PrescriptionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        patients={patients}
        initialData={editing}
        doctorId={user.id}
        doctorName={user.name}
      />
    </div>
  );
}
