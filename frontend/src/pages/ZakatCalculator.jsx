import { useContext, useEffect, useState } from "react";
import { Calculator, CheckCircle2, Info, LockKeyhole, RotateCcw } from "lucide-react";
import { AuthContext } from "../context/authContext";

const INITIAL_VALUES = {
	cash: "", bank: "", gold: "", silver: "", investments: "", business: "", receivables: "", liabilities: "", nisab: "600000",
};

const FIELDS = [
	["cash", "Cash at hand", "Money kept with you"],
	["bank", "Bank and mobile wallet balance", "Savings and current balances"],
	["gold", "Gold value", "Current market value"],
	["silver", "Silver value", "Current market value"],
	["investments", "Investments and shares", "Zakatable investments"],
	["business", "Business inventory", "Goods held for sale"],
	["receivables", "Money owed to you", "Recoverable loans or payments"],
	["liabilities", "Short-term liabilities", "Debts due within one lunar year"],
];

const amount = (value) => Math.max(0, Number(value) || 0);
const money = (value) => `৳ ${Number(value || 0).toLocaleString("en-BD")}`;

export default function ZakatCalculator() {
	const { user, loading: authLoading } = useContext(AuthContext);
	const [values, setValues] = useState(INITIAL_VALUES);
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		try {
			const saved = JSON.parse(localStorage.getItem("zakatResult") || "null");
			if (saved) {
				setValues({ ...INITIAL_VALUES, ...saved.inputs });
				setResult(saved);
			}
		} catch {
			localStorage.removeItem("zakatResult");
		}
	}, []);

	const handleChange = (event) => {
		setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
		setError("");
	};

	const calculate = (event) => {
		event.preventDefault();
		const assets = FIELDS.filter(([key]) => key !== "liabilities").reduce((total, [key]) => total + amount(values[key]), 0);
		const liabilities = amount(values.liabilities);
		const netAssets = Math.max(assets - liabilities, 0);
		const nisab = amount(values.nisab);
		if (!nisab) {
			setError("Enter a valid Nisab threshold to calculate your Zakat.");
			return;
		}
		const eligible = netAssets >= nisab;
		const zakat = eligible ? netAssets * 0.025 : 0;
		const savedResult = { assets, liabilities, netAssets, nisab, zakat, eligible, inputs: values, calculatedAt: new Date().toISOString() };
		localStorage.setItem("zakatResult", JSON.stringify(savedResult));
		localStorage.setItem("zakatAmount", String(zakat));
		setResult(savedResult);
	};

	const reset = () => {
		setValues(INITIAL_VALUES);
		setResult(null);
		setError("");
		localStorage.removeItem("zakatResult");
		localStorage.removeItem("zakatAmount");
	};

	if (authLoading) return <div className="flex min-h-[70vh] items-center justify-center text-sm text-slate-500">Loading Zakat calculator...</div>;
	if (!user) return <div className="mx-auto max-w-2xl px-6 py-20 text-center text-sm text-slate-500">Please log in to use the Zakat calculator.</div>;
	if (!user.isMuslim) return <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF8F5] px-6 py-16"><div className="max-w-md rounded-3xl border border-[#DDEBE5] bg-white p-8 text-center shadow-sm"><LockKeyhole className="mx-auto h-10 w-10 text-[#0D5C46]" /><h1 className="mt-4 text-2xl font-bold text-slate-900">Zakat calculator unavailable</h1><p className="mt-2 text-sm leading-relaxed text-slate-500">This calculator is available only for Muslim users. Update your Muslim status from My Profile to continue.</p></div></div>;

	return (
		<div className="min-h-screen bg-[#FAF8F5] px-5 py-8 text-slate-800 sm:px-8">
			<main className="mx-auto max-w-6xl">
				<div className="mb-8 max-w-2xl"><p className="text-xs font-bold uppercase tracking-wider text-[#0D5C46]">For Muslim users</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Zakat calculator</h1><p className="mt-2 text-sm leading-relaxed text-slate-500">Enter your zakatable assets and short-term liabilities. The calculator uses the standard 2.5% rate when your net assets reach Nisab.</p></div>
				<div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
					<form onSubmit={calculate} className="rounded-3xl border border-[#DDEBE5] bg-white p-6 shadow-sm sm:p-8">
						<div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4F0] text-[#0D5C46]"><Calculator className="h-5 w-5" /></span><div><h2 className="text-lg font-bold text-slate-900">Your financial information</h2><p className="text-sm text-slate-500">Use current values in Bangladeshi Taka.</p></div></div>
						<div className="grid gap-5 sm:grid-cols-2">
							{FIELDS.map(([key, label, hint]) => <label key={key} className="text-sm font-semibold text-slate-700">{label}<span className="mt-1 block text-[11px] font-normal text-slate-400">{hint}</span><div className="relative mt-1.5"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">৳</span><input name={key} type="number" min="0" value={values[key]} onChange={handleChange} placeholder="0" className="w-full rounded-xl border border-slate-200 py-3 pl-8 pr-4 text-sm font-normal outline-none focus:border-[#3D8D7A] focus:ring-2 focus:ring-[#3D8D7A]/20" /></div></label>)}
							<label className="text-sm font-semibold text-slate-700">Nisab threshold<span className="mt-1 block text-[11px] font-normal text-slate-400">Current threshold recommended by your scholar</span><div className="relative mt-1.5"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">৳</span><input name="nisab" type="number" min="1" value={values.nisab} onChange={handleChange} className="w-full rounded-xl border border-slate-200 py-3 pl-8 pr-4 text-sm font-normal outline-none focus:border-[#3D8D7A] focus:ring-2 focus:ring-[#3D8D7A]/20" /></div></label>
						</div>
						{error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
						<div className="mt-8 flex flex-wrap justify-end gap-3"><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><RotateCcw className="h-4 w-4" /> Reset</button><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#0D5C46] px-5 py-3 text-sm font-semibold text-white hover:bg-[#094433]"><Calculator className="h-4 w-4" /> Calculate Zakat</button></div>
					</form>
					<aside className="h-fit rounded-3xl border border-[#DDEBE5] bg-[#0D5C46] p-6 text-white shadow-sm sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-[#B3D8A8]">Your result</p>{!result ? <><h2 className="mt-3 text-2xl font-bold">Ready when you are</h2><p className="mt-2 text-sm leading-relaxed text-white/70">Complete the form to see your net zakatable assets and estimated annual Zakat.</p></> : <><h2 className="mt-3 text-4xl font-bold">{money(result.zakat)}</h2><p className="mt-1 text-sm text-white/70">Estimated Zakat due</p><div className="mt-8 space-y-4 border-t border-white/15 pt-5 text-sm"><div className="flex justify-between gap-4"><span className="text-white/65">Total assets</span><strong>{money(result.assets)}</strong></div><div className="flex justify-between gap-4"><span className="text-white/65">Liabilities</span><strong>- {money(result.liabilities)}</strong></div><div className="flex justify-between gap-4"><span className="text-white/65">Net zakatable assets</span><strong>{money(result.netAssets)}</strong></div><div className="flex justify-between gap-4"><span className="text-white/65">Nisab threshold</span><strong>{money(result.nisab)}</strong></div></div><div className="mt-6 flex items-start gap-2 rounded-2xl bg-white/10 p-3 text-xs leading-relaxed text-white/80"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B3D8A8]" />{result.eligible ? "Your assets meet Nisab. A 2.5% annual Zakat estimate has been saved to your account." : "Your net assets are below Nisab, so no Zakat is due based on these inputs."}</div></> }<div className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-white/55"><Info className="mt-0.5 h-4 w-4 shrink-0" />This is an estimate, not a religious ruling. Consult a qualified scholar for personal guidance.</div></aside>
				</div>
			</main>
		</div>
	);
}
