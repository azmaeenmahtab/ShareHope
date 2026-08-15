export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-3 px-6 py-6 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <span className="font-bold text-slate-800">ShareHope</span>
          <span className="ml-2 text-slate-500">Helping communities find trusted support.</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium">
          <a href="/" className="hover:text-[#3D8D7A] transition-colors">Home</a>
          <a href="/about" className="hover:text-[#3D8D7A] transition-colors">About</a>
          <a href="/user/dashboard" className="hover:text-[#3D8D7A] transition-colors">Dashboard</a>
        </div>
      </div>
    </footer>
  );
}
