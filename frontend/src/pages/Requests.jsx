import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, List, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
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
import { CASES, OFFLINE_METHODS, WALLET_METHODS } from "../data/cases";
import { AuthContext } from "../context/authContext";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");

// Normalize raw MongoDB document for display & modals
function normalizeRequestItem(item) {
  const goalNum = Number(item.goal) || 0;
  const raisedNum = Number(item.raised) || 0;
  const percent =
    goalNum > 0
      ? Math.min(100, Math.round((raisedNum / goalNum) * 100))
      : Number(item.percent) || 0;

  const formattedRaised = `৳ ${raisedNum.toLocaleString("en-IN")} raised`;
  const formattedGoal = `৳ ${goalNum.toLocaleString("en-IN")}`;
  const methods = Array.isArray(item.methods)
    ? item.methods
    : typeof item.methods === "string"
    ? item.methods.split(",").map((m) => m.trim()).filter(Boolean)
    : ["bKash", "Nagad", "Bank", "Cash"];

  const docs = Array.isArray(item.docs) ? item.docs : [];

  return {
    ...item,
    id: item.id || (item._id ? `SH-${String(item._id).slice(-5).toUpperCase()}` : "SH-00000"),
    _id: item._id,
    name: item.name || "Donation Request",
    type: item.type || "Individual",
    category: item.category || "Family support",
    goalNum,
    raisedNum,
    goal: formattedGoal,
    raised: formattedRaised,
    percent,
    area: item.area || "",
    desc: item.desc || "",
    urgent: Boolean(item.urgent),
    verified: Boolean(item.verified),
    methods,
    docs,
    image:
      item.image ||
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=700&auto=format&fit=crop",
    submitted: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Recently",
  };
}

export default function Requests() {
  const { user } = useContext(AuthContext);

  // Data fetching state
  const [dbRequests, setDbRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Layout state: 'grid' (default, modern 3-col) or 'list' (compact row)
  const [layout, setLayout] = useState("grid");

  // Search + category filter
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Details / report / payment flow
  const [detailsCase, setDetailsCase] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [purpose, setPurpose] = useState("donation");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [walletMethod, setWalletMethod] = useState(null);
  const [simpleMethod, setSimpleMethod] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToastMessage(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2600);
  };

  // Fetch all donation requests from MongoDB
  const fetchRequests = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/request`);
      if (!res.ok) {
        throw new Error(`Failed to fetch requests (Status: ${res.status})`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data.requests) ? data.requests : [];

      if (rawList.length > 0) {
        const normalized = rawList.map(normalizeRequestItem);
        setDbRequests(normalized);
      } else {
        // Fallback to initial cases if DB collection is empty
        const fallback = Object.values(CASES).map(normalizeRequestItem);
        setDbRequests(fallback);
      }
    } catch (err) {
      console.error("[Requests] Fetch error:", err);
      setFetchError(err.message);
      // Fallback on network/server error so UI doesn't look broken
      const fallback = Object.values(CASES).map(normalizeRequestItem);
      setDbRequests(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleQueryChange = (value) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleChipChange = (chip) => {
    if (chip === "categories") {
      setActiveChip("categories");
      setCurrentPage(1);
      return;
    }
    setSelectedCategories([]);
    setActiveChip(chip);
    setCurrentPage(1);
  };

  const toggleCategory = (category) => {
    setActiveChip("categories");
    setCurrentPage(1);
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  // Filter requests based on query, active chip, and selected categories
  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase();

    return dbRequests.filter((item) => {
      // 1. Search Query
      const matchesSearch =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q)) ||
        (item.area && item.area.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // 2. Chip Filter ('urgent' vs 'all')
      if (activeChip === "urgent" && !item.urgent) {
        return false;
      }

      // 3. Category Filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }

      return true;
    });
  }, [dbRequests, query, activeChip, selectedCategories]);

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

  const proceedToMethod = (caseDataOrPurpose, explicitPurpose) => {
    if (typeof caseDataOrPurpose === "object" && caseDataOrPurpose !== null) {
      setSelectedRequest(caseDataOrPurpose);
      setDetailsCase(null);
      setPurpose(explicitPurpose || "donation");
    } else {
      setSelectedRequest(detailsCase);
      setDetailsCase(null);
      setPurpose(caseDataOrPurpose || "donation");
    }
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
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
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
        receiverId:
          selectedRequest?.receiverId ||
          selectedRequest?.userId ||
          selectedRequest?.ownerId,
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
    <div className="min-h-screen bg-[#FAF9F5] font-sans text-slate-800 leading-relaxed pb-16">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search Hero */}
        <SearchHero
          userName={user?.name || "Supporter"}
          query={query}
          onQueryChange={handleQueryChange}
          activeChip={activeChip}
          onChipChange={handleChipChange}
          selectedCategories={selectedCategories}
          onCategoryToggle={toggleCategory}
        />

        {/* Section Header & View Layout Switcher */}
        <div className="mt-10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3D8D7A]" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeChip === "urgent" ? "Urgent Emergency Requests" : "All Active Requests"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {activeChip === "urgent"
                ? "Cases needing immediate attention within 24-72 hours"
                : "Real verified requests submitted by individuals and community representatives"}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredCases.length} {filteredCases.length === 1 ? "cause" : "causes"} found
            </span>

            {/* Layout Toggle Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLayout("grid")}
                title="Grid layout"
                aria-label="Grid view"
                className={`p-1.5 rounded-lg transition-all ${
                  layout === "grid"
                    ? "bg-white text-[#3D8D7A] shadow-sm"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayout("list")}
                title="List layout"
                aria-label="List view"
                className={`p-1.5 rounded-lg transition-all ${
                  layout === "list"
                    ? "bg-white text-[#3D8D7A] shadow-sm"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={fetchRequests}
              title="Refresh requests"
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-[#3D8D7A] hover:border-[#3D8D7A] transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#3D8D7A]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4 animate-pulse"
              >
                <div className="h-48 w-full rounded-2xl bg-slate-200" />
                <div className="h-4 w-1/3 rounded-lg bg-slate-200" />
                <div className="h-6 w-3/4 rounded-lg bg-slate-200" />
                <div className="h-4 w-full rounded-lg bg-slate-100" />
                <div className="h-2.5 w-full rounded-full bg-slate-200" />
                <div className="flex justify-between">
                  <div className="h-4 w-20 rounded bg-slate-200" />
                  <div className="h-4 w-20 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredCases.length === 0 && (
          <div className="my-12 text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No requests found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any donation requests matching your search or filters.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveChip("all");
                  setSelectedCategories([]);
                }}
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Requests Render */}
        {!isLoading && filteredCases.length > 0 && (
          <CategorySection
            section={{
              title: "",
              hint: "",
              key: activeChip,
            }}
            cases={filteredCases}
            visible={true}
            page={currentPage}
            pageSize={layout === "grid" ? 6 : 5}
            layout={layout}
            onPageChange={setCurrentPage}
            onOpenDetails={openDetails}
            onProceed={proceedToMethod}
          />
        )}
      </main>

      <Footer />

      {/* Details Modal */}
      <DetailsModal
        data={detailsCase}
        open={!!detailsCase}
        onClose={closeDetails}
        onReport={openReport}
        onProceed={proceedToMethod}
      />

      {/* Report Modal */}
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} onSubmit={submitReport} />

      {/* Method Selection Modal */}
      <MethodModal
        open={methodOpen}
        onClose={() => setMethodOpen(false)}
        purpose={purpose}
        onSelect={selectMethod}
      />

      {/* Mobile Wallet Payment Modal */}
      <MobileWalletModal
        open={!!walletMethod}
        methodKey={walletMethod}
        onClose={() => setWalletMethod(null)}
        onConfirm={confirmWalletPayment}
      />

      {/* Simple (Bank / Cash) Payment Modal */}
      <SimpleModal
        open={!!simpleMethod}
        methodKey={simpleMethod}
        onClose={() => setSimpleMethod(null)}
        onConfirm={confirmSimplePayment}
      />

      {/* Success Modal */}
      <SuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />

      {/* Toast notifications */}
      <Toast message={toastMessage} />
    </div>
  );
}