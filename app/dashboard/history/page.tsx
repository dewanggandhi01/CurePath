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
        <p className="text-xl text-gray-500">Access denied. Patients only.</p>
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
        <p className="text-gray-500 mt-1">Your past medical records and diagnoses</p>
      </div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-12"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="relative">
          <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-gray-200" />

          <div className="space-y-8">
            {filtered.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-6"
              >
                <div className="relative z-10 flex-shrink-0 w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary-400" />
                </div>

                <div className="card flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`badge text-xs ${typeColors[rec.type] || "bg-gray-100 text-gray-600"}`}>
                      {rec.type}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(rec.date)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{rec.diagnosis}</h3>
                  <p className="text-sm text-gray-500 mb-3">By {rec.doctorName}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{rec.notes}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-16">
          <Clock className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-lg text-gray-500">No medical records found</p>
          <p className="text-sm text-gray-400 mt-1">Your medical history will appear here</p>
        </div>
      )}
    </div>
  );
}
