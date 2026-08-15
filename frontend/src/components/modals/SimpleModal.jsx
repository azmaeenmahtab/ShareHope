import { useEffect, useState } from "react";
import Overlay from "../Overlay";
import { CloseIcon } from "../Icons";
import { OFFLINE_METHODS } from "../../data/cases";

export default function SimpleModal({ open, methodKey, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (open) setAmount("");
  }, [open, methodKey]);

  const method = methodKey ? OFFLINE_METHODS[methodKey] : null;

  return (
    <Overlay open={open} onClose={onClose}>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <span className="mb-0.5 block text-xs font-bold uppercase tracking-wider text-[#3D8D7A]">
            {method?.label}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Payment details</h3>
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
        <div className="flex flex-col gap-1 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs sm:text-sm text-slate-700">
          <span>{method?.line1}</span>
          <strong className="text-sm sm:text-base font-bold text-[#3D8D7A]">{method?.line2}</strong>
        </div>

        <div>
          <label htmlFor="simple-amount" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Amount (৳)
          </label>
          <input
            id="simple-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1,000"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-[#3D8D7A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]/20 transition-all"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
        <button
          type="button"
          onClick={onConfirm}
          className="w-full rounded-full bg-[#3D8D7A] hover:bg-[#2b6658] px-5 py-3 text-sm font-semibold text-white shadow-md active:scale-95 transition-all"
        >
          Confirm payment
        </button>
      </div>
    </Overlay>
  );
}
