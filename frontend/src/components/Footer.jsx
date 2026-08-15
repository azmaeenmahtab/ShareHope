const FOOTER_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/profile", label: "Profile" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border-soft)] bg-[var(--bg-sunken)]">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-[18px] px-6 py-9 pb-7">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/assets/ShareHope.png" alt="ShareHope" className="h-[26px] w-[26px] object-contain" />
            <span className="font-display font-bold text-[var(--text-strong)]">ShareHope</span>
          </div>
          <p className="mt-2 max-w-[280px] text-[13px] text-[var(--text-soft)]">
            A transparent home for Zakat and charitable giving — verified requests, tracked to the last amount.
          </p>
        </div>
        <nav className="flex flex-wrap gap-[22px]">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-semibold text-[var(--text-soft)] hover:text-[var(--accent-strong)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-[var(--border-soft)] px-6 py-3.5 text-center text-xs text-[var(--text-soft)]">
        © 2026 ShareHope. UI prototype — no live payments are processed.
      </div>
    </footer>
  );
}
