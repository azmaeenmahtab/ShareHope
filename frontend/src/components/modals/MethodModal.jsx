import Overlay from "../Overlay";
import { CloseIcon } from "../Icons";
import { WALLET_METHODS, OFFLINE_METHODS } from "../../data/cases";

const ALL_METHODS = { ...WALLET_METHODS, ...OFFLINE_METHODS };
const METHOD_ORDER = ["bkash", "nagad", "rocket", "bank", "cash"];

export default function MethodModal({ open, onClose, purpose, onSelect }) {
  return (
    <Overlay open={open} onClose={onClose}>
      <div className="sticky top-0 z-[2] flex items-center justify-between gap-3 border-b border-[var(--border-soft)] bg-[var(--bg-raised)] px-[22px] py-[18px]">
        <div>
          <span className="mb-0.5 block text-[11.5px] font-bold uppercase tracking-[.08em] text-[var(--accent)]">
            {purpose === "zakat" ? "Zakat" : "Donation"}
          </span>
          <h3 className="text-lg font-display font-semibold text-[var(--text-strong)]">Choose payment method</h3>
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
        <div className="grid grid-cols-2 gap-3">
          {METHOD_ORDER.map((key) => {
            const method = ALL_METHODS[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                className="flex items-center gap-2.5 rounded-2xl border-[1.5px] border-[var(--border)] bg-[var(--bg-sunken)] p-4 text-sm font-bold text-[var(--text-strong)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--bg-raised)]"
              >
                <span
                  className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] text-[13px] font-extrabold text-white"
                  style={{ background: method.dotBg }}
                >
                  {method.dotText}
                </span>
                {method.label}
              </button>
            );
          })}
        </div>
      </div>
    </Overlay>
  );
}
