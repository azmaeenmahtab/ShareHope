import { useState } from "react";
import { Bell, ChevronDown, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";

// ---------------------------------------------------------------------------
// USAGE
// <Navbar isLoggedIn={false} />
// <Navbar isLoggedIn={true} user={{ name: "Azmaeen Rahman", avatarUrl: "/uploads/avatar.jpg" }} />
//
// Swap `onLogout` for your real logout call (clear token, hit
// /api/v1/auth/logout, then redirect). Swap the <a href> tags for your
// router's <Link>/useNavigate once routing is wired up.
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Requests", href: "/requests" },
  { label: "Zakat Calculator", href: "/zakat-calculator" },
  { label: "About", href: "/about" },
];

export default function Navbar({
  isLoggedIn = false,
  user = { name: "Guest User", avatarUrl: "" },
  notificationCount = 0,
  onLogout = () => console.log("TODO: hook up logout"),
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{ backgroundColor: "#FBFFE4", borderColor: "#e2e8f0" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: "#3D8D7A" }}
            >
              <Image
                src="https://placehold.co/40x40/3D8D7A/FBFFE4?text=SH"
                alt="ShareHope logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-800">
              ShareHope
            </span>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                style={{ ["--hover-bg"]: "#B3D8A8" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B3D8A8")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-4.5 h-4.5 text-slate-600" />
                  {notificationCount > 0 && (
                    <span
                      className="absolute top-1 right-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#3D8D7A" }}
                    />
                  )}
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-slate-200">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-xs font-semibold text-white"
                          style={{ backgroundColor: "#3D8D7A" }}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-[110px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 z-20">
                        <a
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          My Profile
                        </a>
                        <a
                          href="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          Dashboard
                        </a>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={onLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Log in
                </a>
                <a
                  href="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition"
                  style={{ backgroundColor: "#3D8D7A" }}
                >
                  Sign up
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-700"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 px-5 py-4 space-y-1 bg-white">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 mt-2 border-t border-slate-100">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-slate-200">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-xs font-semibold text-white"
                      style={{ backgroundColor: "#3D8D7A" }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="text-xs font-medium text-red-600"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 px-3">
                <a
                  href="/login"
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium text-slate-700 border border-slate-200"
                >
                  Log in
                </a>
                <a
                  href="/signup"
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: "#3D8D7A" }}
                >
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// Simple <img> wrapper kept as its own component so it's a single obvious
// place to swap in next/image or another image component later if needed.
function Image({ src, alt, className }) {
  return <img src={src} alt={alt} className={className} />;
}