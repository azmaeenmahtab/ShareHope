(function () {
  "use strict";

  //Theme toggle
  const root = document.documentElement;
  const stored = localStorage.getItem("sh-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  function setToggleLabel(btn) {
    const dark = root.getAttribute("data-theme") === "dark";
    btn.setAttribute("aria-checked", String(dark));
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    setToggleLabel(btn);
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("sh-theme", next);
      setToggleLabel(btn);
    });
  });

  //Moile Nav
  const mob = document.querySelector("[data-nav-burger]");
  const links = document.querySelector("[data-nav-links]");
  if (mob && links) {
    mob.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      mob.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("is-open"))
    );
  }
  /* ---------- Toast (global helper) ---------- */
  /* let toastTimer = null;
   window.shToast = function (message) {
     let toast = document.querySelector(".sh-toast");
     if (!toast) {
       toast = document.createElement("div");
       toast.className = "sh-toast";
       toast.innerHTML =
         '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span></span>';
       document.body.appendChild(toast);
     }
     toast.querySelector("span").textContent = message;
     toast.classList.add("is-open");
     clearTimeout(toastTimer);
     toastTimer = setTimeout(() => toast.classList.remove("is-open"), 2600);
   };
 */
  /* ---------- Generic modal open/close helpers ---------- */
  window.shOpenModal = function (overlayEl) {
    if (!overlayEl) return;
    overlayEl.classList.add("is-open");
    overlayEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  window.shCloseModal = function (overlayEl) {
    if (!overlayEl) return;
    overlayEl.classList.remove("is-open");
    overlayEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".sh-overlay").forEach((ov) => {
    ov.addEventListener("click", (e) => {
      if (e.target === ov) window.shCloseModal(ov);
    });
    ov.querySelectorAll("[data-close-modal]").forEach((btn) =>
      btn.addEventListener("click", () => window.shCloseModal(ov))
    );
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".sh-overlay.is-open").forEach((ov) => window.shCloseModal(ov));
    }
  });
})();