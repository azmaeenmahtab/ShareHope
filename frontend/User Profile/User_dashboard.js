(function () {
  "use strict";
  const CASES = {
    1: {
      id: "SH-10432", name: "Karim Family — A warrior father", type: "Individual", verified: true, urgent: false,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbDiyQOo_Vi-ZIfF0JT3i5OJNtxe26KKchx64WxjfuNQ&s=10",
      desc: "Single father of three in Natunbazar needs blankets and a month's groceries after losing rickshaw work to an injury. Case verified with local imam's letter and hospital discharge note.",
      raised: "৳ 32,000 raised", goal: "৳ 50,000", percent: 64,
      area: "Natunbazar Busstand, Dhaka", Category:"Family support",
      submit: "03 Aug 2026", 
      methods: "bKash, Nagad, Bank, Cash",
      docs:["📄 NID copy", "📄 Imam letter", "📄 Hospital note"]
    },
    2: {
      id: "SH-20117", name: "Noor Widows' Trust", type: "Organization", verified: true, urgent: false,
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=700&auto=format&fit=crop",
      desc: "Local trust supporting 14 widows in Pallabi with monthly ration and school fees for their children. Registered NGO, audited annually.",
      raised: "৳ 61,500 raised", goal: "৳ 150,000", percent: 41
    },
    3: {
      id: "SH-30582", name: "Fahim — Emergency Dialysis", type: "Individual", verified: true, urgent: true,
      image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=700&auto=format&fit=crop",
      desc: "22-year-old needs immediate dialysis sessions this week; hospital has confirmed the treatment plan and provided a signed cost estimate.",
      raised: "৳ 9,000 raised", goal: "৳ 50,000", percent: 18
    },
    4: {
      id: "SH-40261", name: "Char Kukri-Mukri Flood Relief", type: "Organization", verified: true, urgent: true,
      image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=700&auto=format&fit=crop",
      desc: "40 families displaced by flash flooding need clean water, tarpaulin and dry food within 72 hours. Coordinated with local union council.",
      raised: "৳ 87,000 raised", goal: "৳ 300,000", percent: 29
    },
    5: {
      id: "SH-11890", name: "Al-Amin Orphan Care", type: "Organization", verified: true, urgent: false,
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=700&auto=format&fit=crop",
      desc: "Runs a 60-child orphanage in Savar; monthly Zakat sponsorship covers food, tuition and healthcare for every child on record.",
      raised: "৳ 219,000 raised", goal: "৳ 300,000", percent: 73
    }
  };

  /* ---------- category chip filter ---------- */
  const chips = document.querySelectorAll("[data-chip]");
  const sections = document.querySelectorAll(".cat-section");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const key = chip.getAttribute("data-chip");
      sections.forEach((sec) => {
        sec.style.display = key === "all" || sec.dataset.category === key ? "" : "none";
      });
    });
  });

  /* ---------- open case details ---------- */
  const modalDetails = document.getElementById("modal-details");
  let activeCase = null;

  function openDetails(caseId) {
    const data = CASES[caseId];
    if (!data) return;
    activeCase = data;

    document.getElementById("details-id").textContent = "ID " + data.id;
    document.getElementById("details-name").textContent = data.name;
    document.getElementById("details-image").src = data.image;
    document.getElementById("details-desc").textContent = data.desc;
    document.getElementById("details-bar").style.width = data.percent + "%";
    document.getElementById("details-raised").textContent = data.raised;
    document.getElementById("details-goal").textContent = data.goal;
    document.getElementById("details-area").textContent = data.area;
    document.getElementById("details-category").textContent = data.Category;
    document.getElementById("details-submitted").textContent = data.submit;
    document.getElementById("details-methods").textContent = data.methods;
    document.getElementById("details-docs-1").textContent = data.docs[0] || "";
    document.getElementById("details-docs-2").textContent = data.docs[1] || "";
    document.getElementById("details-docs-3").textContent = data.docs[2] || "";
    const badgeWrap = document.getElementById("details-badges");
    badgeWrap.innerHTML = "";
    if (data.verified) {
      badgeWrap.innerHTML += `<span class="badge badge-verified"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Verified</span>`;
    }
    if (data.urgent) {
      badgeWrap.innerHTML += `<span class="badge badge-urgent"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M12 9v4M12 17h.01M10.3 3.86 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.86a2 2 0 0 0-3.4 0Z"/></svg>Urgent</span>`;
    }
    badgeWrap.innerHTML += `<span class="badge badge-org">${data.type}</span>`;

    window.shOpenModal(modalDetails);
  }

  document.querySelectorAll(".dcard").forEach((card) => {
    const id = card.getAttribute("data-case");
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-details]")) return; // let button handler run once
      openDetails(id);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetails(id); }
    });
    const btn = card.querySelector("[data-open-details]");
    if (btn) btn.addEventListener("click", (e) => { e.stopPropagation(); openDetails(id); });
  });

  /* ---------- generic [data-open] chain: closes current overlay, opens target ---------- */
  let currentPurpose = "donation";
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-open");
      if (btn.dataset.purpose) currentPurpose = btn.dataset.purpose;
      const openOverlay = btn.closest(".sh-overlay");
      if (openOverlay) window.shCloseModal(openOverlay);
      const target = document.getElementById(targetId);
      if (targetId === "modal-method") {
        document.getElementById("method-purpose-label").textContent =
          currentPurpose === "zakat" ? "Zakat" : "Donation";
      }
      window.shOpenModal(target);
    });
  });

  /* ---------- report submit ---------- */
  document.querySelector("[data-submit-report]").addEventListener("click", () => {
    window.shCloseModal(document.getElementById("modal-report"));
    window.shToast("Report submitted — our admin team will review it.");
  });

  /* ---------- payment method selection ---------- */
  const modalMethod = document.getElementById("modal-method");
  const modalMobile = document.getElementById("modal-mobile");
  const modalSimple = document.getElementById("modal-simple");

  const WALLETS = { bkash: "bKash", nagad: "Nagad", rocket: "Rocket" };
  const BANK_INFO = {
    bank: { label: "Bank transfer", line1: "Bank · Account name", line2: "ShareHope Foundation — A/C 2011 5567 002" },
    cash: { label: "Cash", line1: "Hand-to-hand collection", line2: "A verified collector will contact you to arrange pickup" }
  };

  document.querySelectorAll("[data-method]").forEach((tile) => {
    tile.addEventListener("click", () => {
      const method = tile.getAttribute("data-method");
      window.shCloseModal(modalMethod);

      if (WALLETS[method]) {
        document.getElementById("mobile-method-name").textContent = WALLETS[method];
        document.getElementById("mobile-method-name-2").textContent = WALLETS[method];
        document.getElementById("wallet-number").value = "";
        document.getElementById("wallet-txnid").value = "";
        document.getElementById("wallet-amount").value = "";
        document.getElementById("wallet-file-label").textContent = "Tap to upload a screenshot";
        window.shOpenModal(modalMobile);
      } else {
        const info = BANK_INFO[method];
        document.getElementById("simple-method-name").textContent = info.label;
        document.getElementById("simple-instructions").innerHTML =
          `<span>${info.line1}</span><strong>${info.line2}</strong>`;
        document.getElementById("simple-amount").value = "";
        window.shOpenModal(modalSimple);
      }
    });
  });

  /* ---------- optional screenshot filename preview ---------- */
  const walletFile = document.getElementById("wallet-file");
  if (walletFile) {
    walletFile.addEventListener("change", () => {
      const label = document.getElementById("wallet-file-label");
      label.textContent = walletFile.files.length ? walletFile.files[0].name : "Tap to upload a screenshot";
    });
  }

  /* ---------- confirm payment -> success ---------- */
  document.querySelectorAll("[data-submit-payment]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const overlay = btn.closest(".sh-overlay");
      window.shCloseModal(overlay);
      window.shOpenModal(document.getElementById("modal-success"));
    });
  });
})();