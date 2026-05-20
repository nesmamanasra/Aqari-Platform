import React, { useMemo, useState } from "react";
import { Send, UserRound, Phone, MapPin, BadgeDollarSign } from "lucide-react";
import { supabase } from "../../../lib/supabase";

const initialForm = {
  full_name: "",
  phone: "",
  city: "",
  property_type: "",
  operation_type: "",
  budget: "",
  notes: "",
};

export default function LeadCaptureForm({ property = null, source = "website", onCreated }) {
  const defaults = useMemo(
    () => ({
      city: property?.city || "",
      property_type: property?.property_type || "",
      operation_type: property?.operation_type || "",
    }),
    [property]
  );

  const [form, setForm] = useState({ ...initialForm, ...defaults });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitLead = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.full_name.trim() || !form.phone.trim()) {
      setMessage("يرجى إدخال الاسم ورقم الهاتف على الأقل.");
      return;
    }

    setLoading(true);
    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      city: form.city || defaults.city || null,
      property_type: form.property_type || defaults.property_type || null,
      operation_type: form.operation_type || defaults.operation_type || null,
      budget: form.budget ? Number(form.budget) : null,
      notes: form.notes || null,
      source,
      status: "جديد",
      property_id: property?.id || null,
    };

    const { error } = await supabase.from("leads").insert(payload);
    setLoading(false);

    if (error) {
      console.error("Lead insert error:", error);
      setMessage("تعذر حفظ الطلب. تأكد من تنفيذ ملف supabase/leads.sql.");
      return;
    }

    setForm({ ...initialForm, ...defaults });
    setMessage("تم حفظ طلبك بنجاح، سيتواصل معك فريق عقاري قريباً.");
    onCreated?.();
  };

  return (
    <form onSubmit={submitLead} className="space-y-3" dir="rtl">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block rounded-2xl border border-gray-100 bg-[#FAFBFC] px-3 py-2.5">
          <span className="mb-1 flex items-center gap-1.5 text-[11px] text-gray-500"><UserRound size={13} /> الاسم</span>
          <input value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="اسم العميل" />
        </label>
        <label className="block rounded-2xl border border-gray-100 bg-[#FAFBFC] px-3 py-2.5">
          <span className="mb-1 flex items-center gap-1.5 text-[11px] text-gray-500"><Phone size={13} /> رقم الهاتف</span>
          <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="05xxxxxxxx" />
        </label>
        <label className="block rounded-2xl border border-gray-100 bg-[#FAFBFC] px-3 py-2.5">
          <span className="mb-1 flex items-center gap-1.5 text-[11px] text-gray-500"><MapPin size={13} /> المدينة</span>
          <input value={form.city} onChange={(e) => updateField("city", e.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="المدينة" />
        </label>
        <label className="block rounded-2xl border border-gray-100 bg-[#FAFBFC] px-3 py-2.5">
          <span className="mb-1 flex items-center gap-1.5 text-[11px] text-gray-500"><BadgeDollarSign size={13} /> الميزانية</span>
          <input type="number" value={form.budget} onChange={(e) => updateField("budget", e.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="مثال: 120000" />
        </label>
      </div>
      <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} className="min-h-[92px] w-full rounded-2xl border border-gray-100 bg-[#FAFBFC] px-3 py-3 text-sm outline-none" placeholder="ملاحظات إضافية عن الطلب" />
      {message && <p className="rounded-2xl bg-[#EEF4FF] px-3 py-2 text-[12px] font-semibold text-[#1F3C88]">{message}</p>}
      <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1F3C88] to-[#18346F] px-4 py-3 text-[13px] font-bold text-white disabled:opacity-60">
        <Send size={16} /> {loading ? "جاري الحفظ..." : "أرسل طلب اهتمام"}
      </button>
    </form>
  );
}
