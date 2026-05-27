"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, Activity, Calendar, ClipboardList } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatsCard from "@/components/StatsCard";
import PrescriptionCard from "@/components/PrescriptionCard";
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u) return;
    setUser(u);
    const rx = isDoctor(u) ? getPrescriptions() : getPrescriptionsByPatient(u.id);
    setPrescriptions(rx);
    setLoading(false);
  }, []);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title text-2xl">Dashboard</h1>
        <p className="section-subtitle">
          {doctor ? "Overview of your practice" : "Your prescription overview"}
        </p>
      </div>

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
              icon={<Users className="w-5 h-5 text-primary-500" />}
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
              icon={<Activity className="w-5 h-5 text-primary-500" />}
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

      {doctor && (
        <div className="card">
          <h2 className="section-title mb-6">Prescription Trends</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16735C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16735C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E9ECEF",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  fontSize: 13,
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#16735C"
                strokeWidth={2}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div>
        <h2 className="section-title mb-5">
          {doctor ? "Recent Prescriptions" : "My Recent Prescriptions"}
        </h2>
        {recent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {recent.map((rx, i) => (
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
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No prescriptions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
