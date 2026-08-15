import { CheckIcon, AlertIcon } from "./Icons";

export default function DonationCard({ data, onOpenDetails }) {
  return (
    <article
      tabIndex={0}
      onClick={() => onOpenDetails(data)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetails(data);
        }
      }}
      className={`flex cursor-pointer gap-4 rounded-[22px] border border-[var(--border-soft)] bg-[var(--bg-raised)] p-3.5 shadow-[var(--shadow)] transition-all hover:-translate-y-0.5 hover:border-[var(--leaf-300)] hover:shadow-[0_16px_40px_-16px_rgba(10,37,64,.28)] focus-visible:-translate-y-0.5
        max-[560px]:flex-col
        ${data.urgent ? "border-l-[3px] border-l-[var(--danger-600)]" : ""}`}
    >
      <img
        src={data.image}
        alt=""
        className="h-[104px] w-[104px] flex-shrink-0 rounded-2xl bg-[var(--bg-sunken)] object-cover max-[560px]:h-[150px] max-[560px]:w-full"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2.5">
          <h3 className="mb-1.5 font-display text-base font-semibold text-[var(--text-strong)]">{data.name}</h3>
          {data.urgent ? (
            <span className="inline-flex flex-shrink-0 items-center gap-[5px] rounded-full bg-[rgba(194,59,59,.12)] px-2.5 py-[5px] text-[11px] font-bold tracking-[.02em] text-[var(--danger-600)]">
              <AlertIcon /> Urgent
            </span>
          ) : data.verified ? (
            <span className="inline-flex flex-shrink-0 items-center gap-[5px] rounded-full bg-[rgba(28,138,99,.12)] px-2.5 py-[5px] text-[11px] font-bold tracking-[.02em] text-[var(--ok-600)]">
              <CheckIcon /> Verified
            </span>
          ) : null}
        </div>

        <p className="mb-3 line-clamp-2 text-[13.5px] text-[var(--text-soft)]">{data.desc}</p>

        <div className="relative h-[10px] overflow-hidden rounded-full border border-[var(--border-soft)] bg-[var(--bg-sunken)]">
          <div
            className="h-full rounded-full bg-[repeating-linear-gradient(90deg,var(--leaf-500)_0_6px,var(--leaf-600)_6px_12px)] bg-[length:200%_100%] transition-[width] duration-500"
            style={{ width: `${data.percent}%` }}
          />
        </div>
        <div className="mt-2 flex items-baseline justify-between text-[12.5px]">
          <span className="font-mono font-bold tracking-[-.02em] text-[var(--accent-strong)]">{data.raised}</span>
          <span className="text-[var(--text-soft)]">
            of <span className="font-mono tracking-[-.02em]">{data.goal}</span> goal
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
          <span className="inline-flex items-center gap-[5px] rounded-full bg-[var(--border-soft)] px-2.5 py-[5px] text-[11px] font-bold tracking-[.02em] text-[var(--text-soft)]">
            {data.type} · ID {data.id}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(data);
            }}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-[var(--accent)] bg-transparent px-3.5 py-2 text-[13px] font-semibold text-[var(--accent-strong)] transition-colors hover:bg-[var(--bg-sunken)] active:scale-[.97]"
          >
            See details
          </button>
        </div>
      </div>
    </article>
  );
}
