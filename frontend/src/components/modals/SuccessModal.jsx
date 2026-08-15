import Overlay from "../Overlay";
import { CheckIcon } from "../Icons";

export default function SuccessModal({ open, onClose }) {
  return (
    <Overlay open={open} onClose={onClose}>
      <div className="px-6 py-10 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
          <CheckIcon className="h-8 w-8" width="32" height="32" strokeWidth="3" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Payment submitted</h3>
        <p className="mx-auto max-w-[340px] text-xs sm:text-sm text-slate-600 leading-relaxed">
          The receiver has been notified and will confirm your payment shortly. You'll see this in your
          transaction history once verified.
        </p>
        <div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#3D8D7A] hover:bg-[#2b6658] px-6 py-2.5 text-sm font-semibold text-white shadow-md active:scale-95 transition-all"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </Overlay>
  );
}
