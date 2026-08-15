import Overlay from "../Overlay";
import { CloseIcon } from "../Icons";
import { WALLET_METHODS, OFFLINE_METHODS } from "../../data/cases";

const ALL_METHODS = { ...WALLET_METHODS, ...OFFLINE_METHODS };
const METHOD_ORDER = ["bkash", "nagad", "rocket", "bank", "cash"];

export default function MethodModal({ open, onClose, purpose, onSelect }) {
  return (
    <Overlay open={open} onClose={onClose}>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <span className="mb-0.5 block text-xs font-bold uppercase tracking-wider text-[#3D8D7A]">
            {purpose === "zakat" ? "Zakat" : "Donation"}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Choose payment method</h3>
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

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {METHOD_ORDER.map((key) => {
            const method = ALL_METHODS[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-800 transition-all hover:-translate-y-0.5 hover:border-[#3D8D7A] hover:bg-emerald-50/40 shadow-sm active:scale-95"
              >
                <span
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-white"
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
