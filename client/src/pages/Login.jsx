import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import {
  Eye, EyeOff, Mail, User, ArrowRight, Check,
  Zap, Shield, Activity, Lock
} from "lucide-react";

/* ---------------------------------------------
   ANIMATED BACKGROUND
--------------------------------------------- */
const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${4 + i * 6.5}%`,
  size: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
  duration: 6 + i * 0.7,
  delay: i * 0.4,
  startTop: `${15 + (i * 23) % 70}%`,
}));

function AnimatedBG() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "#060b14" }}
      />

      {/* Floating orbs — radial gradients, no glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 720, height: 720,
          top: "-22%", right: "-16%",
          background: "radial-gradient(circle, rgba(0,180,220,0.11) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.1, 1], x: [0, 22, 0], y: [0, -16, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 560, height: 560,
          bottom: "-20%", left: "-14%",
          background: "radial-gradient(circle, rgba(0,80,160,0.10) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.15, 1], x: [0, -16, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 360, height: 360,
          top: "38%", left: "28%",
          background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,212,255,0.55) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          opacity: 0.05,
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: p.left,
            top: p.startTop,
            background: "#00d4ff",
            opacity: 0.22,
          }}
          animate={{ y: [0, -80, 0], opacity: [0.12, 0.45, 0.12] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(6,11,20,0.65) 100%)",
        }}
      />
    </div>
  );
}

/* ---------------------------------------------
   REUSABLE INPUT / BUTTON
--------------------------------------------- */
const inputCls =
  "w-full bg-[#0d1a2a] border border-[#00d4ff] rounded-none outline-none text-white text-sm px-4 py-3 placeholder-white/50 transition-all duration-300 focus:border-[#00d4ff] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0d1a2a] [&:-webkit-autofill]:[webkit-text-fill-color:#fff]";
const labelCls = "block text-sm font-semibold text-white mb-1.5 tracking-wide";

function PrimaryBtn({ children, loading, ...props }) {
  return (
    <button
      {...props}
      className="relative w-full h-12 rounded-none text-sm font-bold cursor-pointer overflow-hidden group transition-all duration-300 disabled:opacity-40 bg-[#00d4ff] text-[#060b14] hover:bg-[#00e5ff]"
    >
      {/* Slide-up hover sheen */}
      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-none" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : children}
      </span>
    </button>
  );
}

function GhostBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className="relative flex-1 h-12 rounded-none border border-white/20 text-white/60 text-sm font-semibold cursor-pointer overflow-hidden group transition-all duration-300 hover:border-[#00d4ff]/60 hover:text-[#00d4ff]"
    >
      <span className="absolute inset-0 bg-[#00d4ff]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-none" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

/* ---------------------------------------------
   STEP INDICATOR
--------------------------------------------- */
function StepIndicator({ step }) {
  const labels = ["Email", "Verify", "Profile"];
  return (
    <div className="flex items-center gap-2 mb-5">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 ${
              step > s
                ? "bg-[#00d4ff] text-[#060b14]"
                : step === s
                ? "border-2 border-[#00d4ff] text-[#00d4ff]"
                : "border border-white/20 text-white/30"
            }`}
          >
            {step > s ? <Check size={12} /> : s}
          </div>
          {i < 2 && (
            <div
              className={`w-6 h-px transition-all duration-400 ${
                step > s ? "bg-[#00d4ff]" : "bg-white/15"
              }`}
            />
          )}
        </div>
      ))}
      <span className="ml-1 text-[10px] text-white/40 tracking-widest uppercase">
        {labels[step - 1]}
      </span>
    </div>
  );
}

/* ---------------------------------------------
   WELCOME PANEL — shown on the opposite side
--------------------------------------------- */
function WelcomeHelloFriend({ visible }) {
  const features = [
    { icon: <Zap size={13} />, text: "AI-Powered Nutrition Plans" },
    { icon: <Activity size={13} />, text: "Real-Time Progress Tracking" },
    { icon: <Shield size={13} />, text: "Expert Dietitian Guidance" },
  ];
  return (
    <motion.div
      className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-10 pointer-events-none max-md:hidden"
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 60 }}
      transition={{ duration: 0.5, delay: visible ? 2.05 : 0 }}
      style={{ zIndex: 3 }}
    >
      <div className="text-center select-none">
        {/* Icon box */}
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.22)",
          }}
        >
          <Zap size={30} className="text-[#00d4ff]" />
        </div>

        <h2 className="text-[42px] font-black text-white uppercase tracking-tight leading-[1.05] mb-3">
          Hello,<br />Friend!
        </h2>

        {/* Teal divider */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-0.5 bg-[#00d4ff]" />
          <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
          <div className="w-10 h-0.5 bg-[#00d4ff]" />
        </div>

        <p className="text-white/45 text-sm mb-6 leading-relaxed max-w-[200px] mx-auto">
          Join thousands transforming their health with AI.
        </p>

        <div className="space-y-2.5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2.5 text-white/50 text-xs"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 18 }}
              transition={{ delay: visible ? 2.2 + i * 0.1 : 0 }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-[#00d4ff] flex-shrink-0"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.18)",
                }}
              >
                {f.icon}
              </div>
              <span>{f.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function WelcomeBack({ visible }) {
  return (
    <motion.div
      className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-10 pointer-events-none max-md:hidden"
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -60 }}
      transition={{ duration: 0.5, delay: visible ? 1.75 : 0 }}
      style={{ zIndex: 3 }}
    >
      <div className="text-center select-none">
        {/* Icon box */}
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.22)",
          }}
        >
          <Shield size={30} className="text-[#00d4ff]" />
        </div>

        <h2 className="text-[42px] font-black text-white uppercase tracking-tight leading-[1.05] mb-3">
          Welcome<br />Back!
        </h2>

        {/* Teal divider */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-0.5 bg-[#00d4ff]" />
          <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
          <div className="w-10 h-0.5 bg-[#00d4ff]" />
        </div>

        <p className="text-white/45 text-sm leading-relaxed max-w-[200px] mx-auto">
          Continue your personalized health and fitness journey.
        </p>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------
   SIGN IN PANEL
--------------------------------------------- */
function SignInPanel({ toggled, onToggle }) {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuth(data.token, data.user);
      toast.success("Welcome back!");
      const isAdmin =
        data.user.role === "admin" || data.user.role === "nutritionist";
      setTimeout(() => navigate(isAdmin ? "/admin" : "/dashboard"), 100);
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Stagger delays: appear 2.1–2.5s, disappear 0–0.4s
  const d = (appear, disappear) => ({
    duration: 0.4,
    delay: toggled ? disappear : appear,
  });

  return (
    <div
      className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-12 max-md:relative max-md:w-full max-md:px-8 max-md:py-12"
      style={{ zIndex: 2 }}
    >
      {/* Brand */}
      <motion.div
        className="flex items-center gap-2.5 mb-8"
        animate={{ opacity: toggled ? 0 : 1, x: toggled ? -50 : 0 }}
        transition={d(2.0, 0)}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#00d4ff,#0077aa)" }}
        >
          <Zap size={17} className="text-white" fill="white" />
        </div>
        <div>
          <div className="text-white font-black text-sm tracking-wider leading-none">
            NutriAI
          </div>
          <div className="text-[#00d4ff]/60 text-[9px] tracking-[0.2em] uppercase">
            Health Platform
          </div>
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div
        className="mb-7"
        animate={{ opacity: toggled ? 0 : 1, x: toggled ? -50 : 0 }}
        transition={d(2.1, 0.05)}
      >
        <h2 className="text-[30px] font-black text-white tracking-tight leading-none mb-2">
          Welcome back
        </h2>
        <p className="text-white/45 text-sm">
          Sign in to continue your health journey
        </p>
      </motion.div>

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email */}
        <motion.div
          animate={{ opacity: toggled ? 0 : 1, x: toggled ? -50 : 0 }}
          transition={d(2.2, 0.1)}
        >
          <label className={labelCls}>Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
              required
            />
            <Mail
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#00d4ff] pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div
          animate={{ opacity: toggled ? 0 : 1, x: toggled ? -50 : 0 }}
          transition={d(2.3, 0.15)}
        >
          <div className="flex justify-between items-center mb-1.5">
            <label className={labelCls} style={{ marginBottom: 0 }}>
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-[#00d4ff] text-xs hover:underline font-medium"
            >
              Forgot?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#00d4ff] hover:text-white transition cursor-pointer"
            >
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          animate={{ opacity: toggled ? 0 : 1, x: toggled ? -50 : 0 }}
          transition={d(2.4, 0.2)}
        >
          <PrimaryBtn type="submit" loading={loading}>
            {!loading && (
              <>
                <span>Sign In</span>
                <ArrowRight size={14} />
              </>
            )}
          </PrimaryBtn>
        </motion.div>

        {/* Switch link */}
        <motion.p
          className="text-center text-sm text-white/40"
          animate={{ opacity: toggled ? 0 : 1, x: toggled ? -50 : 0 }}
          transition={d(2.5, 0.25)}
        >
          No account?{" "}
          <button
            type="button"
            onClick={onToggle}
            className="text-[#00d4ff] font-bold hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </motion.p>
      </form>
    </div>
  );
}

/* ---------------------------------------------
   SIGN UP PANEL
--------------------------------------------- */
function SignUpPanel({ toggled, onToggle }) {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup/send-code", { email });
      toast.success("Verification code sent!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup/verify-code", { email, code });
      toast.success("Email verified!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Minimum 6 characters");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup/complete", {
        email, name, password, confirmPassword, role,
      });
      setAuth(data.token, data.user);
      toast.success("Account created!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Appear delays: 1.7–2.1s; disappear: 0–0.4s
  const d = (appear, disappear) => ({
    duration: 0.4,
    delay: toggled ? appear : disappear,
  });

  const stepTitles = ["Create Account", "Verify Email", "Complete Profile"];
  const stepSubs = [
    "Start your personalized health journey",
    `Code sent to ${email}`,
    "Almost there — fill in your details",
  ];

  return (
    <div
      className="absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-12 overflow-y-auto max-md:relative max-md:w-full max-md:px-8 max-md:py-12"
      style={{ zIndex: 2, scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Brand */}
      <motion.div
        className="flex items-center gap-2.5 mb-5"
        animate={{ opacity: toggled ? 1 : 0, x: toggled ? 0 : 50 }}
        transition={d(1.7, 0)}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#00d4ff,#0077aa)" }}
        >
          <Zap size={17} className="text-white" fill="white" />
        </div>
        <div>
          <div className="text-white font-black text-sm tracking-wider leading-none">
            NutriAI
          </div>
          <div className="text-[#00d4ff]/60 text-[9px] tracking-[0.2em] uppercase">
            Health Platform
          </div>
        </div>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        animate={{ opacity: toggled ? 1 : 0, x: toggled ? 0 : 50 }}
        transition={d(1.75, 0.03)}
      >
        <StepIndicator step={step} />
      </motion.div>

      {/* Heading */}
      <motion.div
        className="mb-5"
        animate={{ opacity: toggled ? 1 : 0, x: toggled ? 0 : 50 }}
        transition={d(1.8, 0.06)}
      >
        <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-1">
          {stepTitles[step - 1]}
        </h2>
        <p className="text-white/45 text-sm">{stepSubs[step - 1]}</p>
      </motion.div>

      {/* Step forms */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSendCode}
            className="space-y-4"
          >
            <motion.div
              animate={{ opacity: toggled ? 1 : 0, x: toggled ? 0 : 50 }}
              transition={d(1.9, 0.09)}
            >
              <label className={labelCls}>Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                  required
                />
                <Mail
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#00d4ff] pointer-events-none"
                />
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: toggled ? 1 : 0, x: toggled ? 0 : 50 }}
              transition={d(2.0, 0.12)}
            >
              <PrimaryBtn type="submit" loading={loading}>
                {!loading && (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </PrimaryBtn>
            </motion.div>

            <motion.p
              className="text-center text-sm text-white/40"
              animate={{ opacity: toggled ? 1 : 0, x: toggled ? 0 : 50 }}
              transition={d(2.1, 0.15)}
            >
              Have an account?{" "}
              <button
                type="button"
                onClick={onToggle}
                className="text-[#00d4ff] font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </motion.p>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleVerifyCode}
            className="space-y-4"
          >
            <div>
              <label className={labelCls}>6-Digit Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="0  0  0  0  0  0"
                maxLength={6}
                className="w-full bg-[#0d1a2a] border border-white/20 rounded-none outline-none text-white font-bold text-xl tracking-[0.5em] text-center py-3 focus:border-[#00d4ff] transition-all duration-300"
                required
              />
            </div>

            <div className="flex gap-3">
              <GhostBtn type="button" onClick={() => setStep(1)}>
                Back
              </GhostBtn>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 rounded-none text-sm font-bold cursor-pointer disabled:opacity-40 text-[#060b14] transition-all duration-300 hover:brightness-110"
                style={{ background: "#00d4ff" }}
              >
                {loading ? "…" : "Verify Code"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSendCode}
              className="w-full text-[#00d4ff]/50 text-xs hover:text-[#00d4ff] transition cursor-pointer"
            >
              Resend Code
            </button>
          </motion.form>
        )}

        {step === 3 && (
          <motion.form
            key="step3"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleCompleteSignup}
            className="space-y-3"
          >
            {/* Name */}
            <div>
              <label className={labelCls}>Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={inputCls}
                  required
                />
                <User
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#00d4ff] pointer-events-none"
                />
              </div>
            </div>

            {/* Account type */}
            <div>
              <label className={labelCls}>Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#0d1a2a] border border-white/20 rounded-none outline-none text-white text-sm px-4 py-3 focus:border-[#00d4ff] transition-all duration-300 cursor-pointer [&>option]:bg-[#080f1c]"
              >
                <option value="user">Regular User</option>
                <option value="nutritionist">Nutritionist</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className={inputCls}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#00d4ff] hover:text-white transition cursor-pointer"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Confirm password */}
            <div>
              <label className={labelCls}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showCPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={inputCls}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#00d4ff] hover:text-white transition cursor-pointer"
                >
                  {showCPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {confirmPassword && (
                <p
                  className={`text-xs mt-1.5 ${
                    password === confirmPassword
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {password === confirmPassword
                    ? "? Passwords match"
                    : "? Passwords do not match"}
                </p>
              )}
            </div>

            <PrimaryBtn type="submit" loading={loading}>
              {!loading && (
                <>
                  <span>Complete Signup</span>
                  <ArrowRight size={14} />
                </>
              )}
            </PrimaryBtn>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------
   ROOT PAGE
--------------------------------------------- */
export default function AuthPage() {
  const [toggled, setToggled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openSignup) setToggled(true);
  }, [location.state]);

  return (
    <>
      {/* Poppins font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Poppins', sans-serif; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 relative"
        style={{ background: "#060b14", zIndex: 1 }}
      >
        <AnimatedBG />

        {/* Card entrance */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[900px] overflow-hidden max-md:flex max-md:flex-col"
          style={{
            height: 580,
            background: "#080f1c",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: 0,
            zIndex: 2,
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.5) 50%, transparent 100%)",
            }}
          />

          {/* Vertical divider */}
          <div
            className="absolute top-8 bottom-8 left-1/2 w-px -translate-x-1/2 max-md:hidden"
            style={{ background: "rgba(0,212,255,0.1)", zIndex: 4 }}
          />

          {/* -- Sliding teal background shape -- */}
          <div
            className="absolute top-0 h-full w-1/2 pointer-events-none max-md:hidden"
            style={{
              background:
                "linear-gradient(150deg, #0a2a3a 0%, #0d3d52 40%, #0a4a5e 70%, #062a38 100%)",
              borderLeft: toggled
                ? "none"
                : "1px solid rgba(0,212,255,0.25)",
              borderRight: toggled
                ? "1px solid rgba(0,212,255,0.25)"
                : "none",
              left: toggled ? 0 : "50%",
              transform: toggled
                ? "rotate(0deg) skewY(0deg)"
                : "rotate(10deg) skewY(40deg)",
              transformOrigin: toggled ? "bottom left" : "bottom right",
              transition:
                "transform 1.5s cubic-bezier(0.76,0,0.24,1), left 1.5s cubic-bezier(0.76,0,0.24,1)",
              transitionDelay: toggled ? "0.5s" : "1.6s",
              zIndex: 1,
            }}
          />

          {/* Horizontal scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,212,255,0.18), transparent)",
              zIndex: 0,
            }}
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* -- Panels -- */}
          <SignInPanel toggled={toggled} onToggle={() => setToggled(true)} />
          <SignUpPanel toggled={toggled} onToggle={() => setToggled(false)} />

          {/* -- Welcome overlays -- */}
          <WelcomeHelloFriend visible={!toggled} />
          <WelcomeBack visible={toggled} />
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-5 text-center text-[10px] tracking-[0.25em] uppercase text-white/20"
        >
          NutriAI &copy; {new Date().getFullYear()} —{" "}
          <a
            href="#"
            className="text-[#00d4ff]/40 hover:text-[#00d4ff]/70 transition"
          >
            Privacy Policy
          </a>
        </motion.p>
      </div>
    </>
  );
}
