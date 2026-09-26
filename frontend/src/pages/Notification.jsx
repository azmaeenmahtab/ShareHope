import { useEffect, useState } from "react";
import { Bell, Check, Clock3, Eye, LoaderCircle, RefreshCw, X } from "lucide-react";
import Overlay from "../components/Overlay";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");
const formatMoney = (amount) => `৳ ${Number(amount || 0).toLocaleString("en-BD")}`;

function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

export default function Notification() {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState("");
    const [error, setError] = useState("");

    const fetchNotifications = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/api/transactions`, { credentials: "include" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Unable to load notifications");
            setTransactions((data.transactions || []).filter((transaction) => transaction.direction === "taken"));
        } catch (fetchError) {
            setError(fetchError.message || "Unable to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const confirmReceived = async (transaction) => {
        setConfirmingId(transaction._id);
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/api/transactions/${transaction._id}/confirm`, {
                method: "PATCH",
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Unable to confirm donation");

            const updated = { ...transaction, ...data.transaction, status: "confirmed" };
            setTransactions((current) => current.map((item) => item._id === transaction._id ? updated : item));
            setSelectedTransaction(updated);
        } catch (confirmError) {
            setError(confirmError.message || "Unable to confirm donation");
        } finally {
            setConfirmingId("");
        }
    };

    const pendingCount = transactions.filter((transaction) => transaction.status !== "confirmed").length;

    return (
        <div className="min-h-screen bg-[#FAF8F5] px-5 py-8 text-slate-800 sm:px-8">
            <main className="mx-auto max-w-5xl">
                <header className="flex flex-col gap-4 border-b border-[#DDEBE5] pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0D5C46]">Your account</p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
                        <p className="mt-2 text-sm text-slate-500">Donations made to your requests.</p>
                    </div>
                    <button
                        type="button"
                        onClick={fetchNotifications}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE1DA] bg-white px-4 py-2.5 text-sm font-semibold text-[#0D5C46] hover:bg-[#EAF4F0] disabled:opacity-60"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                </header>

                <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                    <Bell className="h-4 w-4 text-[#0D5C46]" />
                    <span>{pendingCount ? `${pendingCount} donation${pendingCount === 1 ? "" : "s"} awaiting confirmation` : "You are all caught up"}</span>
                </div>

                {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

                {loading ? (
                    <div className="flex items-center justify-center py-24 text-sm text-slate-500">
                        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Loading notifications...
                    </div>
                ) : transactions.length ? (
                    <section className="mt-5 divide-y divide-[#E8EEEA] border-y border-[#E8EEEA]" aria-label="Donation notifications">
                        {transactions.map((transaction) => {
                            const isPending = transaction.status !== "confirmed";
                            return (
                                <article key={transaction._id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isPending ? "bg-amber-50 text-amber-700" : "bg-[#EAF4F0] text-[#0D5C46]"}`}>
                                            {isPending ? <Clock3 className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-900">{transaction.giverName || "A ShareHope user"} donated {formatMoney(transaction.amount)}</p>
                                            <p className="mt-1 truncate text-sm text-slate-500">For {transaction.requestName || transaction.counterpartyName || "your donation request"}</p>
                                            <p className="mt-1 text-xs text-slate-400">{formatDate(transaction.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3 sm:pl-4">
                                        <span className={`text-xs font-semibold ${isPending ? "text-amber-700" : "text-emerald-700"}`}>
                                            {isPending ? "Pending" : "Confirmed"}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTransaction(transaction)}
                                            className="inline-flex items-center gap-2 rounded-lg border border-[#CFE1DA] bg-white px-3.5 py-2 text-sm font-semibold text-[#0D5C46] hover:bg-[#EAF4F0]"
                                        >
                                            <Eye className="h-4 w-4" /> View details
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                ) : (
                    <div className="mt-8 border-y border-dashed border-[#CFE1DA] px-6 py-16 text-center">
                        <Bell className="mx-auto h-8 w-8 text-slate-300" />
                        <p className="mt-3 text-sm font-semibold text-slate-700">No donations yet</p>
                        <p className="mt-1 text-sm text-slate-500">Donations to your requests will appear here.</p>
                    </div>
                )}
            </main>

            <Overlay open={Boolean(selectedTransaction)} onClose={() => setSelectedTransaction(null)}>
                {selectedTransaction && (
                    <section role="dialog" aria-modal="true" aria-labelledby="donation-detail-title">
                        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-[#0D5C46]">Donation received</p>
                                <h2 id="donation-detail-title" className="mt-1 text-xl font-bold text-slate-900">Transaction details</h2>
                            </div>
                            <button type="button" onClick={() => setSelectedTransaction(null)} aria-label="Close details" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                                <X className="h-5 w-5" />
                            </button>
                        </header>

                        <div className="grid grid-cols-2 gap-x-5 gap-y-5 px-6 py-6 text-sm">
                            <div className="col-span-2 border-b border-slate-100 pb-4">
                                <p className="text-xs text-slate-400">Amount</p>
                                <p className="mt-1 text-2xl font-bold text-[#0D5C46]">{formatMoney(selectedTransaction.amount)}</p>
                            </div>
                            <div><p className="text-xs text-slate-400">Donor</p><p className="mt-1 font-semibold text-slate-800">{selectedTransaction.giverName || "ShareHope user"}</p></div>
                            <div><p className="text-xs text-slate-400">Request</p><p className="mt-1 font-semibold text-slate-800">{selectedTransaction.requestName || selectedTransaction.counterpartyName || "Donation request"}</p></div>
                            <div><p className="text-xs text-slate-400">Payment method</p><p className="mt-1 font-semibold text-slate-800">{selectedTransaction.paymentMethod || "Not specified"}</p></div>
                            <div><p className="text-xs text-slate-400">Purpose</p><p className="mt-1 font-semibold capitalize text-slate-800">{selectedTransaction.purpose || "donation"}</p></div>
                            <div><p className="text-xs text-slate-400">Date</p><p className="mt-1 font-semibold text-slate-800">{formatDate(selectedTransaction.createdAt)}</p></div>
                            <div><p className="text-xs text-slate-400">Status</p><p className="mt-1 font-semibold text-slate-800">{selectedTransaction.status === "confirmed" ? "Confirmed" : "Pending confirmation"}</p></div>
                            {selectedTransaction.transactionId && <div className="col-span-2"><p className="text-xs text-slate-400">Transaction ID</p><p className="mt-1 break-all font-semibold text-slate-800">{selectedTransaction.transactionId}</p></div>}
                        </div>

                        <footer className="border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                            {selectedTransaction.status !== "confirmed" ? (
                                <button
                                    type="button"
                                    onClick={() => confirmReceived(selectedTransaction)}
                                    disabled={confirmingId === selectedTransaction._id}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D5C46] px-4 py-3 text-sm font-semibold text-white hover:bg-[#094433] disabled:opacity-60"
                                >
                                    {confirmingId === selectedTransaction._id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    Confirm donation received
                                </button>
                            ) : (
                                <p className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-emerald-700"><Check className="h-4 w-4" /> Donation confirmed</p>
                            )}
                        </footer>
                    </section>
                )}
            </Overlay>
        </div>
    );
}