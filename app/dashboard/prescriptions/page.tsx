"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText } from "lucide-react";
import PrescriptionCard from "@/components/PrescriptionCard";
import PrescriptionForm from "@/components/PrescriptionForm";
import SearchFilter from "@/components/SearchFilter";
import { getUser, isDoctor, type User } from "@/lib/auth";
import {
  getPrescriptions,
  getPrescriptionsByPatient,
  searchPrescriptions,
  createPrescription,
  updatePrescription,
  getAllPatients,
  type Prescription,
} from "@/lib/data";
import { DEMO_USERS } from "@/lib/auth";
import { generatePrescriptionPDF } from "@/lib/pdf";

export default function PrescriptionsPage() {
  const router = useRouter();
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
    setLoading(false);
  }, [loadData]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setFiltered(searchPrescriptions(q, filters));
  };

  const handleFilterChange = (f: Record<string, string>) => {
    setFilters(f);
    setFiltered(searchPrescriptions(query, f));
  };

  const handleSubmit = (data: Omit<Prescription, "id" | "createdAt" | "updatedAt" | "doctorId" | "doctorName">) => {
    if (editing) {
      updatePrescription(editing.id, data);
    } else {
      createPrescription({
        ...data,
        doctorId: user!.id,
        doctorName: user!.name,
      });
    }
    loadData(user!);
    setEditing(null);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {doctor ? "Prescriptions" : "My Prescriptions"}
          </h1>
          <p className="text-gray-500 mt-1">
            {doctor ? "Manage all prescriptions" : "View your prescriptions"}
          </p>
        </div>
        {doctor && (
          <button
            onClick={() => {
              setEditing(null);
              setIsFormOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            New Prescription
          </button>
        )}
      </div>

      <div className="mb-6">
        <SearchFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          filters={filterConfig}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((rx, i) => (
            <PrescriptionCard
              key={rx.id}
              prescription={rx}
              onView={(id) => router.push(`/dashboard/prescriptions/${id}`)}
              onDownload={generatePrescriptionPDF}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-16">
          <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-lg text-gray-500">No prescriptions found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
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
