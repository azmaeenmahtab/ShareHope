/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import { Bell, ChevronDown, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import logoImg from "../../assets/ShareHope.png";
import { AuthContext } from "../../context/authContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Requests", href: "/requests" },
  { label: "Request Donation", href: "/donation-request" },
  { label: "Zakat Calculator", href: "/zakat-calculator" },
];

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
 
 
  const { user, isLoggedIn, setIsLoggedIn, setUser, loading } = useContext(AuthContext);

const apiBase = import.meta.env.VITE_API_BASE_URL;

  

  const handleLogout = async () => {
    try {
      const response = await fetch(apiBase+"/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({
          email: user.email
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      setUser(null);
      setIsLoggedIn(false);
      document.cookie = null
      return <Navigate to="/login" />;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  

  return (
    <header
      className="sticky top-0 z-50 w-full border-b transition-colors bg-[#FAF8F5]/90 backdrop-blur-md border-[#E5EFEA]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden bg-[#0D5C46] shadow-sm transition-transform group-hover:scale-105">
              <img
                src={logoImg}
                alt="ShareHope logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0D5C46]">
              ShareHope
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-[#334E44] hover:text-[#0D5C46] hover:bg-[#EAF4F0] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#EAF4F0] text-[#0D5C46] transition">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0D5C46]" />
              </div>
            ):isLoggedIn ? (
              <>
                <button
                  type="button"
                  className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#EAF4F0] text-[#0D5C46] transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0D5C46]" />
                  )}
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-[#D4E9E2] bg-white hover:bg-[#F2F8F5] transition shadow-2xs"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-[#0D5C46] text-white flex items-center justify-center text-xs font-bold">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0)?.toUpperCase() || "U"
                      )}
                    </div>
                    <span className="text-sm font-medium text-[#1A382E] max-w-[110px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#5C7E72] transition-transform ${
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
                      <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#D4E9E2] bg-white shadow-xl py-2 z-20">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1A382E] hover:bg-[#EAF4F0]"
                        >
                          <User className="w-4 h-4 text-[#0D5C46]" />
                          My Profile
                        </Link>
                        <Link
                          to="/transaction"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1A382E] hover:bg-[#EAF4F0]"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#0D5C46]" />
                          Transactions
                        </Link>
                        <div className="my-1 border-t border-[#EAF4F0]" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#0D5C46] hover:bg-[#EAF4F0]"
                        >
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
              ):(
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[#0D5C46] hover:bg-[#EAF4F0] transition"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#FAF8F5] bg-[#0D5C46] hover:bg-[#094433] transition shadow-sm hover:shadow-md"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#0D5C46] hover:bg-[#EAF4F0]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E5EFEA] px-5 py-4 space-y-1 bg-[#FAF8F5]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#2D473E] hover:bg-[#EAF4F0] hover:text-[#0D5C46]"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 mt-2 border-t border-[#E5EFEA]">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#0D5C46] text-white flex items-center justify-center font-bold text-xs">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A382E] truncate">{user.name}</p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs font-medium text-[#0D5C46]"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 px-1">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium text-[#0D5C46] border border-[#D4E9E2] bg-white"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0D5C46]"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}