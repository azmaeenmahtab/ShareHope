import { useContext, useEffect, useState } from "react";
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
  X,
  Eye,
  Sparkles,
  ArrowRight,
  CreditCard,
  Check,
} from "lucide-react";
import Footer from "../components/shared/Footer";
import Overlay from "../components/Overlay";
import Toast from "../components/Toast";
import { AuthContext } from "../context/authContext";

const PRESET_DOCS = [
  "NID copy",
  "Doctor's prescription / Note",
  "Hospital cost estimate",
  "Imam / Local leader letter",
  "Income / Unemployment certificate",
  "Utility bill",
  "NGO / Trust Certificate",
  "Student ID",
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
  "Others"
];

const GOAL_PRESETS = [15000, 30000, 50000, 100000, 150000];

const INITIAL_FORM = {
  name: "",
  type: "Individual",
  category: CATEGORIES[0],
  goal: "",
  area: "",
  desc: "",
  urgent: false,
  methods: ["bKash", "Nagad", "Bank", "Cash"],
  docs: ["NID copy", "Imam / Local leader letter"],
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  relationship: "Self",
};

const IMGBB_API = import.meta.env.VITE_IMGBB_API || "https://api.imgbb.com/1/upload";
const IMGBB_SECRET_KEY = import.meta.env.VITE_IMGBB_SECRET_KEY || "1d0e5a39339d17c9208551a82c7e94cc";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");

export default function DonationRequestPage() {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Revoke the object URL when the image changes or the component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

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
      return {
        ...prev,
        methods: exists
          ? prev.methods.filter((m) => m !== methodId)
          : [...prev.methods, methodId],
      };
    });
  };

  const toggleDoc = (docName) => {
    setFormData((prev) => {
      const exists = prev.docs.includes(docName);
      return {
        ...prev,
        docs: exists ? prev.docs.filter((d) => d !== docName) : [...prev.docs, docName],
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[DonationRequestPage] handleSubmit triggered. Current formData:", formData);

    // If backend requires authentication (verifyTokenMiddleware), check if user is logged in
    if (!user) {
      const authError = "You must be logged in to submit a donation request. Please log in first.";
      console.warn("[DonationRequestPage]", authError);
      setSubmitError(authError);
      triggerToast(authError);
      return;
    }

    if (!validate()) {
      console.warn("[DonationRequestPage] Validation failed. Current errors:", errors);
      triggerToast("Please fill in all required fields marked in red.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setUploadStatus("Processing...");

    try {
      let imageUrl = "";

      // 1. If an image file was selected, upload it to ImgBB first
      if (imageFile) {
        setUploadStatus("Uploading image to ImgBB...");
        console.log("[DonationRequestPage] Uploading image to ImgBB:", imageFile.name);

        const imgFormData = new FormData();
        imgFormData.append("image", imageFile);

        let imgbbRes;
        try {
          imgbbRes = await fetch(`${IMGBB_API}?key=${IMGBB_SECRET_KEY}`, {
            method: "POST",
            body: imgFormData,
          });
        } catch (fetchErr) {
          console.error("[DonationRequestPage] ImgBB network fetch error:", fetchErr);
          throw new Error("Unable to reach ImgBB server. Please check your internet connection or ad-blocker.");
        }

        let imgbbData;
        try {
          imgbbData = await imgbbRes.json();
        } catch (jsonErr) {
          console.error("[DonationRequestPage] ImgBB non-JSON response:", jsonErr);
          throw new Error(`ImgBB upload failed with HTTP status ${imgbbRes.status}`);
        }

        if (!imgbbRes.ok || !imgbbData?.success) {
          console.error("[DonationRequestPage] ImgBB rejected upload:", imgbbData);
          throw new Error(imgbbData?.error?.message || "Failed to upload image to ImgBB. Please try another image.");
        }

        imageUrl = imgbbData.data?.url || imgbbData.data?.display_url || "";
        console.log("[DonationRequestPage] ImgBB upload succeeded. Image URL:", imageUrl);
      }

      // 2. Submit the request payload with the uploaded image URL to the backend
      setUploadStatus("Saving request to database...");
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        category: formData.category,
        goal: Number(formData.goal),
        area: formData.area.trim(),
        desc: formData.desc.trim(),
        urgent: Boolean(formData.urgent),
        methods: formData.methods,
        docs: formData.docs,
        contactName: formData.contactName.trim(),
        contactPhone: formData.contactPhone.trim(),
        contactEmail: formData.contactEmail.trim(),
        relationship: formData.relationship,
        submitterEmail: user?.email || "",
        image: imageUrl,
      };

      const endpoint = `${API_BASE_URL}/api/request/submit`;
      console.log(`[DonationRequestPage] Sending POST request to ${endpoint} with payload:`, payload);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      console.log(`[DonationRequestPage] Backend responded with status: ${res.status}`);

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        console.error("[DonationRequestPage] Backend returned error response:", errBody);
        throw new Error(errBody?.message || `Submission failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("[DonationRequestPage] Donation request created successfully:", data);
      setSubmittedData(data.request || data);
      triggerToast("Donation request submitted successfully!");
    } catch (err) {
      console.error("[DonationRequestPage] Submission error caught:", err);
      setSubmitError(err.message);
      triggerToast(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setUploadStatus("");
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    clearImage();
    setErrors({});
    setSubmittedData(null);
    setUploadStatus("");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 pb-16 pt-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="border-b border-slate-100 pb-5 mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3D8D7A]" /> Request Information Form
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Fields marked with <span className="text-red-500">*</span> are mandatory for
                verification.
              </p>
            </div>

            {submitError && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Beneficiary & Category */}
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
                    placeholder="e.g. Karim Family — Emergency Dialysis"
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
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#3D8D7A]/30"
                    >
                      <option value="Individual">Individual</option>
                      <option value="Family">Family</option>
                      <option value="Organization">Organization</option>
                      <option value="Community">Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#3D8D7A]/30"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
                        Check this if assistance is needed within 24–72 hours (e.g. ICU treatment,
                        natural disaster).
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

              {/* 2. Target Goal & Location */}
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

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {GOAL_PRESETS.map((amt) => (
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
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.methods && <p className="mt-1 text-xs text-red-500 font-medium">{errors.methods}</p>}
                </div>
              </div>

              <hr className="border-slate-100 my-6" />

              {/* 3. Description */}
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
                      <p className="text-[11px] text-slate-400">
                        Be honest and specific. Clear stories get verified faster.
                      </p>
                    )}
                    <span className="text-[11px] text-slate-400">{formData.desc.length} chars</span>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 my-6" />

              {/* 4. Verification Docs & Photo */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D8D7A] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> 4. Verification Proof & Photo
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Available Verification Documents
                  </label>
                  <div className="flex flex-wrap gap-2">
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
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cover Photo</label>

                  {imagePreview ? (
                    <div className="relative h-40 w-full sm:w-56 rounded-xl overflow-hidden border border-slate-200">
                      <img src={imagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-1.5 h-40 w-full sm:w-56 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 text-slate-400 cursor-pointer hover:border-[#3D8D7A] hover:text-[#3D8D7A] transition">
                      <Upload className="w-5 h-5" />
                      <span className="text-xs font-medium">Upload a photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>

              <hr className="border-slate-100 my-6" />

              {/* 5. Submitter Contact */}
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#3D8D7A] hover:bg-[#2b6658] text-white font-bold text-base shadow-lg shadow-[#3D8D7A]/25 transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{uploadStatus || "Submitting Request..."}</span>
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
                  By submitting, you confirm that all attached information and documents are
                  authentic.
                </p>
              </div>
            </form>
          </div>

          {/* Live summary card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Live Preview
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Donor view
                </span>
              </div>

              <div
                className={`rounded-2xl border border-slate-200 p-4 bg-white transition-all ${
                  formData.urgent ? "border-l-4 border-l-red-500" : ""
                }`}
              >
                <div className="flex gap-3 max-[500px]:flex-col">
                  <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-slate-100 overflow-hidden max-[500px]:w-full max-[500px]:h-36">
                    {imagePreview ? (
                      <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <HandHeart className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                        {formData.name || "Recipient / Request Title"}
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
                      {formData.desc ||
                        "Your description will appear here once you fill in the request story."}
                    </p>

                    <div className="mt-3 relative h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#3D8D7A] w-0" />
                    </div>

                    <div className="mt-1.5 flex items-baseline justify-between text-xs">
                      <span className="font-mono font-bold text-[#3D8D7A]">৳ 0 raised</span>
                      <span className="text-slate-500">
                        of{" "}
                        <span className="font-mono font-medium text-slate-700">
                          {formData.goal ? `৳ ${Number(formData.goal).toLocaleString("en-IN")}` : "৳ —"}
                        </span>
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 font-medium">
                        {formData.type} · {formData.category}
                      </span>
                    </div>

                    {formData.area && (
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3" /> {formData.area}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#FBFFE4] rounded-2xl p-4 border border-[#B3D8A8]/60 space-y-3">
                <div className="flex items-center gap-2 text-[#2b6658]">
                  <ShieldCheck className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">How Verification Works</h3>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#3D8D7A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <span>
                      <strong>Submission:</strong> Your case details and proof documents are
                      encrypted and saved securely.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#3D8D7A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <span>
                      <strong>Phone Call Verification:</strong> A ShareHope field auditor will call
                      your provided number within 24 hours.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#3D8D7A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <span>
                      <strong>Live Publishing:</strong> Once verified, your campaign goes live for
                      donors to view.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Submission success modal */}
      {submittedData && (
        <Overlay open={!!submittedData} onClose={() => setSubmittedData(null)}>
          <div className="p-6 sm:p-8 text-center space-y-5 max-w-md mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>

            <div>
              {(submittedData.id || submittedData._id) && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider inline-block mb-2">
                  ID: {submittedData.id || submittedData._id}
                </span>
              )}
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Request Submitted!</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Thank you, <strong>{formData.contactName}</strong>. Your request for{" "}
                <strong>"{formData.name}"</strong> has been recorded and queued for verification.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Goal Amount:</span>
                <span className="font-mono font-bold text-[#3D8D7A]">
                  ৳ {Number(formData.goal).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Category / Area:</span>
                <span className="font-semibold">
                  {formData.category} ({formData.area})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Contact Phone:</span>
                <span className="font-mono">{formData.contactPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Docs Provided:</span>
                <span className="font-semibold">{formData.docs.length} document(s)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={resetForm}
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

      <Toast message={toastMsg} />
    </div>
  );
}
