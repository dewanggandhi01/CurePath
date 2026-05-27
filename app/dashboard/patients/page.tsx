"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Users as UsersIcon } from "lucide-react";
import { getUser, isDoctor, type User } from "@/lib/auth";
import { getAllPatients, getPrescriptionsByPatient } from "@/lib/data";

export default function PatientsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<{ patientId: string; patientName: string }[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u || !isDoctor(u)) {
      setLoading(false);
      return;
    }
    setUser(u);
    setPatients(getAllPatients());
    setLoading(false);
  }, []);

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

  const filtered = patients.filter((p) =>
    p.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
        <p className="text-gray-500 mt-1">Manage and view patient information</p>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-12"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p, i) => {
            const rxCount = getPrescriptionsByPatient(p.patientId).length;
            return (
              <motion.div
                key={p.patientId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card card-hover cursor-pointer"
                onClick={() => router.push(`/dashboard/patients/${p.patientId}`)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-600">
                      {p.patientName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{p.patientName}</h3>
                    <p className="text-sm text-gray-500">{rxCount} prescription{rxCount !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm w-full">
                  View Records
                </button>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-16">
          <UsersIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-lg text-gray-500">No patients found</p>
        </div>
      )}
    </div>
  );
}
