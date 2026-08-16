import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HandHeart,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ShieldCheck,
  FileText,
  Phone,
  User,
  MapPin,
  Plus,
  X,
  Building,
  Users,
  Eye,
  Clock,
  Sparkles,
  ArrowRight,
  CreditCard,
  Mail,
  Check,
} from "lucide-react";
import Footer from "../components/shared/Footer";
import DetailsModal from "../components/modals/DetailsModal";
import Overlay from "../components/Overlay";
import Toast from "../components/Toast";

// Sample preset images for easy selection by requesters
const SAMPLE_IMAGES = [
  {
    label: "Medical & Emergency",
    url: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=700&auto=format&fit=crop",
  },
  {
    label: "Family & Ration",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbDiyQOo_Vi-ZIfF0JT3i5OJNtxe26KKchx64WxjfuNQ&s=10",
  },
  {
    label: "Education & Children",
    url: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=700&auto=format&fit=crop",
  },
  {
    label: "Disaster Relief",
    url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=700&auto=format&fit=crop",
  },
  {
    label: "Community & Trust",
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=700&auto=format&fit=crop",
  },
];

const PRESET_DOCS = [
  "📄 NID copy",
  "📄 Doctor's prescription / Note",
  "📄 Hospital cost estimate",
  "📄 Imam / Local leader letter",
  "📄 Income / Unemployment certificate",
  "📄 Utility bill",
  "📄 NGO / Trust Certificate",
  "📄 Student ID",
];

const PAYMENT_OPTIONS = [
  { id: "bKash", label: "bKash", color: "border-pink-200 bg-pink-50/60 text-pink-700" },
  { id: "Nagad", label: "Nagad", color: "border-amber-200 bg-amber-50/60 text-amber-700" },
  { id: "Rocket", label: "Rocket", color: "border-purple-200 bg-purple-50/60 text-purple-700" },
  { id: "Bank", label: "Bank Transfer", color: "border-slate-200 bg-slate-100 text-slate-700" },
  { id: "Cash", label: "Cash Collection", color: "border-emerald-200 bg-emerald-50/60 text-emerald-700" },
];

const CATEGORIES = [
  "Family support",
  "Financial support",
  "Medical & Health",
  "Education & Tuition",
  "Food & Monthly Ration",
  "Disaster & Flood Relief",
  "Emergency Dialysis",
  "Orphan Care",
  "Shelter & Housing",
];

export default function DonationRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    type: "Individual",
    category: "Family support",
    goal: "",
    area: "",
    desc: "",
    urgent: false,
    methods: ["bKash", "Nagad", "Bank", "Cash"],
    docs: ["📄 NID copy", "📄 Imam letter"],
    image: SAMPLE_IMAGES[0].url,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    relationship: "Self",
  });

  const [customDoc, setCustomDoc] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleMethod = (methodId) => {
    setFormData((prev) => {
      const exists = prev.methods.includes(methodId);
      const updated = exists
        ? prev.methods.filter((m) => m !== methodId)
        : [...prev.methods, methodId];
      return { ...prev, methods: updated };
    });
  };

  const toggleDoc = (docName) => {
    setFormData((prev) => {
      const exists = prev.docs.includes(docName);
      const updated = exists
        ? prev.docs.filter((d) => d !== docName)
        : [...prev.docs, docName];
      return { ...prev, docs: updated };
    });
  };

  const addCustomDoc = () => {
    if (!customDoc.trim()) return;
    const formatted = customDoc.startsWith("📄") ? customDoc.trim() : `📄 ${customDoc.trim()}`;
    if (!formData.docs.includes(formatted)) {
      setFormData((prev) => ({ ...prev, docs: [...prev.docs, formatted] }));
    }
    setCustomDoc("");
  };

  const removeDoc = (docToRemove) => {
    setFormData((prev) => ({
      ...prev,
      docs: prev.docs.filter((d) => d !== docToRemove),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Please enter the title or beneficiary name";
    if (!formData.goal || Number(formData.goal) <= 0)
      newErrors.goal = "Please enter a valid targeted goal amount";
    if (!formData.area.trim()) newErrors.area = "Please specify the location or area";
    if (!formData.desc.trim() || formData.desc.trim().length < 20)
      newErrors.desc = "Please provide a detailed description (at least 20 characters)";
    if (!formData.contactName.trim()) newErrors.contactName = "Please enter contact person name";
    if (!formData.contactPhone.trim()) newErrors.contactPhone = "Please enter a valid phone number";
    if (formData.methods.length === 0)
      newErrors.methods = "Select at least one preferred payment/transfer method";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      triggerToast("Please fill in all required fields marked in red.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API request processing
    setTimeout(() => {
      const generatedId = `SH-${Math.floor(10000 + Math.random() * 90000)}`;
      const formattedData = {
        ...formData,
        id: generatedId,
        goal: `৳ ${Number(formData.goal).toLocaleString("en-IN")}`,
        raised: "৳ 0 raised",
        percent: 0,
        submitted: "Just now",
        methods: formData.methods.join(", "),
        verified: false,
      };

      setIsSubmitting(false);
      setSubmittedData(formattedData);
      triggerToast("Donation request submitted successfully!");
    }, 1000);
  };

  // Preview object for DetailsModal and Live Card
  const previewCase = {
    id: submittedData ? submittedData.id : "SH-PREVIEW",
    name: formData.name || "Recipient / Request Title",
    type: formData.type,
    verified: false,
    urgent: formData.urgent,
    image:
      formData.image ||
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=700&auto=format&fit=crop",
    desc:
      formData.desc ||
      "Provide details about the cause, family background, medical condition, or urgent need to help donors understand your request.",
    raised: "৳ 0 raised",
    goal: formData.goal ? `৳ ${Number(formData.goal).toLocaleString("en-IN")}` : "৳ 50,000",
    percent: 0,
    area: formData.area || "Area / Location (e.g. Natunbazar, Dhaka)",
    category: formData.category,
    submitted: "Pending Verification",
    methods: formData.methods.length > 0 ? formData.methods.join(", ") : "bKash, Nagad, Bank, Cash",
    docs: formData.docs.length > 0 ? formData.docs : ["📄 Pending verification"],
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 pb-16 pt-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner / Header */}
        <div className="mb-8 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden bg-gradient-to-r from-[#2b6658] via-[#3D8D7A] to-[#4fa390]">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute right-32 -top-12 w-48 h-48 rounded-full bg-[#B3D8A8]/20 blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-4 border border-white/20">
              <HandHeart className="w-4 h-4 text-[#FBFFE4]" />
              <span>ShareHope Support Request Portal</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Submit a Donation Request
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              If you or someone you know requires emergency medical, financial, or relief assistance,
              fill out the form below. ShareHope verifies each case to ensure 100% transparency for our donor community.
            </p>

            {/* Quick stats trust bar */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-white/80 border-t border-white/15 pt-4">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B3D8A8]" /> 24-48h Verification
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#B3D8A8]" /> Direct Mobile & Bank Transfers
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FBFFE4]" /> 0% Platform Commission
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Form (Left) & Live Preview / Guidelines (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Container */}
          <div className="lg:col-span-12 max-w-4xl mx-auto w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#3D8D7A]" /> Request Information Form
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Fields marked with <span className="text-red-500">*</span> are mandatory for verification.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Eye className="w-3.5 h-3.5 text-[#3D8D7A]" /> Preview
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1: GENERAL INFORMATION */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D8D7A] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> 1. Beneficiary & Category
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Request Title / Beneficiary Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Karim Family — A warrior father or Fahim — Emergency Dialysis"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 bg-white placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-[#3D8D7A]/30 ${
                      errors.name ? "border-red-300 bg-red-50/30" : "border-slate-200"
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Recipient Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#3D8D7A]/30 appearance-none"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Family">Family</option>
                        <option value="Organization">Organization</option>
                        <option value="Community">Community</option>
                      </select>
                      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#3D8D7A]/30 appearance-none"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgency Toggle */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-red-100 text-red-600 shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">
                        Is this an Urgent Emergency Request?
                      </span>
                      <p className="text-xs text-slate-500">
                        Check this if assistance is needed within 24–72 hours (e.g. ICU treatment, natural disaster).
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      name="urgent"
                      checked={formData.urgent}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
              </div>

              <hr className="border-slate-100 my-6" />

              {/* SECTION 2: FINANCIAL & LOCATION */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D8D7A] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> 2. Target Goal & Location
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Target Goal Amount (BDT ৳) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                        ৳
                      </span>
                      <input
                        type="number"
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        placeholder="50000"
                        className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm text-slate-800 bg-white placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-[#3D8D7A]/30 ${
                          errors.goal ? "border-red-300 bg-red-50/30" : "border-slate-200"
                        }`}
                      />
                    </div>
                    {errors.goal && <p className="mt-1 text-xs text-red-500 font-medium">{errors.goal}</p>}
                    
                    {/* Goal presets */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[15000, 30000, 50000, 100000, 150000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, goal: String(amt) }))}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 bg-slate-50 text-slate-600 hover:border-[#3D8D7A] hover:bg-emerald-50 transition"
                        >
                          ৳ {amt.toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Area / Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="e.g. Natunbazar, Vatara, Dhaka"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-800 bg-white placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-[#3D8D7A]/30 ${
                          errors.area ? "border-red-300 bg-red-50/30" : "border-slate-200"
                        }`}
                      />
                    </div>
                    {errors.area && <p className="mt-1 text-xs text-red-500 font-medium">{errors.area}</p>}
                  </div>
                </div>

                {/* Preferred Payment Methods */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Accepted Payment Channels <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PAYMENT_OPTIONS.map((opt) => {
                      const isSelected = formData.methods.includes(opt.id);
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => toggleMethod(opt.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                            isSelected
                              ? `${opt.color} ring-2 ring-[#3D8D7A]/30 shadow-sm`
                              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.methods && <p className="mt-1 text-xs text-red-500 font-medium">{errors.methods}</p>}
                </div>
              </div>

              <hr className="border-slate-100 my-6" />

              {/* SECTION 3: DESCRIPTION & STORY */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D8D7A] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> 3. Detailed Request Story
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Describe the Need & Background <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="desc"
                    rows={4}
                    value={formData.desc}
                    onChange={handleInputChange}
                    placeholder="Explain the background, reason for request, monthly income/family situation, medical diagnosis, or breakdown of how funds will be spent..."
                    className={`w-full p-4 rounded-xl border text-sm text-slate-800 bg-white placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-[#3D8D7A]/30 ${
                      errors.desc ? "border-red-300 bg-red-50/30" : "border-slate-200"
                    }`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.desc ? (
                      <p className="text-xs text-red-500 font-medium">{errors.desc}</p>
                    ) : (
                      <p className="text-[11px] text-slate-400">Be honest and specific. Clear stories get verified 2x faster.</p>
                    )}
                    <span className="text-[11px] text-slate-400">{formData.desc.length} chars</span>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 my-6" />

              {/* SECTION 4: VERIFICATION DOCUMENTS & IMAGE */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D8D7A] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> 4. Verification Proof & Photo
                </h3>

                {/* Preset Doc Badges */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Available Verification Documents
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_DOCS.map((doc) => {
                      const isSelected = formData.docs.includes(doc);
                      return (
                        <button
                          type="button"
                          key={doc}
                          onClick={() => toggleDoc(doc)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                            isSelected
                              ? "border-[#3D8D7A] bg-emerald-50 text-[#2b6658] font-semibold"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "} {doc}
                        </button>
                      );
                    })}
                  </div>

                  {/* Added Doc tags */}
                  <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border border-slate-200 bg-slate-50">
                    <span className="text-xs font-bold text-slate-500">Selected Docs:</span>
                    {formData.docs.map((doc) => (
                      <span
                        key={doc}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs"
                      >
                        {doc}
                        <button
                          type="button"
                          onClick={() => removeDoc(doc)}
                          className="text-slate-400 hover:text-red-500 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    <div className="flex items-center gap-1 mt-1 sm:mt-0 w-full sm:w-auto">
                      <input
                        type="text"
                        value={customDoc}
                        onChange={(e) => setCustomDoc(e.target.value)}
                        placeholder="Add custom doc tag..."
                        className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-[#3D8D7A]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomDoc();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addCustomDoc}
                        className="p-1 rounded-lg bg-[#3D8D7A] text-white hover:bg-[#2b6658]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photo selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Cover Photo (Choose preset or enter custom image URL)
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                    {SAMPLE_IMAGES.map((img) => {
                      const isSelected = formData.image === img.url;
                      return (
                        <button
                          key={img.label}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: img.url }))}
                          className={`relative h-20 rounded-xl overflow-hidden border-2 transition ${
                            isSelected ? "border-[#3D8D7A] ring-2 ring-[#3D8D7A]/30 scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1 text-[10px] text-white font-medium truncate">
                            {img.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Or paste image URL (https://...)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#3D8D7A]/30"
                  />
                </div>
              </div>

              <hr className="border-slate-100 my-6" />

              {/* SECTION 5: SUBMITTER CONTACT DETAILS */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D8D7A] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> 5. Submitter & Verification Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Contact Person Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 bg-white placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-[#3D8D7A]/30 ${
                        errors.contactName ? "border-red-300 bg-red-50/30" : "border-slate-200"
                      }`}
                    />
                    {errors.contactName && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.contactName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Contact Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="017XX-XXXXXX"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 bg-white placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-[#3D8D7A]/30 ${
                        errors.contactPhone ? "border-red-300 bg-red-50/30" : "border-slate-200"
                      }`}
                    />
                    {errors.contactPhone && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.contactPhone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Contact Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#3D8D7A]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Relationship to Beneficiary
                    </label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#3D8D7A]/30"
                    >
                      <option value="Self">Self (I am the applicant)</option>
                      <option value="Family Member">Family Member</option>
                      <option value="Volunteer">Volunteer / Local Rep</option>
                      <option value="Organization Rep">Organization Official</option>
                      <option value="Neighbor">Neighbor / Friend</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#3D8D7A] hover:bg-[#2b6658] text-white font-bold text-base shadow-lg shadow-[#3D8D7A]/25 transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <HandHeart className="w-5 h-5" />
                      <span>Submit Donation Request for Verification</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-2.5">
                  By submitting, you confirm that all attached information and documents are authentic.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Live Card Preview & Verification Guide (Disabled/Commented Out) */}
          {false && (
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              {/* Live Card Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Live Request Preview
                    </h3>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">Updates in real time</span>
                </div>

                <p className="text-xs text-slate-500">
                  This is how your donation request card will look to donors on the main ShareHope feed once approved:
                </p>

                {/* Donation Card Mock */}
                <div
                  className={`rounded-2xl border border-slate-200 p-4 bg-white shadow-sm transition-all ${
                    formData.urgent ? "border-l-4 border-l-red-500" : ""
                  }`}
                >
                  <div className="flex gap-3 max-[500px]:flex-col">
                    <img
                      src={previewCase.image}
                      alt=""
                      className="h-24 w-24 flex-shrink-0 rounded-xl bg-slate-100 object-cover max-[500px]:w-full max-[500px]:h-36"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                          {previewCase.name}
                        </h4>
                        {formData.urgent ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-semibold text-red-600 shrink-0">
                            Urgent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700 shrink-0">
                            Pending
                          </span>
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs text-slate-600 leading-snug">
                        {previewCase.desc}
                      </p>

                      <div className="mt-3 relative h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#3D8D7A] w-[0%]" />
                      </div>

                      <div className="mt-1.5 flex items-baseline justify-between text-xs">
                        <span className="font-mono font-bold text-[#3D8D7A]">৳ 0 raised</span>
                        <span className="text-slate-500">
                          of <span className="font-mono font-medium text-slate-700">{previewCase.goal}</span>
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 font-medium">
                          {formData.type} · {formData.category}
                        </span>

                        <button
                          type="button"
                          onClick={() => setShowPreviewModal(true)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#3D8D7A] hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" /> Full Modal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-[#3D8D7A]" />
                    <span>Open Full Details Modal Preview</span>
                  </button>
                </div>
              </div>

              {/* Verification Process Info Card */}
              <div className="bg-[#FBFFE4] rounded-3xl p-6 border border-[#B3D8A8]/60 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#2b6658]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">How Verification Works</h3>
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#3D8D7A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <span>
                      <strong>Submission:</strong> Your case details and proof documents are encrypted and saved securely.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#3D8D7A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <span>
                      <strong>Phone Call Verification:</strong> A ShareHope field auditor will call your provided number within 24 hours.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#3D8D7A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <span>
                      <strong>Live Publishing:</strong> Once verified, your campaign goes live with a <span className="font-bold text-emerald-700">Verified Badge</span> for thousands of donors to view.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Interactive Details Modal Preview */}
      {showPreviewModal && (
        <DetailsModal
          data={previewCase}
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          onReport={() => triggerToast("Preview Mode: Reporting is disabled during draft.")}
          onProceed={() => triggerToast("Preview Mode: Payment flow triggers when published.")}
        />
      )}

      {/* Submission Success Confirmation Modal */}
      {submittedData && (
        <Overlay open={!!submittedData} onClose={() => setSubmittedData(null)}>
          <div className="p-6 sm:p-8 text-center space-y-5 max-w-md mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider inline-block mb-2">
                ID: {submittedData.id}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Request Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Thank you, <strong>{submittedData.contactName}</strong>. Your request for{" "}
                <strong>"{submittedData.name}"</strong> has been recorded and queued for verification.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Goal Amount:</span>
                <span className="font-mono font-bold text-[#3D8D7A]">{submittedData.goal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Category / Area:</span>
                <span className="font-semibold">{submittedData.category} ({submittedData.area})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Contact Phone:</span>
                <span className="font-mono">{submittedData.contactPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Docs Provided:</span>
                <span className="font-semibold">{submittedData.docs.length} document(s)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setSubmittedData(null)}
                className="flex-1 py-3 px-4 rounded-full border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                Submit Another
              </button>
              <Link
                to="/requests"
                className="flex-1 py-3 px-4 rounded-full bg-[#3D8D7A] hover:bg-[#2b6658] text-xs sm:text-sm font-semibold text-white transition shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Browse Requests</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Overlay>
      )}

      {/* Toast Notification */}
      <Toast message={toastMsg} />
    </div>
  );
}
