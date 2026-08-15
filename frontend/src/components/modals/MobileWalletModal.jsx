import { useEffect, useState } from "react";
import Overlay from "../Overlay";
import { CloseIcon, UploadIcon } from "../Icons";
import { WALLET_METHODS } from "../../data/cases";

export default function MobileWalletModal({ open, methodKey, onClose, onConfirm }) {
  const [number, setNumber] = useState("");
  const [txnId, setTxnId] = useState("");
  const [amount, setAmount] = useState("");
  const [fileName, setFileName] = useState("");

  // Reset the form whenever a fresh wallet method is chosen.
  useEffect(() => {
    if (open) {
      setNumber("");
      setTxnId("");
      setAmount("");
      setFileName("");
    }
  }, [open, methodKey]);

  const method = methodKey ? WALLET_METHODS[methodKey] : null;
  const label = method?.label ?? "";

  return (
    <Overlay open={open} onClose={onClose}>
      <div className="sticky top-0 z-[2] flex items-center justify-between gap-3 border-b border-[var(--border-soft)] bg-[var(--bg-raised)] px-[22px] py-[18px]">
        <div>
          <span className="mb-0.5 block text-[11.5px] font-bold uppercase tracking-[.08em] text-[var(--accent)]">{label}</span>
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
          <span>Send to ShareHope Merchant No.</span>
          <strong className="font-mono text-[15px] text-[var(--accent-strong)]">01711-000000</strong>
        </div>

        <div className="mb-4">
          <label htmlFor="wallet-number" className="mb-[7px] block text-[12.5px] font-bold uppercase tracking-[.04em] text-[var(--text-soft)]">
            Your {label} number
          </label>
          <input
            id="wallet-number"
            type="tel"
            inputMode="numeric"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="w-full rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg-sunken)] px-3.5 py-3 text-[14.5px] text-[var(--text-strong)] focus:border-[var(--accent)] focus:bg-[var(--bg-raised)] focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="wallet-txnid" className="mb-[7px] block text-[12.5px] font-bold uppercase tracking-[.04em] text-[var(--text-soft)]">
              Transaction ID
            </label>
            <input
              id="wallet-txnid"
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="e.g. 9GD4K2LQ"
              className="w-full rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg-sunken)] px-3.5 py-3 text-[14.5px] text-[var(--text-strong)] focus:border-[var(--accent)] focus:bg-[var(--bg-raised)] focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="wallet-amount" className="mb-[7px] block text-[12.5px] font-bold uppercase tracking-[.04em] text-[var(--text-soft)]">
              Amount (৳)
            </label>
            <input
              id="wallet-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1,000"
              className="w-full rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg-sunken)] px-3.5 py-3 text-[14.5px] text-[var(--text-strong)] focus:border-[var(--accent)] focus:bg-[var(--bg-raised)] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-[7px] block text-[12.5px] font-bold uppercase tracking-[.04em] text-[var(--text-soft)]">
            Screenshot of transaction <span className="font-normal normal-case text-[var(--text-soft)]">(optional)</span>
          </label>
          <label
            htmlFor="wallet-file"
            className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-[1.5px] border-dashed border-[var(--border)] bg-[var(--bg-sunken)] p-[18px] text-center text-[13px] text-[var(--text-soft)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            <UploadIcon />
            <span>{fileName || "Tap to upload a screenshot"}</span>
          </label>
          <input
            id="wallet-file"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
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
