import DonationCard from "./DonationCard";

const PAGE_SIZE = 5;

export default function CategorySection({ section, cases, visible, page, onPageChange, onOpenDetails }) {
  if (!visible) return null;

  const totalPages = Math.ceil(cases.length / PAGE_SIZE);
  const pageCases = cases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-200 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{section.title}</h2>
        <span className="text-xs sm:text-sm font-medium text-slate-500">{section.hint}</span>
      </div>

      <div className="flex flex-col gap-4">
        {pageCases.map((data) => (
          <DonationCard key={data.id} data={data} onOpenDetails={onOpenDetails} />
        ))}
      </div>

      <nav className="mt-5 flex items-center justify-center gap-1.5" aria-label={`${section.title} pages`}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-current={page === pageNumber ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={`h-5 min-w-5 rounded-lg border px-2.5 text-sm font-semibold transition-colors ${
              page === pageNumber
                ? "border-[#3D8D7A] bg-[#3D8D7A] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#3D8D7A] hover:text-[#3D8D7A]"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </nav>
    </section>
  );
}

