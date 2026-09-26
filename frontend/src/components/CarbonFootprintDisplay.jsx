import { useState } from "react";
import { useCarbonFootprint } from "react-carbon-footprint";
import { Leaf, ChevronUp, ChevronDown, Activity, Zap } from "lucide-react";

export default function CarbonFootprintDisplay() {
  const [gCO2, bytesTransferred] = useCarbonFootprint();
  const [isExpanded, setIsExpanded] = useState(false);

  // Format bytes to human-readable
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Determine emission level for color coding
  const getEmissionLevel = (grams) => {
    if (grams < 0.5) return { label: "Excellent", color: "#10b981", bg: "#ecfdf5" };
    if (grams < 1.5) return { label: "Good", color: "#22c55e", bg: "#f0fdf4" };
    if (grams < 3) return { label: "Moderate", color: "#eab308", bg: "#fefce8" };
    return { label: "High", color: "#ef4444", bg: "#fef2f2" };
  };

  const level = getEmissionLevel(gCO2);

  return (
    <div
      className="carbon-footprint-widget"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Collapsed / Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="carbon-toggle-btn"
        aria-label="Toggle carbon footprint display"
        title="Network Carbon Footprint"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: isExpanded ? "10px 16px" : "10px 14px",
          border: "1px solid #D4E9E2",
          borderRadius: isExpanded ? "16px 16px 0 0" : "16px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px rgba(13, 92, 70, 0.12), 0 1px 4px rgba(0,0,0,0.06)",
          cursor: "pointer",
          color: "#0D5C46",
          fontSize: "13px",
          fontWeight: 600,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: isExpanded ? "280px" : "auto",
        }}
      >
        <Leaf
          style={{
            width: 16,
            height: 16,
            color: level.color,
            transition: "color 0.3s ease",
          }}
        />
        <span style={{ flex: 1, textAlign: "left" }}>
          {gCO2.toFixed(3)}g CO₂
        </span>
        {isExpanded ? (
          <ChevronDown style={{ width: 14, height: 14, opacity: 0.5 }} />
        ) : (
          <ChevronUp style={{ width: 14, height: 14, opacity: 0.5 }} />
        )}
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div
          className="carbon-panel"
          style={{
            width: "280px",
            background: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(12px)",
            border: "1px solid #D4E9E2",
            borderTop: "none",
            borderRadius: "0 0 16px 16px",
            padding: "16px",
            boxShadow: "0 8px 32px rgba(13, 92, 70, 0.12), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "999px",
              background: level.bg,
              color: level.color,
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: level.color,
                animation: "pulse 2s infinite",
              }}
            />
            {level.label}
          </div>

          {/* Metrics */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* CO2 Emissions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "12px",
                background: "#F2F8F5",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  background: "#0D5C46",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap style={{ width: 16, height: 16, color: "white" }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#5C7E72",
                    fontWeight: 500,
                    marginBottom: "2px",
                  }}
                >
                  CO₂ Emissions
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    color: "#0D5C46",
                    fontWeight: 700,
                  }}
                >
                  {gCO2.toFixed(4)}{" "}
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "#5C7E72" }}>
                    grams CO₂eq
                  </span>
                </div>
              </div>
            </div>

            {/* Bytes Transferred */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "12px",
                background: "#F2F8F5",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  background: "#0D5C46",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Activity style={{ width: 16, height: 16, color: "white" }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#5C7E72",
                    fontWeight: 500,
                    marginBottom: "2px",
                  }}
                >
                  Data Transferred
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    color: "#0D5C46",
                    fontWeight: 700,
                  }}
                >
                  {formatBytes(bytesTransferred)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p
            style={{
              fontSize: "10px",
              color: "#94a3b8",
              marginTop: "12px",
              lineHeight: "1.4",
              textAlign: "center",
            }}
          >
            Estimates based on network data transfer during this session
            <br />
            using the{" "}
            <a
              href="https://sustainablewebdesign.org/calculating-digital-emissions/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0D5C46", textDecoration: "underline" }}
            >
              Sustainable Web Design
            </a>{" "}
            model
          </p>
        </div>
      )}

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .carbon-toggle-btn:hover {
          box-shadow: 0 6px 28px rgba(13, 92, 70, 0.18), 0 2px 6px rgba(0,0,0,0.08) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
