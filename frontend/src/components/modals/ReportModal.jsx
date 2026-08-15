import { useState } from "react";
import Overlay from "../Overlay";
import { CloseIcon } from "../Icons";

const REASONS = ["Scam", "Fake documents", "Payment not confirmed", "Fraudulent information"];

export default function ReportModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onSubmit({ reason, notes });
    setNotes("");
  };

  return (
    <Overlay open={open} onClose={onClose}>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <span className="mb-0.5 block text-xs font-bold uppercase tracking-wider text-red-600">
            Keep ShareHope honest
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Report this request</h3>
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
        <div>
          <label htmlFor="report-reason" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Reason
          </label>
          <select
            id="report-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-[#3D8D7A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]/20 transition-all"
          >
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="report-notes" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Additional explanation <span className="font-normal normal-case text-slate-400">(optional)</span>
          </label>
          <textarea
            id="report-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell the admin team what you noticed…"
            className="min-h-[90px] w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-[#3D8D7A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]/20 transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/50">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 rounded-full bg-red-600 hover:bg-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-95"
        >
          Submit report
        </button>
      </div>
    </Overlay>
  );
}
