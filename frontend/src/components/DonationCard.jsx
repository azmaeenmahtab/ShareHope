import { Check, AlertTriangle, MapPin, Heart, ArrowRight } from "lucide-react";

export default function DonationCard({ data, layout = "grid", onOpenDetails, onProceed }) {
  const percent = Math.min(100, Math.max(0, Number(data.percent || 0)));
  const raisedText = typeof data.raised === "number" ? `৳ ${data.raised.toLocaleString("en-IN")} raised` : (data.raised || "৳ 0 raised");
  const goalText = typeof data.goal === "number" ? `৳ ${data.goal.toLocaleString("en-IN")}` : (data.goal || "—");
  const methods = Array.isArray(data.methods)
    ? data.methods
    : (typeof data.methods === "string" ? data.methods.split(",").map(m => m.trim()).filter(Boolean) : []);

  if (layout === "list") {
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
        className={`group flex flex-col sm:flex-row gap-5 rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-[#3D8D7A]/40 transition-all duration-300 cursor-pointer ${
          data.urgent ? "border-l-4 border-l-red-500" : ""
        }`}
      >
        <div className="relative h-48 sm:h-44 sm:w-60 w-full flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100">
          <img
            src={data.image}
            alt={data.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {data.category && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 backdrop-blur-md shadow-sm">
              {data.category}
            </span>
          )}
          {data.urgent ? (
            <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-500 text-white shadow-md">
              <AlertTriangle className="w-3 h-3" /> Urgent
            </span>
          ) : data.verified ? (
            <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
              <Check className="w-3 h-3" /> Verified
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px]">
                {data.id}
              </span>
              <span>·</span>
              <span>{data.type}</span>
              {data.area && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 truncate text-slate-600">
                    <MapPin className="w-3 h-3 text-[#3D8D7A]" /> {data.area}
                  </span>
                </>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#3D8D7A] transition-colors line-clamp-1">
              {data.name}
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {data.desc}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="relative h-2 w-full overflow-hidden rounded-full border border-slate-200/80 bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#3D8D7A] transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="mt-2 flex items-baseline justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#3D8D7A]">{raisedText}</span>
                <span className="text-slate-400 text-xs">of <span className="font-mono text-slate-700 font-semibold">{goalText}</span></span>
              </div>
              <span className="text-xs font-bold text-[#2b6658] bg-emerald-50 px-2 py-0.5 rounded-full">
                {percent}%
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {methods.slice(0, 3).map((m) => (
                  <span key={m} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                    {m}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(data);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Details
                </button>
                {onProceed && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProceed(data, "donation");
                    }}
                    className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold rounded-full bg-[#3D8D7A] hover:bg-[#2b6658] text-white shadow-sm transition active:scale-95"
                  >
                    <Heart className="w-3 h-3 fill-white" /> Donate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Modern Grid View (Default)
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
      className={`group relative flex flex-col rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:border-[#3D8D7A]/40 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden cursor-pointer ${
        data.urgent ? "ring-2 ring-red-500/20" : ""
      }`}
    >
      {/* Cover image container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={data.image}
          alt={data.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

        {/* Category Pill */}
        {data.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 backdrop-blur-md shadow-sm border border-white/40">
            {data.category}
          </span>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {data.urgent ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-red-500 text-white shadow-md animate-pulse">
              <AlertTriangle className="w-3 h-3" /> Urgent
            </span>
          ) : data.verified ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
              <Check className="w-3 h-3" /> Verified
            </span>
          ) : null}
        </div>

        {/* ID tag */}
        <span className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-black/60 text-white backdrop-blur-sm">
          {data.id}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Type */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
            <span className="text-slate-600 font-semibold">{data.type}</span>
            {data.area && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-600 truncate">
                  <MapPin className="w-3 h-3 text-[#3D8D7A]" /> {data.area}
                </span>
              </>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#3D8D7A] transition-colors line-clamp-1">
            {data.name}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {data.desc}
          </p>
        </div>

        {/* Progress Bar & Stats */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-slate-200/80 bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#3D8D7A] transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-baseline justify-between text-xs sm:text-sm">
            <div>
              <span className="font-mono font-bold text-[#3D8D7A] text-sm sm:text-base">{raisedText}</span>
              <p className="text-[11px] text-slate-400">
                of <span className="font-semibold text-slate-700">{goalText}</span> goal
              </p>
            </div>
            <span className="text-xs font-bold text-[#2b6658] bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              {percent}%
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-3 flex items-center gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(data);
              }}
              className="flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition text-center"
            >
              Details
            </button>
            {onProceed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onProceed(data, "donation");
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl bg-[#3D8D7A] hover:bg-[#2b6658] text-white shadow-md shadow-[#3D8D7A]/20 active:scale-95 transition"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Donate</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

