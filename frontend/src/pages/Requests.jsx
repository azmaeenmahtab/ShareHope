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
import { CASES, SECTIONS, WALLET_METHODS } from "../data/cases";

export default function Requests() {
 
  // Search + category filter
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("all");

  // Details / report / payment flow — mirrors the original chained-overlay behavior
  const [detailsCase, setDetailsCase] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [purpose, setPurpose] = useState("donation");
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
  const matchesSearch = (data) =>
    !filteredQuery ||
    data.name.toLowerCase().includes(filteredQuery) ||
    data.id.toLowerCase().includes(filteredQuery);

  const sectionsWithCases = useMemo(
    () =>
      SECTIONS.map((section) => ({
        section,
        cases: section.caseIds.map((id) => CASES[id]).filter(matchesSearch),
      })),
    [filteredQuery]
  );

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

  const confirmWalletPayment = () => {
    setWalletMethod(null);
    setSuccessOpen(true);
  };

  const confirmSimplePayment = () => {
    setSimpleMethod(null);
    setSuccessOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] font-sans text-slate-800 leading-relaxed">

      <main className="mx-auto max-w-[1080px] px-6 pb-5 pt-9">
        <SearchHero
          userName="Raiyan"
          query={query}
          onQueryChange={setQuery}
          activeChip={activeChip}
          onChipChange={setActiveChip}
        />

        {sectionsWithCases.map(({ section, cases }) => (
          <CategorySection
            key={section.key}
            section={section}
            cases={cases}
            visible={(activeChip === "all" || activeChip === section.key) && cases.length > 0}
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