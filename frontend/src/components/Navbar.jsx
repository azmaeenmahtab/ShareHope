import { useState } from "react";
import { BurgerIcon, SunIcon, MoonIcon } from "./Icons";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", active: true },
  { href: "/transactions", label: "Transactions" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[var(--bg-sunken)]">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-[18px] px-6 py-3">
        <div className="flex items-center gap-2.5">
          <a href="/dashboard" className="flex items-center gap-2.5">
            {/* No brand asset wired up yet — alt text carries the name for a11y/SEO */}
            <img src="/assets/ShareHope.png" alt="ShareHope" className="h-[50px] w-[50px] object-contain" />
            <span className="font-display text-[19px] font-bold leading-none text-[var(--text-strong)]">
              Share<span className="text-[var(--accent)]">Hope</span>
            </span>
          </a>
          <button
            type="button"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-sunken)] md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <BurgerIcon />
          </button>
        </div>

        <nav
          className={`fixed left-4 right-4 top-16 z-40 flex flex-col gap-0.5 rounded-full border border-[var(--bg-raised)] bg-[var(--bg-sunken)] p-2 shadow-[var(--shadow-lg)] transition-all duration-200 md:static md:flex md:w-auto md:flex-row md:items-center md:gap-1 md:p-1 md:shadow-none
            ${menuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-2 md:opacity-100 md:pointer-events-auto md:translate-y-0"}`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-full px-4 py-2 text-center text-[13.5px] font-semibold transition-colors md:text-left
                ${link.active
                  ? "bg-[var(--bg-raised)] text-[var(--accent-strong)] shadow-[var(--shadow)]"
                  : "text-[var(--text-soft)] hover:text-[var(--accent-strong)]"}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={onToggleTheme}
            className="relative flex h-[30px] w-[52px] items-center rounded-full border border-[var(--border)] bg-[var(--bg-raised)] p-[3px] transition-colors"
          >
            <span
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-white shadow-[0_2px_6px_rgba(10,37,64,.35)] transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]
                ${isDark ? "translate-x-[22px] bg-gradient-to-br from-[var(--leaf-300)] to-[var(--leaf-600)]" : "translate-x-0 bg-gradient-to-br from-[var(--leaf-500)] to-[var(--trunk-800)]"}`}
            >
              {isDark ? <MoonIcon className="h-[13px] w-[13px]" /> : <SunIcon className="h-[13px] w-[13px]" />}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
