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
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <span className="mb-0.5 block text-xs font-bold uppercase tracking-wider text-[#3D8D7A]">{label}</span>
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
        <div className="flex flex-col gap-1 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-4 text-xs sm:text-sm text-emerald-900">
          <span>Merchant No.</span>
          <strong className="font-mono text-base font-bold text-[#3D8D7A]">01711-000000</strong>
        </div>

        <div>
          <label htmlFor="wallet-number" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Your {label} number
          </label>
          <input
            id="wallet-number"
            type="tel"
            inputMode="numeric"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-[#3D8D7A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]/20 transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="wallet-txnid" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Transaction ID
            </label>
            <input
              id="wallet-txnid"
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="e.g. 9GD4K2LQ"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-[#3D8D7A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]/20 transition-all"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="wallet-amount" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Amount (৳)
            </label>
            <input
              id="wallet-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1,000"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-[#3D8D7A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Screenshot of transaction <span className="font-normal normal-case text-slate-400">(optional)</span>
          </label>
          <label
            htmlFor="wallet-file"
            className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center text-xs sm:text-sm text-slate-600 hover:border-[#3D8D7A] hover:text-[#3D8D7A] hover:bg-emerald-50/20 transition-all"
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
