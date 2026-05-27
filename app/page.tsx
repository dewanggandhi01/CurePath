"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Pill } from "lucide-react";
import { login } from "@/lib/auth";
import { seedData } from "@/lib/data";

const features = [
  "Secure digital prescriptions",
  "Access anywhere, anytime",
  "Complete medical history",
];

const demoCredentials: Record<string, { email: string; password: string }> = {
  doctor: { email: "dr.sharma@curepath.com", password: "doctor123" },
  patient: { email: "rahul@email.com", password: "patient123" },
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"doctor" | "patient">("doctor");
  const [email, setEmail] = useState(demoCredentials.doctor.email);
  const [password, setPassword] = useState(demoCredentials.doctor.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchRole = (r: "doctor" | "patient") => {
    setRole(r);
    setEmail(demoCredentials[r].email);
    setPassword(demoCredentials[r].password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    seedData();
    const user = login(email, password);

    if (user) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-center px-16 bg-gradient-to-br from-[#115C49] to-[#073226]">
        <div className="absolute top-20 -right-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-32 -left-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/5" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">CurePath</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Digital Prescription<br />Management
          </h1>
          <p className="text-lg text-white/70 mb-10 max-w-md">
            Simplify prescription tracking and improve accessibility for doctors and patients.
          </p>

          <div className="flex flex-col gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-300" />
                <span className="text-white/90">{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-500">CurePath</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your account</p>

          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            {(["doctor", "patient"] as const).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all capitalize ${
                  role === r
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2"
              style={{ height: 52 }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 bg-blue-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">Demo Credentials</p>
            <p className="text-xs text-blue-600">
              Email: {demoCredentials[role].email}<br />
              Password: {demoCredentials[role].password}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
