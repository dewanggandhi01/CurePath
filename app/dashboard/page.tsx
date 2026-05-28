"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, FileText, Activity, Calendar, ClipboardList } from "lucide-react";
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
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
      borderRadius: "var(--radius-md)",
      padding: "10px 14px",
      boxShadow: "var(--shadow-md)",
    }}>
      <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{payload[0].value} prescriptions</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u) return;
    setUser(u);
    const rx = isDoctor(u) ? getPrescriptions() : getPrescriptionsByPatient(u.id);
    setPrescriptions(rx);
    // Small delay for skeleton effect
    setTimeout(() => setLoading(false), 400);
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
    .slice(0, 4);

  const handleDownload = (rx: Prescription) => {
    generatePrescriptionPDF(rx);
    toast("success", "PDF Downloaded", `Prescription for ${rx.patientName} downloaded`);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {greeting()}, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {doctor
            ? `Here's an overview of your practice · ${new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}`
            : `Your prescription overview · ${new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}`}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div
        className={`grid gap-5 ${
          doctor
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-3"
        }`}
      >
        {doctor ? (
          <>
            <StatsCard
              title="Total Patients"
              value={patients.length}
              icon={<Users className="w-5 h-5" style={{ color: "var(--color-primary-500)" }} />}
              trend={{ value: 12, label: "this month" }}
              index={0}
            />
            <StatsCard
              title="Total Prescriptions"
              value={prescriptions.length}
              icon={<FileText className="w-5 h-5 text-blue-500" />}
              color="#2563EB"
              index={1}
            />
            <StatsCard
              title="Active"
              value={active}
              icon={<Activity className="w-5 h-5 text-emerald-500" />}
              color="#10B981"
              index={2}
            />
            <StatsCard
              title="This Month"
              value={thisMonth}
              icon={<Calendar className="w-5 h-5 text-amber-500" />}
              color="#F59E0B"
              trend={{ value: 8, label: "vs last month" }}
              index={3}
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Active Prescriptions"
              value={active}
              icon={<Activity className="w-5 h-5" style={{ color: "var(--color-primary-500)" }} />}
              index={0}
            />
            <StatsCard
              title="Total Prescriptions"
              value={prescriptions.length}
              icon={<FileText className="w-5 h-5 text-blue-500" />}
              color="#2563EB"
              index={1}
            />
            <StatsCard
              title="Medical Records"
              value={getMedicalRecords(user.id).length}
              icon={<ClipboardList className="w-5 h-5 text-amber-500" />}
              color="#F59E0B"
              index={2}
            />
          </>
        )}
      </div>

      {/* Chart Section */}
      {doctor && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Prescription Trends</h2>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Last 6 months overview</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16735C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16735C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--text-muted)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#16735C"
                strokeWidth={2.5}
                fill="url(#colorCount)"
                dot={{ r: 4, fill: "#16735C", stroke: "var(--card-bg)", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#16735C", stroke: "var(--card-bg)", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent Prescriptions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">
            {doctor ? "Recent Prescriptions" : "My Recent Prescriptions"}
          </h2>
          <button
            onClick={() => router.push("/dashboard/prescriptions")}
            className="btn btn-ghost btn-sm text-xs"
            style={{ color: "var(--color-primary-500)" }}
          >
            View all →
          </button>
        </div>
        {recent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
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
  );
}
