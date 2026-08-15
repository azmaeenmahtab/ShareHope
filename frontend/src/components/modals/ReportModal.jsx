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
      <div className="sticky top-0 z-[2] flex items-center justify-between gap-3 border-b border-[var(--border-soft)] bg-[var(--bg-raised)] px-[22px] py-[18px]">
        <div>
          <span className="mb-0.5 block text-[11.5px] font-bold uppercase tracking-[.08em] text-[var(--accent)]">
            Keep ShareHope honest
          </span>
          <h3 className="text-lg font-display font-semibold text-[var(--text-strong)]">Report this request</h3>
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
        <div className="mb-4">
          <label htmlFor="report-reason" className="mb-[7px] block text-[12.5px] font-bold uppercase tracking-[.04em] text-[var(--text-soft)]">
            Reason
          </label>
          <select
            id="report-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg-sunken)] px-3.5 py-3 text-[14.5px] text-[var(--text-strong)] focus:border-[var(--accent)] focus:bg-[var(--bg-raised)] focus:outline-none"
          >
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="report-notes" className="mb-[7px] block text-[12.5px] font-bold uppercase tracking-[.04em] text-[var(--text-soft)]">
            Additional explanation <span className="font-normal normal-case text-[var(--text-soft)]">(optional)</span>
          </label>
          <textarea
            id="report-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell the admin team what you noticed…"
            className="min-h-[88px] w-full resize-y rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--bg-sunken)] px-3.5 py-3 text-[14.5px] text-[var(--text-strong)] focus:border-[var(--accent)] focus:bg-[var(--bg-raised)] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2.5 px-[22px] pb-[22px] pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--bg-sunken)] px-5 py-[11px] text-sm font-semibold text-[var(--accent-strong)] hover:border-[var(--accent)] hover:bg-[var(--bg-raised)]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[var(--danger-600)] px-5 py-[11px] text-sm font-semibold text-white active:scale-[.97]"
        >
          Submit report
        </button>
      </div>
    </Overlay>
  );
}
