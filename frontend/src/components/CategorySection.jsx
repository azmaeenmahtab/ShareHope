import DonationCard from "./DonationCard";
import { ArrowRightIcon } from "./Icons";

export default function CategorySection({ section, cases, visible, onOpenDetails }) {
  if (!visible) return null;

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-200 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{section.title}</h2>
        <span className="text-xs sm:text-sm font-medium text-slate-500">{section.hint}</span>
      </div>

      <div className="flex flex-col gap-4">
        {cases.map((data) => (
          <DonationCard key={data.id} data={data} onOpenDetails={onOpenDetails} />
        ))}
      </div>

      <div className="mt-5 flex justify-start">
        <a
          href={section.moreHref}
          className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#3D8D7A] shadow-sm transition-all hover:border-[#3D8D7A] hover:bg-emerald-50/50"
        >
          {section.moreLabel}
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
