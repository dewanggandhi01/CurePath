"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Activity,
  Calendar,
  ClipboardList,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import StatsCard from "@/components/StatsCard";
import PrescriptionCard from "@/components/PrescriptionCard";
import { SkeletonDashboard } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import { getUser, isDoctor, type User } from "@/lib/auth";
import {
  getPrescriptions,
  getPrescriptionsByPatient,
  getMedicalRecords,
  getAllPatients,
  type Prescription,
} from "@/lib/data";
import { generatePrescriptionPDF } from "@/lib/pdf";

function getMonthlyData(prescriptions: Prescription[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const now = new Date();
  return months.map((name, i) => {
    const month = now.getMonth() - 5 + i;
    const count = prescriptions.filter((p) => {
      const d = new Date(p.createdAt);
      return (
        d.getMonth() === ((month + 12) % 12) &&
        d.getFullYear() === (month < 0 ? now.getFullYear() - 1 : now.getFullYear())
      );
    }).length;
    return { name, count };
  });
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--card-bg-glass)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid var(--card-border)",
      borderRadius: "10px",
      padding: "8px 12px",
      boxShadow: "var(--shadow-md)",
    }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-xs font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>{payload[0].value} issued</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "6m" | "1y">("6m");

  useEffect(() => {
    const u = getUser();
    if (!u) return;
    setUser(u);
    const rx = isDoctor(u) ? getPrescriptions() : getPrescriptionsByPatient(u.id);
    setPrescriptions(rx);
    
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !user) {
    return <SkeletonDashboard />;
  }

  const doctor = isDoctor(user);
  const active = prescriptions.filter((p) => p.status === "active").length;
  const patients = getAllPatients();
  const thisMonth = prescriptions.filter((p) => {
    const d = new Date(p.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const chartData = getMonthlyData(prescriptions);
  const recent = [...prescriptions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3); // 3 items for compact layout and broke symmetry

  const handleDownload = (rx: Prescription) => {
    try {
      generatePrescriptionPDF(rx);
      toast("success", "Success", "Prescription PDF downloaded successfully");
    } catch (err) {
      toast("error", "Error", "Failed to download prescription PDF");
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Realistic mock activity streams based on role
  const activities = doctor
    ? [
        { time: "10m ago", desc: "You issued a new prescription to Rahul Sharma", dot: "bg-emerald-500" },
        { time: "1h ago", desc: "Priya Patel downloaded prescription PDF #RX-201", dot: "bg-blue-500" },
        { time: "3h ago", desc: "Patient Amit Verma's lab records updated", dot: "bg-amber-500" },
      ]
    : [
        { time: "2h ago", desc: "Dr. Sharma updated your prescription schedule", dot: "bg-emerald-500" },
        { time: "Yesterday", desc: "Your blood panel analysis has been updated", dot: "bg-blue-500" },
        { time: "3 days ago", desc: "Prescription #RX-109 was completed", dot: "bg-gray-400" },
      ];

  const insights = doctor
    ? [
        { text: "Prescription adherence is up 8.4% this week", type: "adherence" },
        { text: "2 active prescriptions expire in the next 48h", type: "expiring" },
      ]
    : [
        { text: "You have 1 active prescription. Next dose reminder is on.", type: "schedule" },
        { text: "Your quarterly medical summary is compiled", type: "summary" },
      ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center justify-center gap-2 pb-5 border-b"
        style={{ borderColor: "var(--card-border)" }}
      >
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
            Prescription Analytics Overview
          </h1>
          <p className="text-sm mt-1 uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
            Revenue | Patients | Growth | Prescriptions
          </p>
        </div>
      </motion.div>

      {/* Stats and Graph Side-by-Side Section */}
      {doctor ? (
        <div className="dashboard-grid">
          {/* Left Side: Metric/KPI Cards in a 2x2 grid */}
          <div className="metrics-grid">
            {/* Total Patients */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0 }}
              className="metric-card rounded-exempt"
            >
              <div className="metric-header">
                <div className="metric-icon">
                  <Users className="w-5.5 h-5.5" />
                </div>
                <div className="growth positive">+12%</div>
              </div>
              <h3>{patients.length}</h3>
              <p>Total Patients</p>
            </motion.div>

            {/* Total Issued */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.06 }}
              className="metric-card rounded-exempt"
            >
              <div className="metric-header">
                <div className="metric-icon" style={{ background: "rgba(37, 99, 235, 0.08)", color: "#2563eb" }}>
                  <FileText className="w-5.5 h-5.5" />
                </div>
                <div className="growth positive">+8%</div>
              </div>
              <h3>{prescriptions.length}</h3>
              <p>Total Issued</p>
            </motion.div>

            {/* Active Cases */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.12 }}
              className="metric-card rounded-exempt"
            >
              <div className="metric-header">
                <div className="metric-icon" style={{ background: "rgba(16, 185, 129, 0.08)", color: "#10b981" }}>
                  <Activity className="w-5.5 h-5.5" />
                </div>
                <div className="growth positive">+5%</div>
              </div>
              <h3>{active}</h3>
              <p>Active Cases</p>
            </motion.div>

            {/* Issued This Month */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.18 }}
              className="metric-card rounded-exempt"
            >
              <div className="metric-header">
                <div className="metric-icon" style={{ background: "rgba(245, 158, 11, 0.08)", color: "#d97706" }}>
                  <Calendar className="w-5.5 h-5.5" />
                </div>
                <div className="growth positive">+15%</div>
              </div>
              <h3>{thisMonth}</h3>
              <p>Issued This Month</p>
            </motion.div>
          </div>

          {/* Right Side: Redesigned Analytics Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.24 }}
            className="analytics-card rounded-exempt"
          >
            {/* Analytics Header */}
            <div className="analytics-header">
              <div>
                <h2>Prescription Analytics</h2>
                <p>Practice metrics and issuing flow</p>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="rounded-exempt"
              >
                <option value="6m">Last 6 Months</option>
                <option value="30d">Last 30 Days</option>
                <option value="7d">Last 7 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            {/* Statistics Above Chart */}
            <div className="analytics-stats">
              <div className="analytics-stats-item">
                <span>Total Prescriptions</span>
                <h3>{prescriptions.length}</h3>
              </div>
              <div className="analytics-stats-item">
                <span>Growth</span>
                <h3>+12%</h3>
              </div>
              <div className="analytics-stats-item">
                <span>Active Cases</span>
                <h3>{active}</h3>
              </div>
            </div>

            {/* Chart Area */}
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--card-border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-primary-500)"
                    strokeWidth={2}
                    fill="url(#colorCount)"
                    dot={{ r: 3, fill: "var(--color-primary-500)", stroke: "var(--card-bg)", strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: "var(--color-primary-500)", stroke: "var(--card-bg)", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Patient view stats - normal 3-column span, no chart */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Active Prescriptions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0 }}
            className="metric-card rounded-exempt"
          >
            <div className="metric-header">
              <div className="metric-icon">
                <Activity className="w-5.5 h-5.5" />
              </div>
              <div className="growth positive">Active</div>
            </div>
            <h3>{active}</h3>
            <p>Active Prescriptions</p>
          </motion.div>

          {/* Total Prescriptions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.06 }}
            className="metric-card rounded-exempt"
          >
            <div className="metric-header">
              <div className="metric-icon" style={{ background: "rgba(37, 99, 235, 0.08)", color: "#2563eb" }}>
                <FileText className="w-5.5 h-5.5" />
              </div>
              <div className="growth positive">Total</div>
            </div>
            <h3>{prescriptions.length}</h3>
            <p>Total Prescriptions</p>
          </motion.div>

          {/* Medical Records */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            className="metric-card rounded-exempt"
          >
            <div className="metric-header">
              <div className="metric-icon" style={{ background: "rgba(245, 158, 11, 0.08)", color: "#d97706" }}>
                <ClipboardList className="w-5.5 h-5.5" />
              </div>
              <div className="growth positive">Records</div>
            </div>
            <h3>{getMedicalRecords(user.id).length}</h3>
            <p>Medical Records</p>
          </motion.div>
        </div>
      )}

      {/* Main Asymmetric Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns (Recent Items) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Recent list layout */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="section-title">
                {doctor ? "Recent Prescriptions" : "My Active Prescriptions"}
              </h2>
              <button
                onClick={() => router.push("/dashboard/prescriptions")}
                className="btn btn-secondary btn-sm"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
            {recent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recent.map((rx, i) => (
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
                <p className="empty-state-title">No prescriptions yet</p>
                <p className="empty-state-text">Prescriptions will appear here once created</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column (Asymmetric Widgets: Insights & Activity timeline) */}
        <div className="space-y-6">
          
          {/* Insights widget */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
            style={{ padding: "32px 24px" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>Clinical Insights</h3>
            </div>
            
            <div className="space-y-3">
              {insights.map((ins, i) => (
                <div 
                  key={i} 
                  className="flex gap-3 p-3 rounded-xl border border-dashed"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--card-border)" }}
                >
                  <Zap className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0" />
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {ins.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Widget */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
            style={{ padding: "32px 24px" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>Live Feed</h3>
            </div>

            <div className="relative pl-4 border-l space-y-4" style={{ borderColor: "var(--card-border)" }}>
              {activities.map((act, i) => (
                <div key={i} className="relative leading-none">
                  {/* Timeline dot */}
                  <span className={`absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 ${act.dot}`} />
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">{act.time}</span>
                    <p className="text-xs font-medium mt-1 leading-normal" style={{ color: "var(--text-secondary)" }}>
                      {act.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
