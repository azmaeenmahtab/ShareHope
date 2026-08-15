import DonationCard from "./DonationCard";
import { ArrowRightIcon } from "./Icons";

export default function CategorySection({ section, cases, visible, onOpenDetails }) {
  if (!visible) return null;

  return (
    <section className="mt-[38px]">
      <div className="mb-3.5 flex items-baseline justify-between gap-2.5 border-b border-[var(--border-soft)] pb-2.5">
        <h2 className="font-display text-2xl font-semibold text-[var(--text-strong)]">{section.title}</h2>
        <span className="text-[13px] font-semibold text-[var(--text-soft)]">{section.hint}</span>
      </div>

      <div className="flex flex-col gap-3.5">
        {cases.map((data) => (
          <DonationCard key={data.id} data={data} onOpenDetails={onOpenDetails} />
        ))}
      </div>

      <div className="mt-4 flex justify-start">
        <a
          href={section.moreHref}
          className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--bg-sunken)] px-5 py-[11px] text-sm font-semibold text-[var(--accent-strong)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--bg-raised)]"
        >
          {section.moreLabel}
          <ArrowRightIcon className="transition-transform group-hover:translate-x-[3px]" />
        </a>
      </div>
    </section>
  );
}
