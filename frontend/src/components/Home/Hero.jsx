import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

// User-provided photographs of people suffering and in need
import poorPeople1 from "../../assets/poorpeople1 (1).jpg";
import poorPeople2 from "../../assets/poorpeople1 (2).jpg";

const SLIDES = [
  {
    id: 1,
    image: poorPeople1,
    alt: "Impoverished family with young children seeking aid on roadside"
  },
  {
    id: 2,
    image: poorPeople2,
    alt: "Impoverished father and children struggling in market street"
  }
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  // Reliable auto-swap timer: changes picture every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === 0 ? 1 : 0));
    }, 4500);

    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrent((prev) => (prev === 0 ? 1 : 0));
  };

  const prevSlide = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrent((prev) => (prev === 0 ? 1 : 0));
  };

  const goToSlide = (idx) => {
    setCurrent(idx);
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] text-[#0D5C46]">
      {/* Organic ambient background glow */}
      <div 
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-35"
        style={{ background: "radial-gradient(circle, #D5EBE1 0%, transparent 70%)" }}
      />
      <div 
        className="pointer-events-none absolute top-1/2 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, #E3F1EA 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Mission, Headlines & CTAs */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-7 z-10">
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-extrabold tracking-tight leading-[1.14] text-[#0D5C46]">
                Connecting Hearts, <br />
                <span className="text-[#14795D] ">
                  Relieving Suffering.
                </span>
              </h1>
              <p className="text-[#4E665F] text-base sm:text-lg leading-relaxed max-w-lg">
                Behind every statistic lies a vulnerable family enduring hardship. 
                <strong className="text-[#0D5C46] font-semibold"> ShareHope </strong> 
                delivers your compassionate support directly to verified people in real need—with complete transparency and zero platform fees.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1 w-full sm:w-auto">
              <Link
                to="/requests"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0D5C46] hover:bg-[#094433] text-[#FAF8F5] text-base font-semibold px-8 py-3.5 rounded-2xl transition-all duration-200 shadow-md shadow-[#0D5C46]/15 hover:shadow-lg hover:shadow-[#0D5C46]/25 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Giving</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>

              <Link
                to="/donation-request"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#F2F8F5] text-[#0D5C46] border border-[#C6DFD5] text-base font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 shadow-xs hover:border-[#0D5C46] cursor-pointer"
              >
                <span>Request Donation</span>
              </Link>
            </div>

            {/* Impact Highlights Strip */}
            <div className="pt-6 border-t border-[#E5EFEA] w-full grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#0D5C46] tracking-tight">100%</p>
                <p className="text-xs sm:text-sm font-medium text-[#5E7972] mt-0.5">Direct Policy</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#0D5C46] tracking-tight">10,000+</p>
                <p className="text-xs sm:text-sm font-medium text-[#5E7972] mt-0.5">Lives Touched</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#0D5C46] tracking-tight">0%</p>
                <p className="text-xs sm:text-sm font-medium text-[#5E7972] mt-0.5">Admin Fee</p>
              </div>
            </div>

          </div>

          {/* Right Column: Clean, Large Photographic Auto-Carousel */}
          <div className="lg:col-span-7 w-full">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-[#0D5C46]/15 border border-[#DFECE6] bg-[#0A3D30]">
              
              {/* Picture-Only Container (Big Viewport) */}
              <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] lg:h-[580px] overflow-hidden">
                {SLIDES.map((slide, idx) => {
                  const isActive = idx === current;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  );
                })}

                {/* Left Navigation Arrow - Always accessible and clickable */}
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous picture"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] active:scale-95 text-[#0D5C46] backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:shadow-xl cursor-pointer hover:scale-105"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                </button>

                {/* Right Navigation Arrow - Always accessible and clickable */}
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next picture"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] active:scale-95 text-[#0D5C46] backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:shadow-xl cursor-pointer hover:scale-105"
                >
                  <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                </button>

                {/* Minimalist Floating Indicator Dots (No Loader, No Text) */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-[#06241C]/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goToSlide(i)}
                      aria-label={`Go to picture ${i + 1}`}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        i === current
                          ? "w-7 h-2.5 bg-[#FAF8F5]"
                          : "w-2.5 h-2.5 bg-[#FAF8F5]/50 hover:bg-[#FAF8F5]/80"
                      }`}
                    />
                  ))}
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
