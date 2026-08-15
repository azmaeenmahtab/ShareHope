import { SearchIcon } from "./Icons";
import { CHIPS } from "../data/cases";

export default function SearchHero({ userName, query, onQueryChange, activeChip, onChipChange }) {
  return (
    <section>
      <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-[#3D8D7A]">
        Hello, {userName}
      </h2>
      <h1 className="max-w-[520px] text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        Find a cause worth your trust.
      </h1>
      <p className="mt-2 max-w-[520px] text-sm sm:text-base text-slate-600 leading-relaxed">
        Every request here tells a different story about the challenge of people. Be one of the precious
        persons by sharing your support to ease these challenges — search by name, filter by what matters.
      </p>

      <div className="my-5 flex max-w-[620px] items-center gap-2.5 rounded-full border border-slate-200 bg-white py-2 pl-4 pr-2 shadow-sm focus-within:border-[#3D8D7A] focus-within:ring-2 focus-within:ring-[#3D8D7A]/20 transition-all">
        <SearchIcon className="flex-shrink-0 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder='Search by name or ID — e.g. "Rahim" or SH-10432'
          aria-label="Search donation requests by name or ID"
          className="min-w-0 flex-1 border-none bg-transparent text-sm sm:text-base text-slate-900 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#3D8D7A] hover:bg-[#2b6658] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all active:scale-95"
        >
          Search
        </button>
      </div>

      <div className="mb-2 flex flex-wrap gap-2" role="tablist" aria-label="Filter categories">
        {CHIPS.map((chip) => (
          <button
            key={chip.key}
            type="button"
            role="tab"
            aria-selected={activeChip === chip.key}
            onClick={() => onChipChange(chip.key)}
            className={`rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-all
              ${activeChip === chip.key
                ? "border-transparent bg-[#3D8D7A] text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#3D8D7A] hover:text-[#3D8D7A]"}`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </section>
  );
}
