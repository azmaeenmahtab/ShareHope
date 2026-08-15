import { SearchIcon } from "./Icons";
import { CHIPS } from "../data/cases";

export default function SearchHero({ userName, query, onQueryChange, activeChip, onChipChange }) {
  return (
    <section>
      <h2 className="mb-1.5 text-[1.15rem] font-display font-bold uppercase tracking-[.08em] text-[var(--accent)]">
        Hello, {userName}
      </h2>
      <h1 className="max-w-[520px] text-[clamp(26px,4vw,34px)] font-display font-bold text-[var(--text-strong)]">
        Find a cause worth your trust.
      </h1>
      <p className="max-w-[520px] text-[14.5px] text-[var(--text-soft)]">
        Every request here tells a different story about the challenge of people. Be one of the precious
        persons by sharing your support to ease these challenges — search by name, filter by what matters.
      </p>

      <div className="my-[22px] mb-[18px] flex max-w-[620px] items-center gap-2.5 rounded-full border-[1.5px] border-[var(--border)] bg-[var(--bg-raised)] py-2 pl-[18px] pr-2 shadow-[var(--shadow)]">
        <SearchIcon className="flex-shrink-0 text-[var(--text-soft)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder='Search by name or ID — e.g. "Rahim" or SH-10432'
          aria-label="Search donation requests by name or ID"
          className="min-w-0 flex-1 border-none bg-transparent text-base text-[var(--text-strong)] outline-none placeholder:text-[15px] placeholder:text-[var(--text-soft)]"
        />
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent bg-gradient-to-br from-[var(--leaf-600)] to-[var(--trunk-800)] px-[14px] py-2 text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(23,90,146,.6)] transition-transform active:scale-[.97]"
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
            className={`rounded-full border-[1.5px] px-4 py-[9px] text-[13px] font-semibold transition-all
              ${activeChip === chip.key
                ? "border-transparent bg-gradient-to-br from-[var(--leaf-600)] to-[var(--trunk-800)] text-white"
                : "border-[var(--border)] bg-[var(--bg-raised)] text-[var(--text-soft)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"}`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </section>
  );
}
