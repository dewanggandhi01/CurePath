"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  FileText, 
  Search, 
  Download, 
  Eye, 
  MoreVertical, 
  Sparkles, 
  ShieldAlert, 
  Calendar, 
  Share2, 
  Archive,
  Filter,
  CheckCircle2,
  Trash,
} from "lucide-react";
import PrescriptionCard from "@/components/PrescriptionCard";
import PrescriptionForm from "@/components/PrescriptionForm";
import { SkeletonPrescriptionCards } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import { getUser, isDoctor, DEMO_USERS, type User } from "@/lib/auth";
import {
  getPrescriptions,
  getPrescriptionsByPatient,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getAllPatients,
  type Prescription,
} from "@/lib/data";
import { generatePrescriptionPDF } from "@/lib/pdf";

export default function PrescriptionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  
  // Data States
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filtered, setFiltered] = useState<Prescription[]>([]);
  
  // Layout States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [patientFilter, setPatientFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Load Data
  const loadData = useCallback((u: User) => {
    const data = isDoctor(u) ? getPrescriptions() : getPrescriptionsByPatient(u.id);
    setPrescriptions(data);
  }, []);

  useEffect(() => {
    const u = getUser();
    if (!u) return;
    setUser(u);
    loadData(u);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [loadData]);

  // Apply Search, Filter and Sort
  useEffect(() => {
    let result = [...prescriptions];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.diagnosis.toLowerCase().includes(q) ||
          p.patientName.toLowerCase().includes(q) ||
          p.doctorName.toLowerCase().includes(q) ||
          p.medications.some((m) => m.name.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Patient filter (Doctors only)
    if (patientFilter !== "all") {
      result = result.filter((p) => p.patientId === patientFilter);
    }

    // Sorting
    if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "diagnosis") {
      result.sort((a, b) => a.diagnosis.localeCompare(b.diagnosis));
    }

    setFiltered(result);
  }, [prescriptions, searchQuery, statusFilter, patientFilter, sortBy]);

  // Keyboard shortcut for Search (⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (
    data: Omit<Prescription, "id" | "createdAt" | "updatedAt" | "doctorId" | "doctorName">
  ) => {
    if (editing) {
      updatePrescription(editing.id, data);
      toast("success", "Updated successfully", `Prescription for ${data.patientName} updated`);
    } else {
      createPrescription({ ...data, doctorId: user!.id, doctorName: user!.name });
      toast("success", "Created successfully", `Prescription issued to ${data.patientName}`);
    }
    loadData(user!);
    setEditing(null);
    setIsFormOpen(false);
  };

  const handleDownload = (rx: Prescription, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      generatePrescriptionPDF(rx);
      toast("success", "Exported", "Prescription PDF downloaded successfully");
    } catch (err) {
      toast("error", "Error", "Failed to generate prescription PDF");
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the prescription for ${name}?`)) {
      deletePrescription(id);
      toast("success", "Deleted", `Prescription for ${name} removed`);
      loadData(user!);
    }
  };

  const handleExportAll = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `prescriptions_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast("success", "Success", "Exported all filtered prescriptions as JSON");
    } catch (err) {
      toast("error", "Failed", "Could not export data");
    }
  };

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <div>
          <div className="skeleton skeleton-heading" style={{ width: 240 }} />
          <div className="skeleton skeleton-text" style={{ width: 140 }} />
        </div>
        <SkeletonPrescriptionCards count={6} />
      </div>
    );
  }

  const doctor = isDoctor(user);
  const patientsList = doctor
    ? DEMO_USERS.filter((u) => u.role === "patient").map((u) => ({ id: u.id, name: u.name }))
    : [];

  // Prescription Stats Calculation
  const activeCount = prescriptions.filter((p) => p.status === "active").length;
  const completedCount = prescriptions.filter((p) => p.status === "completed").length;
  const expiredCount = prescriptions.filter((p) => p.status === "expired").length;

  // Identify Featured Prescription (Most recent active one)
  const featuredRx = filtered.find((p) => p.status === "active");
  const gridRx = featuredRx ? filtered.filter((p) => p.id !== featuredRx.id) : filtered;

  return (
    <div className="space-y-5">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
            {doctor ? "Prescription Hub" : "My Prescriptions"}
          </h1>
          {/* Quick Stats Pills */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: "rgba(22, 163, 74, 0.08)", color: "#16A34A" }}>
              {activeCount} Active
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: "rgba(37, 99, 235, 0.08)", color: "#2563EB" }}>
              {completedCount} Completed
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: "rgba(100, 116, 139, 0.08)", color: "#64748B" }}>
              {expiredCount} Expired
            </span>
          </div>
        </div>

        {doctor && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setEditing(null);
              setIsFormOpen(true);
            }}
            className="btn btn-primary btn-sm rounded-xl h-10 gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            New Prescription
          </motion.button>
        )}
      </div>

      {/* 2. Advanced Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between p-2 rounded-2xl border bg-white/40 dark:bg-slate-900/40 backdrop-blur-md" style={{ borderColor: "var(--card-border)" }}>
        {/* Search Bar with Shortcut hint */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="search-input"
            type="text"
            placeholder="Search prescriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 pr-12 text-xs"
            style={{
              height: "42px",
              borderRadius: "12px",
              background: "var(--card-bg-glass)",
              borderColor: "var(--card-border)",
            }}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md border">
            ⌘K
          </span>
        </div>

        {/* Inline Filters, Sorting & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select text-xs min-w-[120px] max-w-[150px]"
            style={{ height: "42px", borderRadius: "12px" }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>

          {/* Patient filter (Doctors only) */}
          {doctor && (
            <select
              value={patientFilter}
              onChange={(e) => setPatientFilter(e.target.value)}
              className="select text-xs min-w-[130px] max-w-[160px]"
              style={{ height: "42px", borderRadius: "12px" }}
            >
              <option value="all">All Patients</option>
              {getAllPatients().map((p) => (
                <option key={p.patientId} value={p.patientId}>
                  {p.patientName}
                </option>
              ))}
            </select>
          )}

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select text-xs min-w-[100px]"
            style={{ height: "42px", borderRadius: "12px" }}
          >
            <option value="latest">Latest</option>
            <option value="diagnosis">Diagnosis</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExportAll}
            className="btn btn-secondary btn-sm h-[42px] rounded-xl text-xs gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column (Featured Card & Prescription Grid) */}
          <div className="xl:col-span-2 space-y-5">
            
            {/* 3. Featured Card Section (breaks CRUD layout) */}
            {featuredRx && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Primary Focus
                </h3>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card relative overflow-hidden border-l-[4px] border-emerald-500"
                  style={{
                    padding: "32px 24px",
                    background: "linear-gradient(135deg, var(--card-bg) 0%, rgba(16, 185, 129, 0.02) 100%)",
                  }}
                >
                  {/* Recent Activity Glow */}
                  <span className="absolute top-4 right-4 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>

                  <div className="flex flex-col justify-between h-full gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="badge badge-active text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold">
                          Featured
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Issued: {new Date(featuredRx.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                        {featuredRx.diagnosis}
                      </h2>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {featuredRx.doctorName} → <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>{featuredRx.patientName}</span>
                      </p>
                    </div>

                    {/* Medications Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {featuredRx.medications.map((med) => (
                        <span
                          key={med.name}
                          className="text-[10px] px-3 py-1 rounded-full font-medium"
                          style={{
                            background: "var(--bg-tertiary)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--card-border)",
                          }}
                        >
                          {med.name} ({med.dosage})
                        </span>
                      ))}
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between border-t pt-3 mt-1" style={{ borderColor: "var(--card-border)" }}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => router.push(`/dashboard/prescriptions/${featuredRx.id}`)}
                          className="btn btn-primary btn-sm text-[11px] h-8 rounded-lg gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                        <button
                          onClick={(e) => handleDownload(featuredRx, e)}
                          className="btn btn-secondary btn-sm h-8 rounded-lg"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {doctor && (
                          <button
                            onClick={() => handleDelete(featuredRx.id, featuredRx.patientName)}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* 4. Grid Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Prescriptions list
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gridRx.map((rx, i) => (
                  <PrescriptionCard
                    key={rx.id}
                    prescription={rx}
                    onView={(id) => router.push(`/dashboard/prescriptions/${id}`)}
                    onDownload={handleDownload}
                    index={i}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Clinical Insights Sidebar - VERY IMPORTANT) */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              SaaS Insights Sidebar
            </h3>

            {/* AI suggestions / refinement status */}
            <div className="card space-y-4" style={{ padding: "32px 24px" }}>
              <div className="flex items-center gap-2 text-emerald-500">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <h4 className="font-bold text-xs uppercase tracking-wider">Adherence Assistant</h4>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Patient medication adherence rates are showing an overall **8.4% improvement** since implementing Refill Sync.
              </p>
              
              <div className="border-t border-dashed pt-3" style={{ borderColor: "var(--card-border)" }} />
              
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-500">Adherence Alert</span>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      2 active prescriptions are scheduled for refill renewals this week.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-500">Sync Status</span>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Refill schedules synchronizing correctly with national pharmacy registries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card space-y-3" style={{ padding: "32px 24px" }}>
              <h4 className="font-bold text-xs uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>Refill Insights</h4>
              <div className="text-[11px] flex justify-between py-1 border-b" style={{ borderColor: "var(--card-border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Refill Adherence</span>
                <span className="font-bold text-emerald-500">92.4%</span>
              </div>
              <div className="text-[11px] flex justify-between py-1 border-b" style={{ borderColor: "var(--card-border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Patient Risk Status</span>
                <span className="font-bold text-amber-500">Medium</span>
              </div>
              <div className="text-[11px] flex justify-between py-1">
                <span style={{ color: "var(--text-secondary)" }}>Refill Synchronization</span>
                <span className="font-bold text-blue-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="card empty-state">
          <FileText className="empty-state-icon mx-auto" />
          <p className="empty-state-title">No prescriptions found</p>
          <p className="empty-state-text">Try adjusting your search query or filters above</p>
        </div>
      )}

      <PrescriptionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        patients={patientsList}
        initialData={editing}
        doctorId={user.id}
        doctorName={user.name}
      />
    </div>
  );
}
