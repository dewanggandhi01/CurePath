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
        <p className="text-xl text-gray-400">Access denied. Doctors only.</p>
      </div>
    );
  }

  const filtered = patients.filter((p) =>
    p.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title text-2xl">Patient Records</h1>
        <p className="section-subtitle">Manage and view patient information</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-11"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p, i) => {
            const rxCount = getPrescriptionsByPatient(p.patientId).length;
            return (
              <motion.div
                key={p.patientId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card card-hover cursor-pointer"
                onClick={() => router.push(`/dashboard/patients/${p.patientId}`)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">
                      {p.patientName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.patientName}</h3>
                    <p className="text-sm text-gray-400">
                      {rxCount} prescription{rxCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm w-full">View Records</button>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-20">
          <UsersIcon className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-lg text-gray-400">No patients found</p>
        </div>
      )}
    </div>
  );
}
