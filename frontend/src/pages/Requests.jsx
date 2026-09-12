import { useMemo, useRef, useState } from "react";
import Footer from "../components/shared/Footer";
import SearchHero from "../components/SearchHero";
import CategorySection from "../components/CategorySection";
import Toast from "../components/Toast";
import DetailsModal from "../components/modals/DetailsModal";
import ReportModal from "../components/modals/ReportModal";
import MethodModal from "../components/modals/MethodModal";
import MobileWalletModal from "../components/modals/MobileWalletModal";
import SimpleModal from "../components/modals/SimpleModal";
import SuccessModal from "../components/modals/SuccessModal";
import { CASES, OFFLINE_METHODS, SECTIONS, WALLET_METHODS } from "../data/cases";

export default function Requests() {
 
  // Search + category filter
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPages, setCurrentPages] = useState({});

  // Details / report / payment flow — mirrors the original chained-overlay behavior
  const [detailsCase, setDetailsCase] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [purpose, setPurpose] = useState("donation");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [walletMethod, setWalletMethod] = useState(null); // 'bkash' | 'nagad' | 'rocket'
  const [simpleMethod, setSimpleMethod] = useState(null); // 'bank' | 'cash'
  const [successOpen, setSuccessOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToastMessage(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2600);
  };

  const filteredQuery = query.trim().toLowerCase();

  const resetPages = () => setCurrentPages({});

  const handleQueryChange = (value) => {
    setQuery(value);
    resetPages();
  };

  const sectionsWithCases = useMemo(
    () => SECTIONS.map((section) => ({
      section,
      cases: section.caseIds
        .map((id) => CASES[id])
        .filter(
          (data) =>
            (!filteredQuery ||
              data.name.toLowerCase().includes(filteredQuery) ||
              data.id.toLowerCase().includes(filteredQuery)) &&
            (selectedCategories.length === 0 || selectedCategories.includes(data.category))
        ),
    })),
    [filteredQuery, selectedCategories]
  );

  const handleChipChange = (chip) => {
    if (chip === "categories") {
      setActiveChip("categories");
      resetPages();
      return;
    }
    setSelectedCategories([]);
    setActiveChip(chip);
    resetPages();
  };

  const toggleCategory = (category) => {
    setActiveChip("categories");
    resetPages();
    setSelectedCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
    );
  };

  const handlePageChange = (sectionKey, page) => {
    setCurrentPages((current) => ({ ...current, [sectionKey]: page }));
  };

  const openDetails = (data) => setDetailsCase(data);
  const closeDetails = () => setDetailsCase(null);

  const openReport = () => {
    setDetailsCase(null);
    setReportOpen(true);
  };

  const submitReport = () => {
    setReportOpen(false);
    showToast("Report submitted — our admin team will review it.");
  };

  const proceedToMethod = (chosenPurpose) => {
    setSelectedRequest(detailsCase);
    setDetailsCase(null);
    setPurpose(chosenPurpose);
    setMethodOpen(true);
  };

  const selectMethod = (key) => {
    setMethodOpen(false);
    if (WALLET_METHODS[key]) {
      setWalletMethod(key);
    } else {
      setSimpleMethod(key);
    }
  };

  const saveTransaction = async ({ amount, transactionId = "" }, paymentMethod) => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const response = await fetch(`${apiBase}/api/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        amount,
        transactionId,
        paymentMethod,
        purpose,
        requestId: selectedRequest?.id,
        counterpartyId: selectedRequest?.id,
        counterpartyName: selectedRequest?.name,
        direction: "given",
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to save transaction");
    return data.transaction;
  };

  const confirmWalletPayment = async (details) => {
    try {
      await saveTransaction(details, WALLET_METHODS[walletMethod]?.label || walletMethod);
      setWalletMethod(null);
      setSelectedRequest(null);
      setSuccessOpen(true);
    } catch (error) {
      showToast(error.message);
    }
  };

  const confirmSimplePayment = async (details) => {
    try {
      await saveTransaction(details, OFFLINE_METHODS[simpleMethod]?.label || simpleMethod);
      setSimpleMethod(null);
      setSelectedRequest(null);
      setSuccessOpen(true);
    } catch (error) {
      showToast(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans text-slate-800 leading-relaxed">

      <main className="mx-auto max-w-[1080px] px-6 pb-5 pt-9">
        <SearchHero
          userName="Raiyan"
          query={query}
          onQueryChange={handleQueryChange}
          activeChip={activeChip}
          onChipChange={handleChipChange}
          selectedCategories={selectedCategories}
          onCategoryToggle={toggleCategory}
        />

        {sectionsWithCases.map(({ section, cases }) => (
          <CategorySection
            key={section.key}
            section={section}
            cases={cases}
            page={currentPages[section.key] || 1}
            onPageChange={(page) => handlePageChange(section.key, page)}
            visible={
              cases.length > 0 &&
              ((activeChip === "all" || activeChip === "categories") && section.key === "all") ||
              (activeChip === "urgent" && section.key === "urgent")
            }
            onOpenDetails={openDetails}
          />
        ))}
      </main>

      <Footer />

      <DetailsModal
        data={detailsCase}
        open={!!detailsCase}
        onClose={closeDetails}
        onReport={openReport}
        onProceed={proceedToMethod}
      />

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} onSubmit={submitReport} />

      <MethodModal open={methodOpen} onClose={() => setMethodOpen(false)} purpose={purpose} onSelect={selectMethod} />

      <MobileWalletModal
        open={!!walletMethod}
        methodKey={walletMethod}
        onClose={() => setWalletMethod(null)}
        onConfirm={confirmWalletPayment}
      />

      <SimpleModal
        open={!!simpleMethod}
        methodKey={simpleMethod}
        onClose={() => setSimpleMethod(null)}
        onConfirm={confirmSimplePayment}
      />

      <SuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />

      <Toast message={toastMessage} />
    </div>
  );
}