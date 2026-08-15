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
      <div className="sticky top-0 z-[2] flex items-center justify-between gap-3 border-b border-[var(--border-soft)] bg-[var(--bg-raised)] px-[22px] py-[18px]">
        <div>
          <span className="mb-0.5 block text-[11.5px] font-bold uppercase tracking-[.08em] text-[var(--accent)]">
            {method?.label}
          </span>
          <h3 className="text-lg font-display font-semibold text-[var(--text-strong)]">Payment details</h3>
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
        <div className="mb-[18px] flex flex-col gap-1 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-sunken)] px-4 py-3.5 text-[13px] text-[var(--text-soft)]">
          <span>{method?.line1}</span>
          <strong className="text-[var(--accent-strong)]">{method?.line2}</strong>
        </div>

        <div>
          <label htmlFor="simple-amount" className="mb-[7px] block text-[12.5px] font-bold uppercase tracking-[.04em] text-[var(--text-soft)]">
            Amount (৳)
          </label>
          <input
            id="simple-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1,000"
            className="w-full rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg-sunken)] px-3.5 py-3 text-[14.5px] text-[var(--text-strong)] focus:border-[var(--accent)] focus:bg-[var(--bg-raised)] focus:outline-none"
          />
        </div>
      </div>

      <div className="px-[22px] pb-[22px] pt-4">
        <button
          type="button"
          onClick={onConfirm}
          className="w-full rounded-full bg-gradient-to-br from-[var(--leaf-600)] to-[var(--trunk-800)] px-5 py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(23,90,146,.6)] active:scale-[.97]"
        >
          Confirm payment
        </button>
      </div>
    </Overlay>
  );
}
