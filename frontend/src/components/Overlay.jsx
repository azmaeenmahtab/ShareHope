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
      className={`fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 sm:items-center sm:p-4
        ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div
        className={`max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-out sm:rounded-3xl
          ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}
