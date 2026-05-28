"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Users as UsersIcon, FileText, ArrowRight } from "lucide-react";
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
    setTimeout(() => setLoading(false), 300);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-text" style={{ width: "240px" }} />
        </div>
        <div className="skeleton" style={{ width: 320, height: 48, borderRadius: 12 }} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" style={{ height: 180 }} />
          ))}
        </div>
      </div>
    );
  }

  if (!user || !isDoctor(user)) {
    return (
      <div className="card empty-state max-w-lg mx-auto">
        <UsersIcon className="empty-state-icon mx-auto" />
        <p className="empty-state-title">Access Denied</p>
        <p className="empty-state-text">This section is only available for doctors</p>
      </div>
    );
  }

  const filtered = patients.filter((p) =>
    p.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Patient Records
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Manage and view patient information{" "}
          <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
            · {patients.length} patients
          </span>
        </p>
      </motion.div>

      <div className="relative max-w-sm">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors"
          style={{ color: search ? "var(--color-primary-500)" : "var(--text-muted)" }}
        />
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
            const rxList = getPrescriptionsByPatient(p.patientId);
            const activeCount = rxList.filter((r) => r.status === "active").length;
            return (
              <motion.div
                key={p.patientId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card card-hover cursor-pointer group"
                onClick={() => router.push(`/dashboard/patients/${p.patientId}`)}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))",
                    }}
                  >
                    <span className="text-sm font-bold" style={{ color: "var(--color-primary-600)" }}>
                      {p.patientName.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {p.patientName}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {rxList.length} prescription{rxList.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {activeCount > 0 && (
                    <span className="badge badge-active text-[11px]">
                      {activeCount} active
                    </span>
                  )}
                  {rxList.length > 0 && (
                    <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                      <FileText className="w-3 h-3 inline mr-1" />
                      Last: {new Date(rxList[rxList.length - 1].createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>

                <button className="btn btn-secondary btn-sm w-full group-hover:border-primary-200">
                  View Records
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card empty-state">
          <UsersIcon className="empty-state-icon mx-auto" />
          <p className="empty-state-title">No patients found</p>
          <p className="empty-state-text">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}
