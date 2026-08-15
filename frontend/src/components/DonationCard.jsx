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
      className={`flex cursor-pointer gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#3D8D7A]/40 hover:shadow-md focus-visible:-translate-y-0.5
        max-[560px]:flex-col
        ${data.urgent ? "border-l-4 border-l-red-500" : ""}`}
    >
      <img
        src={data.image}
        alt=""
        className="h-[104px] w-[104px] flex-shrink-0 rounded-xl bg-slate-100 object-cover max-[560px]:h-[150px] max-[560px]:w-full"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2.5">
          <h3 className="mb-1 text-base sm:text-lg font-bold text-slate-900">{data.name}</h3>
          {data.urgent ? (
            <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-semibold text-red-600">
              <AlertIcon /> Urgent
            </span>
          ) : data.verified ? (
            <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <CheckIcon /> Verified
            </span>
          ) : null}
        </div>

        <p className="mb-3 line-clamp-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{data.desc}</p>

        <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#3D8D7A] transition-all duration-500"
            style={{ width: `${data.percent}%` }}
          />
        </div>
        <div className="mt-2 flex items-baseline justify-between text-xs sm:text-sm">
          <span className="font-mono font-bold text-[#3D8D7A]">{data.raised}</span>
          <span className="text-slate-500">
            of <span className="font-mono font-medium">{data.goal}</span> goal
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {data.type} · ID {data.id}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(data);
            }}
            className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full border border-[#3D8D7A] bg-transparent px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#3D8D7A] transition-all hover:bg-[#3D8D7A] hover:text-white active:scale-95"
          >
            See details
          </button>
        </div>
      </div>
    </article>
  );
}
