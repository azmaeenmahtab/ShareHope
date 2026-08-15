import Overlay from "../Overlay";
import { CheckIcon } from "../Icons";

export default function SuccessModal({ open, onClose }) {
  return (
    <Overlay open={open} onClose={onClose}>
      <div className="px-6 py-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(28,138,99,.12)] text-[var(--ok-600)]">
          <CheckIcon className="h-[30px] w-[30px]" width="30" height="30" strokeWidth="3" />
        </div>
        <h3 className="text-lg font-display font-semibold text-[var(--text-strong)]">Payment submitted</h3>
        <p className="mx-auto max-w-[340px] text-[13.5px] text-[var(--text-soft)]">
          The receiver has been notified and will confirm your payment shortly. You'll see this in your
          transaction history once verified.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-br from-[var(--leaf-600)] to-[var(--trunk-800)] px-5 py-[11px] text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(23,90,146,.6)] active:scale-[.97]"
        >
          Back to dashboard
        </button>
      </div>
    </Overlay>
  );
}
