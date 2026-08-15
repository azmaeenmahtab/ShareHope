export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-raised)] text-[var(--text-soft)]">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-3 px-6 py-6 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <span className="font-semibold text-[var(--text-strong)]">ShareHope</span>
          <span className="ml-2">Helping communities find trusted support.</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a href="/" className="hover:text-[var(--accent-strong)]">Home</a>
          <a href="/about" className="hover:text-[var(--accent-strong)]">About</a>
          <a href="/user/dashboard" className="hover:text-[var(--accent-strong)]">Dashboard</a>
        </div>
      </div>
    </footer>
  );
}
