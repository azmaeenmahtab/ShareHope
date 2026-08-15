import Overlay from "../Overlay";
import { CheckIcon, AlertIcon, CloseIcon, FlagIcon } from "../Icons";

export default function DetailsModal({ data, open, onClose, onReport, onProceed }) {
  if (!data) return null;

  return (
    <Overlay open={open} onClose={onClose}>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <span className="mb-0.5 block text-xs font-bold uppercase tracking-wider text-[#3D8D7A]">
            ID {data.id}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">{data.name}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <img src={data.image} alt="" className="h-[180px] sm:h-[200px] w-full rounded-2xl object-cover shadow-sm" />

        <div className="flex flex-wrap gap-2">
          {data.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
              <CheckIcon /> Verified
            </span>
          )}
          {data.urgent && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-600">
              <AlertIcon /> Urgent
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {data.type}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{data.desc}</p>

        <div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#3D8D7A]"
              style={{ width: `${data.percent}%` }}
            />
          </div>
          <div className="mt-2 flex items-baseline justify-between text-xs sm:text-sm">
            <span className="font-mono font-bold text-[#3D8D7A]">{data.raised}</span>
            <span className="text-slate-500">
              of <span className="font-mono font-medium text-slate-700">{data.goal}</span> goal
            </span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
          <div>
            <dt className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Area</dt>
            <dd className="text-xs sm:text-sm font-semibold text-slate-800">{data.area}</dd>
          </div>
          <div>
            <dt className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Category</dt>
            <dd className="text-xs sm:text-sm font-semibold text-slate-800">{data.category}</dd>
          </div>
          <div>
            <dt className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Submitted</dt>
            <dd className="text-xs sm:text-sm font-semibold text-slate-800">{data.submitted}</dd>
          </div>
          <div>
            <dt className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Payment methods</dt>
            <dd className="text-xs sm:text-sm font-semibold text-slate-800">{data.methods}</dd>
          </div>
        </dl>

        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Verification documents
          </span>
          <div className="flex flex-wrap gap-2">
            {data.docs.map((doc) => (
              <span
                key={doc}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 border-t border-slate-100 px-6 py-4 bg-slate-50/50">
        <button
          type="button"
          onClick={onReport}
          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-all"
        >
          <FlagIcon /> Report
        </button>
        <button
          type="button"
          onClick={() => onProceed("zakat")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#3D8D7A] hover:border-[#3D8D7A] hover:bg-emerald-50/50 transition-all shadow-sm"
        >
          Proceed for Zakat
        </button>
        <button
          type="button"
          onClick={() => onProceed("donation")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#3D8D7A] hover:bg-[#2b6658] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md active:scale-95 transition-all"
        >
          Proceed for Donation
        </button>
      </div>
    </Overlay>
  );
}
