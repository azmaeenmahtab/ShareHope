import { useContext, useEffect, useState } from "react";
import { Camera, Check, LoaderCircle, MapPin, UserRound } from "lucide-react";
import { AuthContext } from "../../context/authContext";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  role: "",
  organizationName: "",
  isMuslim: false,
  occupation: "",
  city: "",
  address: "",
  bio: "",
  avatarUrl: "",
};

export default function MyProfile() {
  const { user, setUser, loading: authLoading } = useContext(AuthContext);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm((current) => ({ ...current, ...user, email: user.email || "" }));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setMessage("");
    setError("");
  };

  const handlePhotoChange = (event) => {
    if (!isEditing) return;
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Please choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, avatarUrl: reader.result }));
    reader.readAsDataURL(file);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isEditing) return;
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          organizationName: form.organizationName,
          isMuslim: form.isMuslim,
          occupation: form.occupation,
          city: form.city,
          address: form.address,
          bio: form.bio,
          avatarUrl: form.avatarUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update profile");

      setUser(data.user);
      setForm((current) => ({ ...current, ...data.user }));
      setMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return <div className="flex min-h-[70vh] items-center justify-center text-sm text-slate-500"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Loading profile...</div>;
  }

  if (!user) {
    return <div className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-slate-500">Please log in to view your profile.</div>;
  }

  const initials = form.name?.charAt(0)?.toUpperCase() || "U";

  const cancelEditing = () => {
    setForm((current) => ({ ...current, ...user }));
    setIsEditing(false);
    setMessage("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-5 py-8 text-slate-800 sm:px-8">
      <main className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0D5C46]">Account settings</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My profile</h1>
          <p className="mt-2 text-sm text-slate-500">Keep your identity and contact information up to date.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-[#DDEBE5] bg-white p-6 shadow-sm">
            <div className="relative mx-auto h-32 w-32">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#0D5C46] text-4xl font-bold text-white ring-8 ring-[#EAF4F0]">
                {form.avatarUrl ? <img src={form.avatarUrl} alt={`${form.name} profile`} className="h-full w-full object-cover" /> : initials}
              </div>
              <label htmlFor="profile-photo" className={`absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#0D5C46] text-white shadow-md hover:bg-[#094433] ${isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`} title={isEditing ? "Add profile photo" : "Click Edit profile first"}>
                <Camera className="h-4 w-4" />
              </label>
              <input id="profile-photo" type="file" accept="image/*" onChange={handlePhotoChange} disabled={!isEditing} className="sr-only" />
            </div>
            <div className="mt-5 text-center">
              <h2 className="text-lg font-bold text-slate-900">{form.name || "Your name"}</h2>
              <p className="mt-1 text-sm text-slate-500">{form.role || "ShareHope member"}</p>
              <p className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5" /> {form.city || "Add your city"}</p>
            </div>
            <p className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">Maximum photo size: 2 MB</p>
          </aside>

          <section className="rounded-3xl border border-[#DDEBE5] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4F0] text-[#0D5C46]"><UserRound className="h-5 w-5" /></span>
              <div className="flex-1"><h2 className="text-lg font-bold text-slate-900">Personal information</h2><p className="text-sm text-slate-500">Details from signup and information you choose to add.</p></div>
              {!isEditing && <button type="button" onClick={() => setIsEditing(true)} className="rounded-xl border border-[#0D5C46] px-4 py-2 text-sm font-semibold text-[#0D5C46] hover:bg-[#EAF4F0]">Edit profile</button>}
            </div>

            {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {message && <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"><Check className="h-4 w-4" /> {message}</div>}

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">Full name<input name="name" value={form.name} onChange={handleChange} disabled={!isEditing} required className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#3D8D7A] focus:ring-2 focus:ring-[#3D8D7A]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500" /></label>
              <label className="text-sm font-semibold text-slate-700">Email address<input value={form.email} readOnly className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-500 outline-none" /></label>
              <label className="text-sm font-semibold text-slate-700">Phone number<input name="phone" value={form.phone} onChange={handleChange} disabled={!isEditing} placeholder="01XXXXXXXXX" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#3D8D7A] focus:ring-2 focus:ring-[#3D8D7A]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500" /></label>
              <label className="text-sm font-semibold text-slate-700">Occupation<input name="occupation" value={form.occupation} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Teacher" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#3D8D7A] focus:ring-2 focus:ring-[#3D8D7A]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500" /></label>
              <label className="text-sm font-semibold text-slate-700">City<input name="city" value={form.city} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Dhaka" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#3D8D7A] focus:ring-2 focus:ring-[#3D8D7A]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500" /></label>
              <label className="text-sm font-semibold text-slate-700">Address<input name="address" value={form.address} onChange={handleChange} disabled={!isEditing} placeholder="Your area or address" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#3D8D7A] focus:ring-2 focus:ring-[#3D8D7A]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500" /></label>
              {form.role === "receiver" && <label className="text-sm font-semibold text-slate-700">Organization name<input name="organizationName" value={form.organizationName} onChange={handleChange} disabled={!isEditing} placeholder="Organization name" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#3D8D7A] focus:ring-2 focus:ring-[#3D8D7A]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500" /></label>}
            </div>

            <label className="mt-5 block text-sm font-semibold text-slate-700">About you<textarea name="bio" value={form.bio} onChange={handleChange} disabled={!isEditing} rows="4" placeholder="Tell the ShareHope community a little about yourself" className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#3D8D7A] focus:ring-2 focus:ring-[#3D8D7A]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500" /></label>
            {form.role === "donor" && <label className="mt-5 flex items-center gap-2.5 text-sm text-slate-600"><input type="checkbox" name="isMuslim" checked={Boolean(form.isMuslim)} onChange={handleChange} disabled={!isEditing} className="h-4 w-4 accent-[#0D5C46]" /> I am Muslim and want to use Zakat tools</label>}

            <div className="mt-8 flex justify-end">
              {isEditing && <><button type="button" onClick={cancelEditing} disabled={saving} className="mr-3 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D5C46] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#094433] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {saving ? "Saving..." : "Save changes"}
              </button></>}
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
