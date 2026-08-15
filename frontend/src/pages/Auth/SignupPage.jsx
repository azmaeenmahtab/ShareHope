 
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  HandHeart,
  ArrowRight,
  HeartHandshake,
  UserRound,
  Building2,
  Check,
} from "lucide-react";

// ---------------------------------------------------------------------------
// BOILERPLATE API CALL — replace the inside of this function with your real
// request once the backend auth route is ready. Keep the function signature
// the same so you don't have to touch the component below.
// ---------------------------------------------------------------------------
async function registerUser(payload) {
  const res = await fetch("/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Signup failed. Please try again.");
  }

  return data; // expected: { data: { user, accessToken } }
}

// Replace with your real Google OAuth flow.
function signupWithGoogle() {
  window.location.href = "/api/v1/auth/google";
}

const ROLES = [
  { key: "donor", label: "Donor", icon: HeartHandshake, desc: "I want to give" },
  { key: "receiver_individual", label: "Individual", icon: UserRound, desc: "I need support" },
  { key: "receiver_organization", label: "Organization", icon: Building2, desc: "We need support" },
];

export default function Signup() {
  const [role, setRole] = useState("donor");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isMuslim: false,
    organizationName: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.agreeToTerms) {
      setError("Please agree to the terms to continue.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: role === "donor" ? "donor" : "receiver",
        ...(role === "donor" && { isMuslim: form.isMuslim }),
        ...(role !== "donor" && {
          accountType: role === "receiver_organization" ? "organization" : "individual",
          organizationName: role === "receiver_organization" ? form.organizationName : undefined,
        }),
      };

      const result = await registerUser(payload);
      // TODO: store result.data.accessToken and redirect
      // e.g. navigate("/dashboard")
      console.log("Signup success:", result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex" style={{ backgroundColor: "#FBFFE4" }}>
      {/* Left brand panel */}
      <div
        className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 overflow-hidden"
        style={{ backgroundColor: "#3D8D7A" }}
      >
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20"
          style={{ backgroundColor: "#A3D1C6" }}
        />
        <div
          className="absolute -bottom-28 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{ backgroundColor: "#B3D8A8" }}
        />

        <div className="relative z-10 flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#FBFFE4" }}
          >
            <HandHeart className="w-5 h-5" style={{ color: "#3D8D7A" }} />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">ShareHope</span>
        </div>

        <div className="relative z-10 max-w-sm">
          <h1 className="text-4xl font-semibold text-white leading-tight mb-4">
            Join a platform built on verification, not guesswork.
          </h1>
          <ul className="space-y-3 mt-6">
            {[
              "Automatic Zakat calculation",
              "Verified donation requests only",
              "Transparent tracking, every taka",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-white/90 text-sm">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#B3D8A8" }}
                >
                  <Check className="w-3 h-3" style={{ color: "#3D8D7A" }} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-white/60 text-xs">
          Free to join. No hidden platform fees on donations.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#3D8D7A" }}
            >
              <HandHeart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold" style={{ color: "#3D8D7A" }}>
              ShareHope
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-slate-800 mb-1">Create your account</h2>
          <p className="text-slate-500 text-sm mb-6">Choose how you'll use ShareHope.</p>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map(({ key, label, icon: Icon, desc }) => {
              const active = role === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition"
                  style={{
                    borderColor: active ? "#3D8D7A" : "#e2e8f0",
                    backgroundColor: active ? "#3D8D7A" : "white",
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: active ? "white" : "#3D8D7A" }} />
                  <span
                    className="text-xs font-semibold leading-tight"
                    style={{ color: active ? "white" : "#1e293b" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[10px] leading-tight"
                    style={{ color: active ? "rgba(255,255,255,0.75)" : "#94a3b8" }}
                  >
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {role === "receiver_organization" ? "Contact person name" : "Full name"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition"
                  style={{ "--tw-ring-color": "#A3D1C6" }}
                />
              </div>
            </div>

            {role === "receiver_organization" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Organization name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="organizationName"
                    required
                    value={form.organizationName}
                    onChange={handleChange}
                    placeholder="e.g. Hope Foundation"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition"
                    style={{ "--tw-ring-color": "#A3D1C6" }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition"
                    style={{ "--tw-ring-color": "#A3D1C6" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition"
                    style={{ "--tw-ring-color": "#A3D1C6" }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition"
                  style={{ "--tw-ring-color": "#A3D1C6" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {role === "donor" && (
              <label className="flex items-center gap-2.5 py-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isMuslim"
                  checked={form.isMuslim}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "#3D8D7A" }}
                />
                <span className="text-sm text-slate-600">
                  I'm Muslim — enable automatic Zakat calculator
                </span>
              </label>
            )}

            <label className="flex items-start gap-2.5 py-1 cursor-pointer select-none">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={form.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded mt-0.5"
                style={{ accentColor: "#3D8D7A" }}
              />
              <span className="text-sm text-slate-600">
                I agree to ShareHope's{" "}
                <a href="#" className="font-medium hover:underline" style={{ color: "#3D8D7A" }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium hover:underline" style={{ color: "#3D8D7A" }}>
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
              style={{ backgroundColor: "#3D8D7A" }}
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={signupWithGoogle}
            className="w-full py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 transition"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{" "}
            <a href="/login" className="font-semibold hover:underline" style={{ color: "#3D8D7A" }}>
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.96 11.96 0 000 12c0 1.93.46 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}