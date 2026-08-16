 
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, HandHeart, ArrowRight } from "lucide-react";

// ---------------------------------------------------------------------------
// BOILERPLATE API CALL — replace the inside of this function with your real
// request once the backend auth route is ready. Keep the function signature
// the same so you don't have to touch the component below.
// ---------------------------------------------------------------------------
async function loginUser({ email, password }) {
  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // needed for httpOnly refresh-token cookie
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Login failed. Please try again.");
  }

  return data; // expected: { data: { user, accessToken } }
}

// Replace this with your real Google OAuth flow (e.g. redirect to
// /api/v1/auth/google or trigger Firebase/Google Identity Services popup).
function loginWithGoogle() {
  window.location.href = "/api/v1/auth/google";
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginUser(form);
      // TODO: store result.data.accessToken (memory/state) and redirect
      // e.g. navigate("/dashboard")
      console.log("Login success:", result);
      navigate("/requests");
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
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
          style={{ backgroundColor: "#B3D8A8" }}
        />
        <div
          className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full opacity-20"
          style={{ backgroundColor: "#A3D1C6" }}
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
            Every donation deserves to reach someone real.
          </h1>
          <p className="text-white/80 text-base leading-relaxed">
            Verified donation requests, transparent tracking, and automatic
            Zakat calculation — welcome back to a platform built on trust.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          <div>
            <p className="text-2xl font-semibold text-white">7,400+</p>
            <p className="text-white/70 text-sm">Donations delivered</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">1,200+</p>
            <p className="text-white/70 text-sm">Verified receivers</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
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

          <h2 className="text-2xl font-semibold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">
            Log in to continue giving or receiving with confidence.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition"
                  style={{ "--tw-ring-color": "#A3D1C6" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium hover:underline" style={{ color: "#3D8D7A" }}>
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
              style={{ backgroundColor: "#3D8D7A" }}
            >
              {loading ? "Logging in..." : "Log in"}
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
            onClick={loginWithGoogle}
            className="w-full py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-50 transition"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{" "}
            <a href="/signup" className="font-semibold hover:underline" style={{ color: "#3D8D7A" }}>
              Sign up
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