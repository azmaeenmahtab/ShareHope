// Donation request records shown across the dashboard.
// `percent` drives the growth-bar width and should stay in sync with raised/goal.
export const CASES = {
  1: {
    id: "SH-10432",
    name: "Karim Family — A warrior father",
    type: "Individual",
    verified: true,
    urgent: false,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbDiyQOo_Vi-ZIfF0JT3i5OJNtxe26KKchx64WxjfuNQ&s=10",
    desc:
      "Single father of three in Natunbazar needs blankets and a month's groceries after losing rickshaw work to an injury. Case verified with local imam's letter and hospital discharge note.",
    raised: "৳ 32,000 raised",
    goal: "৳ 50,000",
    percent: 64,
    area: "Natunbazar Busstand, Dhaka",
    category: "Family support",
    submitted: "03 Aug 2026",
    methods: "bKash, Nagad, Bank, Cash",
    docs: ["📄 NID copy", "📄 Imam letter", "📄 Hospital note"],
  },
  2: {
    id: "SH-20117",
    name: "Noor Widows' Trust",
    type: "Organization",
    verified: true,
    urgent: false,
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=700&auto=format&fit=crop",
    desc:
      "Local trust supporting 14 widows in Vatara with monthly ration and school fees for their children. Registered NGO, audited annually.",
    raised: "৳ 61,500 raised",
    goal: "৳ 150,000",
    percent: 41,
    area: "Vatara, Dhaka",
    category: "Financial support",
    submitted: "28 Jul 2026",
    methods: "bKash, Nagad, Bank, Cash",
    docs: ["📄 Audit copy", "📄 NGO Certificate", "📄 Contact information"],
  },
  3: {
    id: "SH-30582",
    name: "Fahim — Emergency Dialysis",
    type: "Individual",
    verified: true,
    urgent: true,
    image:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=700&auto=format&fit=crop",
    desc:
      "22-year-old needs immediate dialysis sessions this week; hospital has confirmed the treatment plan and provided a signed cost estimate.",
    raised: "৳ 9,000 raised",
    goal: "৳ 50,000",
    percent: 18,
    area: "Natunbazar Busstand, Dhaka",
    category: "Family support",
    submitted: "03 Aug 2026",
    methods: "bKash, Nagad, Bank, Cash",
    docs: ["📄 NID copy", "📄 Imam letter", "📄 Hospital note"],
  },
  4: {
    id: "SH-40261",
    name: "Char Kukri-Mukri Flood Relief",
    type: "Organization",
    verified: true,
    urgent: true,
    image:
      "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=700&auto=format&fit=crop",
    desc:
      "40 families displaced by flash flooding need clean water, tarpaulin and dry food within 72 hours. Coordinated with local union council.",
    raised: "৳ 87,000 raised",
    goal: "৳ 300,000",
    percent: 29,
    area: "Natunbazar Busstand, Dhaka",
    category: "Family support",
    submitted: "03 Aug 2026",
    methods: "bKash, Nagad, Bank, Cash",
    docs: ["📄 NID copy", "📄 Imam letter", "📄 Hospital note"],
  },
  5: {
    id: "SH-11890",
    name: "Al-Amin Orphan Care",
    type: "Organization",
    verified: true,
    urgent: false,
    image:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=700&auto=format&fit=crop",
    desc:
      "Runs a 60-child orphanage in Savar; monthly Zakat sponsorship covers food, tuition and healthcare for every child on record.",
    raised: "৳ 219,000 raised",
    goal: "৳ 300,000",
    percent: 73,
    area: "Natunbazar Busstand, Dhaka",
    category: "Family support",
    submitted: "03 Aug 2026",
    methods: "bKash, Nagad, Bank, Cash",
    docs: ["📄 NID copy", "📄 Imam letter", "📄 Hospital note"],
  },
};

// Which cases render under each filterable category section, in order.
export const SECTIONS = [
  {
    key: "nearby",
    title: "Nearby your area",
    hint: "Bashundhara, Dhaka · within 5 km",
    moreLabel: "View more nearby requests",
    moreHref: "/category?category=nearby",
    caseIds: [1, 2],
  },
  {
    key: "urgent",
    title: "Urgent needs",
    hint: "Time-sensitive · Emergency",
    moreLabel: "View more urgent needs",
    moreHref: "/category?category=urgent",
    caseIds: [3, 4],
  },
  {
    key: "verified",
    title: "Verified Requests",
    hint: "Documents verified by ShareHope authority",
    moreLabel: "View more verified organizations",
    moreHref: "/category?category=verified",
    caseIds: [5],
  },
];

export const CHIPS = [
  { key: "all", label: "All requests" },
  { key: "nearby", label: "Nearby your area" },
  { key: "urgent", label: "Urgent needs" },
  { key: "verified", label: "Verified only" },
  { key: "family", label: "Select Category" },
];

// Payment method tiles shown in the "choose payment method" modal.
export const WALLET_METHODS = {
  bkash: { label: "bKash", dotBg: "#e2136e", dotText: "bK" },
  nagad: { label: "Nagad", dotBg: "#f6921e", dotText: "N" },
  rocket: { label: "Rocket", dotBg: "#8c3494", dotText: "R" },
};

export const OFFLINE_METHODS = {
  bank: {
    label: "Bank transfer",
    dotBg: "#1e293b",
    dotText: "🏦",
    line1: "Bank · Account name",
    line2: "ShareHope Foundation — A/C 2011 5567 002",
  },
  cash: {
    label: "Cash",
    dotBg: "#3D8D7A",
    dotText: "৳",
    line1: "Hand-to-hand collection",
    line2: "A verified collector will contact you to arrange pickup",
  },
};
