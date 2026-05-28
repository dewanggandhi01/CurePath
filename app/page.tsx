"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Pill } from "lucide-react";
import { login } from "@/lib/auth";
import { seedData } from "@/lib/data";
import { ToastProvider, useToast } from "@/components/Toast";

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
  return (
    <ToastProvider>
      <LoginForm />
    </ToastProvider>
  );
}

function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<"doctor" | "patient">("doctor");
  const [email, setEmail] = useState(demoCredentials.doctor.email);
  const [password, setPassword] = useState(demoCredentials.doctor.password);
  const [loading, setLoading] = useState(false);

  const switchRole = (r: "doctor" | "patient") => {
    setRole(r);
    setEmail(demoCredentials[r].email);
    setPassword(demoCredentials[r].password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Slight artificial delay for premium UX response
    setTimeout(() => {
      seedData();
      const user = login(email, password);
      if (user) {
        toast("success", "Welcome Back", `Successfully signed in as ${user.name}`);
        router.push("/dashboard");
      } else {
        toast("error", "Sign In Failed", "Invalid email or password. Please try again.");
        setLoading(false);
      }
    }, 600);
  };

  const orbVariants = {
    animate1: {
      y: [0, 30, -30, 0],
      x: [0, -15, 15, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
    animate2: {
      y: [0, -25, 25, 0],
      x: [0, 20, -20, 0],
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
    animate3: {
      y: [0, 15, -15, 0],
      x: [0, 15, -15, 0],
      transition: {
        duration: 14,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2" style={{ background: "var(--bg-primary)" }}>
      {/* Left panel - Branding and illustration */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-center px-16 xl:px-24 bg-gradient-to-br from-[#16735C] to-[#073226]">
        {/* Floating animated particles/orbs */}
        <motion.div
          variants={orbVariants}
          animate="animate1"
          className="absolute top-20 -right-16 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none"
        />
        <motion.div
          variants={orbVariants}
          animate="animate2"
          className="absolute bottom-32 -left-10 w-48 h-48 rounded-full bg-white/5 blur-xl pointer-events-none"
        />
        <motion.div
          variants={orbVariants}
          animate="animate3"
          className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/5 blur-lg pointer-events-none"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,115,92,0.15),transparent_60%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-lg"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Pill className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">CurePath</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
            Digital Prescription
            <br />
            Management
          </h1>
          <p className="text-base text-white/60 mb-12 max-w-md leading-relaxed">
            Simplify prescription tracking and improve accessibility for doctors and patients with our clean, secure, and modern platform.
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
                <CheckCircle className="w-5 h-5 text-emerald-300/80" />
                <span className="text-white/80 text-[15px]">{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel - Form */}
      <div className="flex items-center justify-center p-6 sm:p-10" style={{ background: "var(--bg-primary)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-md">
              <Pill className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>CurePath</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1.5" style={{ color: "var(--text-primary)" }}>
            Welcome back
          </h2>
          <p className="text-[15px] mb-8" style={{ color: "var(--text-muted)" }}>Sign in to your account</p>

          {/* Role selector tab animation */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: "var(--bg-secondary)", border: "1px solid var(--card-border)" }}>
            {(["doctor", "patient"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={`relative flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize z-10 ${
                  role === r
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {role === r && (
                  <motion.div
                    layoutId="login-role-bg"
                    className="absolute inset-0 bg-primary-500 rounded-lg -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
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
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2"
              style={{ height: 48 }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div 
            className="mt-8 rounded-xl p-4 border" 
            style={{ background: "var(--bg-secondary)", borderColor: "var(--card-border)" }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Demo Credentials</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Email: <span className="font-mono">{demoCredentials[role].email}</span>
              <br />
              Password: <span className="font-mono">{demoCredentials[role].password}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
