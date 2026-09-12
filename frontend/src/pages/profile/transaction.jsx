import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Banknote, HeartHandshake, LoaderCircle, RefreshCw } from "lucide-react";

const formatMoney = (value) => `৳ ${Number(value || 0).toLocaleString("en-BD")}`;

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

function TransactionCard({ transaction, direction }) {
  const isGiven = direction === "given";
  const counterpartyLabel = isGiven ? "Given to" : "Received from";

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
          <p className="text-slate-400">Transaction ID</p>
          <p className="mt-1 truncate font-semibold text-slate-700">{transaction.transactionId || "Pending confirmation"}</p>
        </div>
        <div>
          <p className="text-slate-400">Date</p>
          <p className="mt-1 font-semibold text-slate-700">{new Date(transaction.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </article>
  );
}

function TransactionList({ transactions, direction }) {
  if (!transactions.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#CFE1DA] bg-white px-6 py-10 text-center">
        <Banknote className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-slate-700">No {direction} transactions yet</p>
        <p className="mt-1 text-xs text-slate-500">Your transaction history will appear here after a confirmed payment.</p>
      </div>
    );
  }

  return <div className="space-y-3">{transactions.map((transaction) => <TransactionCard key={transaction._id} transaction={transaction} direction={direction} />)}</div>;
}

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("given");

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/transactions`, { credentials: "include" });
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
  }, []);

  const givenTransactions = useMemo(() => transactions.filter((item) => item.direction === "given"), [transactions]);
  const takenTransactions = useMemo(() => transactions.filter((item) => item.direction === "taken"), [transactions]);
  const totalGiven = useMemo(() => givenTransactions.reduce((total, item) => total + Number(item.amount || 0), 0), [givenTransactions]);
  const totalZakatGiven = useMemo(() => givenTransactions.filter((item) => item.purpose === "zakat").reduce((total, item) => total + Number(item.amount || 0), 0), [givenTransactions]);
  const zakatDue = getSavedZakatAmount();
  const totalTaken = useMemo(() => takenTransactions.reduce((total, item) => total + Number(item.amount || 0), 0), [takenTransactions]);
  const requestedTotal = useMemo(() => takenTransactions.reduce((total, item) => total + Number(item.requestedAmount || 0), 0), [takenTransactions]);

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
                onClick={() => setActiveView("given")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeView === "given" ? "bg-[#0D5C46] text-white shadow-sm" : "text-slate-500 hover:bg-[#EAF4F0] hover:text-[#0D5C46]"}`}
              >
                <ArrowUpRight className="h-4 w-4" /> Donations given
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeView === "taken"}
                onClick={() => setActiveView("taken")}
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
              <div className="mt-5"><TransactionList transactions={givenTransactions} direction="given" /></div>
            </section> : <section>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div><h2 className="text-xl font-bold text-slate-900">Donations taken</h2><p className="mt-1 text-sm text-slate-500">Support received through your requests.</p></div>
                <ArrowDownLeft className="h-6 w-6 text-[#28627E]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SummaryCard label="Total received" value={totalTaken} detail="Confirmed and pending receipts" tone="blue" icon={ArrowDownLeft} />
                <SummaryCard label="Amount left" value={Math.max(requestedTotal - totalTaken, 0)} detail={requestedTotal ? `Across recorded request goals: ${formatMoney(requestedTotal)}` : "Request goals will appear with received records"} tone="gold" icon={Banknote} />
              </div>
              <div className="mt-5"><TransactionList transactions={takenTransactions} direction="taken" /></div>
            </section>}
          </div>
        )}
      </main>
    </div>
  );
}
