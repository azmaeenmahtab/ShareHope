import { useContext, useEffect, useMemo, useState } from "react";
import { ClipboardList, LoaderCircle, MapPin, RefreshCw, Search } from "lucide-react";
import { AuthContext } from "../../context/authContext";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");
const formatMoney = (value) => `৳ ${Number(value || 0).toLocaleString("en-BD")}`;

function RequestCard({ request }) {
  const goal = Number(request.goal || 0);
  const raised = Number(request.raised || 0);
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#DDEBE5] bg-white shadow-sm">
      <div className="h-40 bg-slate-100">
        <img src={request.image || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=700&auto=format&fit=crop"} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-900">{request.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" /> {request.area || "Location not added"}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${request.verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{request.verified ? "Verified" : "Pending review"}</span>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{request.desc}</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#3D8D7A]" style={{ width: `${percent}%` }} /></div>
        <div className="mt-2 flex items-center justify-between text-xs"><span className="font-semibold text-[#0D5C46]">{formatMoney(raised)} raised</span><span className="text-slate-500">of {formatMoney(goal)}</span></div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500"><span>{request.category}</span><span>ID {request.id || "pending"}</span></div>
      </div>
    </article>
  );
}

export default function MyRequests() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/request`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load your requests");
      const email = user?.email?.trim().toLowerCase();
      setRequests((data.requests || []).filter((request) => request.submitterEmail?.trim().toLowerCase() === email));
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchRequests();
  }, [user?.email]);

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return requests;
    return requests.filter((request) => [request.name, request.id, request.category, request.area].some((value) => String(value || "").toLowerCase().includes(normalizedQuery)));
  }, [requests, query]);

  if (authLoading) return <div className="flex min-h-[70vh] items-center justify-center text-sm text-slate-500"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Loading your requests...</div>;
  if (!user) return <div className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-slate-500">Please log in to view your requests.</div>;

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-5 py-8 text-slate-800 sm:px-8">
      <main className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-[#DDEBE5] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-wider text-[#0D5C46]">Your activity</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My requests</h1><p className="mt-2 text-sm text-slate-500">Track the donation requests you have submitted.</p></div>
          <button type="button" onClick={fetchRequests} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE1DA] bg-white px-4 py-2.5 text-sm font-semibold text-[#0D5C46] hover:bg-[#EAF4F0] disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
        </div>
        <div className="mt-6 flex max-w-xl items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your requests" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /></div>
        {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading ? <div className="flex items-center justify-center py-24 text-sm text-slate-500"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Loading requests...</div> : filteredRequests.length ? <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filteredRequests.map((request) => <RequestCard key={request._id || request.id} request={request} />)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-[#CFE1DA] bg-white px-6 py-16 text-center"><ClipboardList className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">{query ? "No matching requests" : "You have not submitted any requests yet"}</p><p className="mt-1 text-xs text-slate-500">Submitted requests will appear here for tracking.</p></div>}
      </main>
    </div>
  );
}
