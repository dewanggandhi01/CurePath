"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Search } from "lucide-react";
import { getUser, isPatient, type User } from "@/lib/auth";
import { getMedicalRecords, type MedicalRecord } from "@/lib/data";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const typeColors: Record<string, string> = {
  "Lab Results": "bg-blue-50 text-blue-600",
  "General Checkup": "bg-green-50 text-green-600",
  "X-Ray": "bg-purple-50 text-purple-600",
  "Blood Test": "bg-red-50 text-red-600",
};

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u || !isPatient(u)) {
      setLoading(false);
      return;
    }
    setUser(u);
    setRecords(getMedicalRecords(u.id));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  if (!user || !isPatient(user)) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-400">Access denied. Patients only.</p>
      </div>
    );
  }

  const filtered = records.filter(
    (r) =>
      r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="section-title text-2xl">Medical History</h1>
        <p className="section-subtitle">Your past medical records and diagnoses</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
        <input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-11"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="relative">
          <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-gray-100" />

          <div className="space-y-6">
            {filtered.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative flex gap-5"
              >
                <div className="relative z-10 flex-shrink-0 w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-400" />
                </div>

                <div className="card flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span
                      className={`badge text-[11px] ${
                        typeColors[rec.type] || "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {rec.type}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(rec.date)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{rec.diagnosis}</h3>
                  <p className="text-sm text-gray-400 mb-2.5">By {rec.doctorName}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{rec.notes}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-20">
          <Clock className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-lg text-gray-400 font-medium">No medical records found</p>
          <p className="text-sm text-gray-300 mt-1">Your medical history will appear here</p>
        </div>
      )}
    </div>
  );
}
