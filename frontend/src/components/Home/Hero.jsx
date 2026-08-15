
const HeroSection = () => {
  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#0D5C46]">


      {/* Hero Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text & CTAs */}
        <div className="flex flex-col items-start space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#EAF5F1] text-[#2B7A62] text-xs font-semibold px-3.5 py-1.5 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            100% Transparent Zakat
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] text-[#0D5C46] tracking-tight">
            Connecting Hearts through Trustworthy Charity.
          </h1>

          {/* Paragraph */}
          <p className="text-[#5C736C] text-base md:text-lg leading-relaxed max-w-lg">
            ShareHope bridges the gap between those who wish to give and those
            in genuine need. Join a community dedicated to transparent,
            impactful giving.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="bg-[#0D5C46] hover:bg-[#084131] text-white font-medium px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all shadow-sm">
              Start Giving
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>

            <button className="border border-[#D1E2DC] hover:bg-[#EAF5F1] text-[#0D5C46] font-medium px-6 py-3.5 rounded-2xl transition-all">
              Calculate Zakat
            </button>
          </div>
        </div>

        {/* Right Column: Hero Image */}
        <div className="w-full flex justify-center md:justify-end">
          <div className="overflow-hidden rounded-3xl shadow-xl shadow-[#0D5C46]/5 border border-black/5">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="People collaborating at table"
              className="w-full h-auto object-cover max-h-[480px]"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
