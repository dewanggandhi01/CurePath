"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Pill, Mail, Lock, ShieldCheck } from "lucide-react";
import { login } from "@/lib/auth";
import { seedData } from "@/lib/data";
import { ToastProvider, useToast } from "@/components/Toast";

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

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 login-page-container rounded-exempt" style={{ background: "var(--bg-primary)" }}>
      {/* Left Column - Álvaro Montoro Animation Header */}
      <header className="login-anim-header left-panel">
        <div>
          {/* Logo container rounded-exempt */}
          <div className="rounded-exempt login-brand-logo">
            <Pill className="text-white w-1/2 h-1/2 animate-pulse" />
          </div>
          <h1>CurePath</h1>
          <p>Healthcare</p>
        </div>
      </header>

      {/* Right panel - Form inside login card */}
      <div className="flex items-center justify-center p-4 sm:p-10 right-panel" style={{ background: "var(--bg-primary)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[520px]"
        >
          <div className="login-card">
            <h1 className="login-h1 tracking-tight" style={{ color: "var(--text-primary)" }}>
              Welcome back
            </h1>
            <p className="login-subtitle">Sign in to your account</p>

            {/* Role selector sliding pill toggle */}
            <div className="login-toggle-container">
              <motion.div
                className="login-toggle-slider"
                initial={false}
                animate={{
                  left: role === "doctor" ? "6px" : "calc(50% + 2px)",
                  width: "calc(50% - 8px)",
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
              <button
                key="doctor"
                type="button"
                onClick={() => switchRole("doctor")}
                className={`login-toggle-btn ${role === "doctor" ? "active" : ""}`}
              >
                doctor
              </button>
              <button
                key="patient"
                type="button"
                onClick={() => switchRole("patient")}
                className={`login-toggle-btn ${role === "patient" ? "active" : ""}`}
              >
                patient
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
                <div className="login-input-wrapper">
                  <Mail className="input-icon w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
                <div className="login-input-wrapper">
                  <Lock className="input-icon w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {/* Forgot Password Link right-aligned */}
                <div className="flex justify-end mt-2">
                  <a
                    href="#"
                    className="forgot-password-link"
                    onClick={(e) => {
                      e.preventDefault();
                      toast("info", "Demo Login Only", "Please use the preconfigured credentials provided at the bottom of the card.");
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-btn-premium mt-4"
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

            {/* Trust Elements Badges */}
            <div className="trust-badge-group">
              <span className="trust-badge-item">
                <ShieldCheck className="w-4 h-4" /> HIPAA Compliant
              </span>
              <span className="trust-badge-item">
                <Lock className="w-4 h-4" /> End-to-End Encryption
              </span>
              <span className="trust-badge-item">
                <CheckCircle className="w-4 h-4" /> Secure Login
              </span>
            </div>

            {/* Demo Credentials Section inside Card */}
            <div className="demo-account-card">
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>💡 Demo Account</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Email: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{demoCredentials[role].email}</span>
                <br />
                Password: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{demoCredentials[role].password}</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
