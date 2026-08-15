import { CheckIcon } from "./Icons";

export default function Toast({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full bg-slate-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xl transition-all duration-300 ease-out
        ${message ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"}`}
    >
      <CheckIcon className="flex-shrink-0 text-emerald-400" />
      <span>{message}</span>
    </div>
  );
}
