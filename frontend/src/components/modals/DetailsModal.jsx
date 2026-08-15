import Overlay from "../Overlay";
import { CheckIcon, AlertIcon, CloseIcon, FlagIcon } from "../Icons";

export default function DetailsModal({ data, open, onClose, onReport, onProceed }) {
  if (!data) return null;

  return (
    <Overlay open={open} onClose={onClose}>
      <div className="sticky top-0 z-[2] flex items-center justify-between gap-3 border-b border-[var(--border-soft)] bg-[var(--bg-raised)] px-[22px] py-[18px]">
        <div>
          <span className="mb-0.5 block text-[11.5px] font-bold uppercase tracking-[.08em] text-[var(--accent)]">
            ID {data.id}
          </span>
          <h3 className="text-lg font-display font-semibold text-[var(--text-strong)]">{data.name}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-sunken)] text-[var(--text-soft)] hover:border-[var(--danger-600)] hover:text-[var(--danger-600)]"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="p-[22px]">
        <img src={data.image} alt="" className="mb-3.5 h-[180px] w-full rounded-2xl object-cover" />

        <div className="mb-3 flex gap-2">
          {data.verified && (
            <span className="inline-flex items-center gap-[5px] rounded-full bg-[rgba(28,138,99,.12)] px-2.5 py-[5px] text-[11px] font-bold text-[var(--ok-600)]">
              <CheckIcon /> Verified
            </span>
          )}
          {data.urgent && (
            <span className="inline-flex items-center gap-[5px] rounded-full bg-[rgba(194,59,59,.12)] px-2.5 py-[5px] text-[11px] font-bold text-[var(--danger-600)]">
              <AlertIcon /> Urgent
            </span>
          )}
          <span className="inline-flex items-center gap-[5px] rounded-full bg-[var(--border-soft)] px-2.5 py-[5px] text-[11px] font-bold text-[var(--text-soft)]">
            {data.type}
          </span>
        </div>

        <p className="text-sm text-[var(--text)]">{data.desc}</p>

        <div className="relative mt-4 h-[10px] overflow-hidden rounded-full border border-[var(--border-soft)] bg-[var(--bg-sunken)]">
          <div
            className="h-full rounded-full bg-[repeating-linear-gradient(90deg,var(--leaf-500)_0_6px,var(--leaf-600)_6px_12px)] bg-[length:200%_100%]"
            style={{ width: `${data.percent}%` }}
          />
        </div>
        <div className="mt-2 flex items-baseline justify-between text-[12.5px]">
          <span className="font-mono font-bold tracking-[-.02em] text-[var(--accent-strong)]">{data.raised}</span>
          <span className="text-[var(--text-soft)]">
            of <span className="font-mono tracking-[-.02em]">{data.goal}</span> goal
          </span>
        </div>

        <dl className="my-5 grid grid-cols-2 gap-x-[18px] gap-y-3.5 rounded-[14px] bg-[var(--bg-sunken)] p-4">
          <div>
            <dt className="mb-[3px] text-[11px] font-bold uppercase tracking-[.05em] text-[var(--text-soft)]">Area</dt>
            <dd className="text-[13.5px] font-semibold text-[var(--text-strong)]">{data.area}</dd>
          </div>
          <div>
            <dt className="mb-[3px] text-[11px] font-bold uppercase tracking-[.05em] text-[var(--text-soft)]">Category</dt>
            <dd className="text-[13.5px] font-semibold text-[var(--text-strong)]">{data.category}</dd>
          </div>
          <div>
            <dt className="mb-[3px] text-[11px] font-bold uppercase tracking-[.05em] text-[var(--text-soft)]">Submitted</dt>
            <dd className="text-[13.5px] font-semibold text-[var(--text-strong)]">{data.submitted}</dd>
          </div>
          <div>
            <dt className="mb-[3px] text-[11px] font-bold uppercase tracking-[.05em] text-[var(--text-soft)]">Payment methods</dt>
            <dd className="text-[13.5px] font-semibold text-[var(--text-strong)]">{data.methods}</dd>
          </div>
        </dl>

        <div>
          <span className="mb-2.5 block text-[12.5px] font-bold uppercase tracking-[.04em] text-[var(--text-soft)]">
            Verification documents
          </span>
          <div className="flex flex-wrap gap-2">
            {data.docs.map((doc) => (
              <span
                key={doc}
                className="rounded-full border border-[var(--border-soft)] bg-[var(--bg-sunken)] px-3 py-[7px] text-[12.5px]"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 px-[22px] pb-[22px] pt-4">
        <button
          type="button"
          onClick={onReport}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-[11px] text-sm font-semibold text-[var(--text-soft)] hover:bg-[var(--bg-sunken)] hover:text-[var(--accent-strong)]"
        >
          <FlagIcon /> Report
        </button>
        <button
          type="button"
          onClick={() => onProceed("zakat")}
          className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--bg-sunken)] px-5 py-[11px] text-sm font-semibold text-[var(--accent-strong)] hover:border-[var(--accent)] hover:bg-[var(--bg-raised)]"
        >
          Proceed for Zakat
        </button>
        <button
          type="button"
          onClick={() => onProceed("donation")}
          className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-[var(--leaf-600)] to-[var(--trunk-800)] px-5 py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(23,90,146,.6)] active:scale-[.97]"
        >
          Proceed for Donation
        </button>
      </div>
    </Overlay>
  );
}
