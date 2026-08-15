import { useEffect } from "react";

export default function Overlay({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-[100] flex items-end justify-center bg-[rgba(6,20,34,.55)] backdrop-blur-[3px] transition-opacity duration-200 sm:items-center sm:p-6
        ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div
        className={`max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-[24px] border border-b-0 border-[var(--border-soft)] bg-[var(--bg-raised)] shadow-[var(--shadow-lg)] transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] sm:rounded-[24px] sm:border-b
          ${open ? "translate-y-0" : "translate-y-6"}`}
      >
        {children}
      </div>
    </div>
  );
}
