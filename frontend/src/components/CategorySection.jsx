import DonationCard from "./DonationCard";

export default function CategorySection({
  section,
  cases,
  visible,
  page,
  pageSize = 6,
  layout = "grid",
  onPageChange,
  onOpenDetails,
  onProceed,
}) {
  if (!visible) return null;

  const totalPages = Math.ceil(cases.length / pageSize);
  const pageCases = cases.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="mt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-200/80 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{section.title}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{section.hint}</p>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Showing {pageCases.length} of {cases.length} requests
        </span>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-12 rounded-3xl bg-white border border-slate-200/80 p-8">
          <p className="text-sm font-medium text-slate-500">No requests found in this section.</p>
        </div>
      ) : (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {pageCases.map((data) => (
            <DonationCard
              key={data.id || data._id}
              data={data}
              layout={layout}
              onOpenDetails={onOpenDetails}
              onProceed={onProceed}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label={`${section.title} pages`}>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              aria-current={page === pageNumber ? "page" : undefined}
              onClick={() => onPageChange(pageNumber)}
              className={`h-9 min-w-9 rounded-xl border px-3 text-xs font-bold transition-all shadow-sm ${
                page === pageNumber
                  ? "border-[#3D8D7A] bg-[#3D8D7A] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#3D8D7A] hover:text-[#3D8D7A]"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </nav>
      )}
    </section>
  );
}


