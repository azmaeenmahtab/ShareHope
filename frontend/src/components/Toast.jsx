import { CheckIcon } from "./Icons";

export default function Toast({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-[9px] whitespace-nowrap rounded-full bg-[var(--trunk-950)] px-5 py-[13px] text-[13.5px] font-semibold text-white shadow-[var(--shadow-lg)] transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]
        ${message ? "translate-y-0" : "translate-y-[120%]"}`}
    >
      <CheckIcon className="flex-shrink-0 text-[var(--leaf-300)]" />
      <span>{message}</span>
    </div>
  );
}
