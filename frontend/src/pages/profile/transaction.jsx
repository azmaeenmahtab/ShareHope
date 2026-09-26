import { useContext, useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Banknote, HeartHandshake, LoaderCircle, RefreshCw } from "lucide-react";
import { AuthContext } from "../../context/authContext";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");
const formatMoney =(value)=>`৳ ${Number(value || 0).toLocaleString("en-BD")}`;
const WALLET_METHODS = new Set(["bkash", "nagad", "rocket"]);
const TRANSACTIONS_PER_PAGE = 10;

const isWalletPayment = (method) => WALLET_METHODS.has(String(method || "").toLowerCase().trim());

const getSavedZakatAmount = () => {
  try {
    const saved = localStorage.getItem("zakatAmount") || localStorage.getItem("zakatResult");
    if (!saved) return 0;
    const parsed = Number(saved);
    if (Number.isFinite(parsed)) return parsed;
    const objectValue = JSON.parse(saved);
    return Number(objectValue?.zakat || objectValue?.amount || objectValue?.total || 0);
  } catch {
    return 0;
  }
};

function SummaryCard({ label, value, detail, tone = "green", icon: Icon }) {
  const tones = {
    green: "bg-[#EAF4F0] text-[#0D5C46]",
    gold: "bg-[#FFF7DF] text-[#9A6B00]",
    blue: "bg-[#EDF5FA] text-[#28627E]",
  };

  return (
    <div className="rounded-2xl border border-[#DDEBE5] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatMoney(value)}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function TransactionCard({ transaction, direction, onConfirm }) {
  const isGiven = direction === "given";
  const counterpartyLabel = isGiven ? "Given to" : "Received from";
  const showTransactionId = isWalletPayment(transaction.paymentMethod);
  const isPending = transaction.status !== "confirmed";

  return (
    <article className="rounded-2xl border border-[#DDEBE5] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isGiven ? "bg-[#EAF4F0] text-[#0D5C46]" : "bg-[#EDF5FA] text-[#28627E]"}`}>
            {isGiven ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{counterpartyLabel}</p>
            <h3 className="truncate text-base font-bold text-slate-900">{transaction.counterpartyName || "ShareHope user"}</h3>
            <p className="mt-1 text-xs text-slate-500">{transaction.counterpartyId || "No request ID"}</p>
          </div>
        </div>
        <p className={`text-lg font-bold ${isGiven ? "text-[#0D5C46]" : "text-[#28627E]"}`}>
          {formatMoney(transaction.amount)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs sm:grid-cols-4">
        <div>
          <p className="text-slate-400">Type</p>
          <p className="mt-1 font-semibold capitalize text-slate-700">{transaction.purpose || "donation"}</p>
        </div>
        <div>
          <p className="text-slate-400">Payment method</p>
          <p className="mt-1 font-semibold text-slate-700">{transaction.paymentMethod || "Not specified"}</p>
        </div>
        <div>
          <p className="text-slate-400">Status</p>
          <p className={`mt-1 font-semibold ${isPending ? "text-amber-600" : "text-emerald-700"}`}>
            {isPending ? "Pending confirmation" : "Confirmed"}
          </p>
        </div>
        <div>
          <p className="text-slate-400">Date</p>
          <p className="mt-1 font-semibold text-slate-700">{new Date(transaction.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      {showTransactionId && (
        <div className="mt-3 border-t border-slate-100 pt-3 text-xs">
          <p className="text-slate-400">Transaction ID</p>
          <p className="mt-1 truncate font-semibold text-slate-700">{transaction.transactionId || "Not provided"}</p>
        </div>
      )}
      {!isGiven && isPending && onConfirm && (
        <button
          type="button"
          onClick={() => onConfirm(transaction._id)}
          className="mt-4 w-full rounded-xl bg-[#0D5C46] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#094433]"
        >
          Confirm payment received
        </button>
      )}
    </article>
  );
}

function TransactionList({ transactions, direction, page, onPageChange, onConfirm }) {
  if (!transactions.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#CFE1DA] bg-white px-6 py-10 text-center">
        <Banknote className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-slate-700">No {direction} transactions yet</p>
        <p className="mt-1 text-xs text-slate-500">Your transaction history will appear here after a confirmed payment.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);
  const pageTransactions = transactions.slice(
    (page - 1) * TRANSACTIONS_PER_PAGE,
    page * TRANSACTIONS_PER_PAGE
  );

  return (
    <>
      <div className="space-y-3">
        {pageTransactions.map((transaction) => (
          <TransactionCard
            key={transaction._id}
            transaction={transaction}
            direction={direction}
            onConfirm={onConfirm}
          />
        ))}
      </div>
      <nav className="mt-5 flex items-center justify-center gap-1.5" aria-label={`${direction} transaction pages`}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-current={page === pageNumber ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={`h-9 min-w-9 rounded-lg border px-2.5 text-sm font-semibold transition-colors ${
              page === pageNumber
                ? "border-[#3D8D7A] bg-[#3D8D7A] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#3D8D7A] hover:text-[#3D8D7A]"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </nav>
    </>
  );
}

export default function TransactionPage() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [ownedRequests, setOwnedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("given");
  const [currentPages, setCurrentPages] = useState({ given: 1, taken: 1 });

  const fetchOwnedRequests = async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/request`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load your requests");
      const email = user.email.trim().toLowerCase();
      setOwnedRequests((data.requests || []).filter(
        (request) => request.submitterEmail?.trim().toLowerCase() === email
      ));
    } catch (fetchError) {
      setError(fetchError.message || "Unable to load your requests");
    }
  };

  const confirmReceived = async (transactionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/${transactionId}/confirm`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to confirm transaction");
      setTransactions((current) => current.map((item) => item._id === transactionId ? { ...item, status: "confirmed" } : item));
      await fetchOwnedRequests();
      window.dispatchEvent(new Event("sharehope:notifications-updated"));
    } catch (confirmError) {
      setError(confirmError.message);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    setCurrentPages({ given: 1, taken: 1 });
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions`, { credentials: "include" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load transactions");
      setTransactions(data.transactions || []);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchOwnedRequests();
    window.addEventListener("sharehope:requests-updated", fetchOwnedRequests);
    window.addEventListener("focus", fetchOwnedRequests);
    return () => {
      window.removeEventListener("sharehope:requests-updated", fetchOwnedRequests);
      window.removeEventListener("focus", fetchOwnedRequests);
    };
  }, [user?.email]);

  const givenTransactions = useMemo(() => transactions.filter((item) => item.direction === "given"), [transactions]);
  const takenTransactions = useMemo(() => transactions.filter((item) => item.direction === "taken"), [transactions]);
  const totalGiven = useMemo(() => givenTransactions.reduce((total, item) => total + Number(item.amount || 0), 0), [givenTransactions]);
  const totalZakatGiven = useMemo(() => givenTransactions.filter((item) => item.purpose === "zakat").reduce((total, item) => total + Number(item.amount || 0), 0), [givenTransactions]);
  const zakatDue = getSavedZakatAmount();
  const totalTaken = useMemo(() => ownedRequests.reduce((total, request) => total + Number(request.raised || 0), 0), [ownedRequests]);
  const requestedTotal = useMemo(() => ownedRequests.reduce((total, request) => total + Number(request.goal || 0), 0), [ownedRequests]);

  const changeView = (view) => {
    setActiveView(view);
    setCurrentPages((current) => ({ ...current, [view]: 1 }));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-5 py-8 text-slate-800 sm:px-8">
      <main className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-[#DDEBE5] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0D5C46]">Your account</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Transactions</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">A clear record of every donation you give and receive.</p>
          </div>
          <button type="button" onClick={fetchTransactions} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE1DA] bg-white px-4 py-2.5 text-sm font-semibold text-[#0D5C46] hover:bg-[#EAF4F0] disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-sm text-slate-500"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Loading transaction history...</div>
        ) : (
          <div className="mt-8">
            <div className="mb-8 flex w-full gap-2 rounded-2xl border border-[#DDEBE5] bg-white p-1.5" role="tablist" aria-label="Transaction type">
              <button
                type="button"
                role="tab"
                aria-selected={activeView === "given"}
                onClick={() => changeView("given")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeView === "given" ? "bg-[#0D5C46] text-white shadow-sm" : "text-slate-500 hover:bg-[#EAF4F0] hover:text-[#0D5C46]"}`}
              >
                <ArrowUpRight className="h-4 w-4" /> Donations given
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeView === "taken"}
                onClick={() => changeView("taken")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeView === "taken" ? "bg-[#28627E] text-white shadow-sm" : "text-slate-500 hover:bg-[#EDF5FA] hover:text-[#28627E]"}`}
              >
                <ArrowDownLeft className="h-4 w-4" /> Donations taken
              </button>
            </div>

            {activeView === "given" ? <section>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div><h2 className="text-xl font-bold text-slate-900">Donations given</h2><p className="mt-1 text-sm text-slate-500">Your contribution and zakat activity.</p></div>
                <HeartHandshake className="h-6 w-6 text-[#0D5C46]" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard label="Total donated" value={totalGiven} detail="All giving transactions" icon={HeartHandshake} />
                <SummaryCard label="Zakat given" value={totalZakatGiven} detail="Recorded as zakat" tone="gold" icon={Banknote} />
                <SummaryCard label="Zakat remaining" value={Math.max(zakatDue - totalZakatGiven, 0)} detail={zakatDue ? `Calculated zakat: ${formatMoney(zakatDue)}` : "Calculate zakat to track the balance"} tone="blue" icon={Banknote} />
              </div>
              <div className="mt-5"><TransactionList transactions={givenTransactions} direction="given" page={currentPages.given} onPageChange={(page) => setCurrentPages((current) => ({ ...current, given: page }))} /></div>
            </section> : <section>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div><h2 className="text-xl font-bold text-slate-900">Donations taken</h2><p className="mt-1 text-sm text-slate-500">Support received through your requests.</p></div>
                <ArrowDownLeft className="h-6 w-6 text-[#28627E]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SummaryCard label="Total received" value={totalTaken} detail="Confirmed donations across your requests" tone="blue" icon={ArrowDownLeft} />
                <SummaryCard label="Amount left" value={Math.max(requestedTotal - totalTaken, 0)} detail={requestedTotal ? `Across your request goals: ${formatMoney(requestedTotal)}` : "Create a request to track its donation goal"} tone="gold" icon={Banknote} />
              </div>
              <div className="mt-5"><TransactionList transactions={takenTransactions} direction="taken" page={currentPages.taken} onPageChange={(page) => setCurrentPages((current) => ({ ...current, taken: page }))} onConfirm={confirmReceived} /></div>
            </section>}
          </div>
        )}
      </main>
    </div>
  );
}
