import React, { useMemo, useState } from "react";
import { MessageCircle, Search, SlidersHorizontal, UsersRound } from "lucide-react";
import Navbar from "../../dashboard/components/Navbar";
import Sidebar from "../../dashboard/components/Sidebar";
import { useDashboardData } from "../../dashboard/context/DashboardDataContext";
import { supabase } from "../../../lib/supabase";
import { buildLeadWhatsAppMessage, openWhatsAppMessage } from "../../../shared/utils/whatsapp";

const statuses = ["الكل", "جديد", "تم التواصل", "مهتم", "غير مهتم", "تم الإغلاق"];

export default function LeadsPage() {
  const { leads, refreshLeads } = useDashboardData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("الكل");
  const [savingId, setSavingId] = useState(null);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (leads || []).filter((lead) => {
      const matchesStatus = status === "الكل" || lead.status === status;
      const text = [lead.full_name, lead.phone, lead.city, lead.property_type, lead.operation_type, lead.notes, lead.source]
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!q || text.includes(q));
    });
  }, [leads, query, status]);

  const updateStatus = async (leadId, nextStatus) => {
    setSavingId(leadId);
    const { error } = await supabase.from("leads").update({ status: nextStatus }).eq("id", leadId);
    setSavingId(null);
    if (error) {
      console.error("Update lead status error:", error);
      return;
    }
    refreshLeads?.();
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F7F8FA] flex flex-col" dir="rtl">
      <Navbar />
      <div className="flex flex-1 min-w-0 overflow-x-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden p-4 md:p-6">
          <section className="mx-auto max-w-[1450px]">
            <div className="mb-5 overflow-hidden rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_15px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-right">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#EEF4FF] px-3 py-1.5 text-[11px] font-bold text-[#315EDE]">
                    <UsersRound size={14} /> Lead System
                  </div>
                  <h1 className="text-[22px] font-black text-[#0F172A] md:text-[28px]">إدارة العملاء المهتمين</h1>
                  <p className="mt-2 text-[13px] leading-6 text-[#64748B]">تابع طلبات العملاء، غيّر حالة المتابعة، وتواصل عبر واتساب مباشرة.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[520px]">
                  <label className="flex items-center gap-2 rounded-2xl border border-[#E6ECF5] bg-[#F8FBFF] px-3 py-2.5">
                    <Search size={16} className="text-[#94A3B8]" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث بالاسم، الهاتف، المدينة..." className="w-full bg-transparent text-sm outline-none" />
                  </label>
                  <label className="flex items-center gap-2 rounded-2xl border border-[#E6ECF5] bg-[#F8FBFF] px-3 py-2.5">
                    <SlidersHorizontal size={16} className="text-[#94A3B8]" />
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-transparent text-sm outline-none">
                      {statuses.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full text-right text-sm">
                  <thead className="bg-[#F8FAFC] text-[12px] text-[#64748B]">
                    <tr>
                      <th className="px-4 py-4">العميل</th>
                      <th className="px-4 py-4">الهاتف</th>
                      <th className="px-4 py-4">الطلب</th>
                      <th className="px-4 py-4">الميزانية</th>
                      <th className="px-4 py-4">المصدر</th>
                      <th className="px-4 py-4">الحالة</th>
                      <th className="px-4 py-4">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF2F7]">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#FAFBFC]">
                        <td className="px-4 py-4 font-bold text-[#0F172A]">{lead.full_name}<p className="mt-1 max-w-[250px] truncate text-[11px] font-normal text-[#94A3B8]">{lead.notes || "بدون ملاحظات"}</p></td>
                        <td className="px-4 py-4 text-[#334155]">{lead.phone}</td>
                        <td className="px-4 py-4 text-[#334155]">{lead.operation_type || "-"} / {lead.property_type || "-"}<p className="mt-1 text-[11px] text-[#94A3B8]">{lead.city || "كل المدن"}</p></td>
                        <td className="px-4 py-4 font-semibold text-[#1F3C88]">{lead.budget ? Number(lead.budget).toLocaleString() : "-"}</td>
                        <td className="px-4 py-4 text-[#64748B]">{lead.source || "website"}</td>
                        <td className="px-4 py-4">
                          <select disabled={savingId === lead.id} value={lead.status || "جديد"} onChange={(e) => updateStatus(lead.id, e.target.value)} className="rounded-xl border border-[#E6ECF5] bg-white px-3 py-2 text-[12px] font-bold text-[#1F3C88] outline-none">
                            {statuses.filter((item) => item !== "الكل").map((item) => <option key={item}>{item}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => openWhatsAppMessage(buildLeadWhatsAppMessage(lead))} className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-3 py-2 text-[12px] font-bold text-white">
                            <MessageCircle size={14} /> واتساب
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr><td colSpan="7" className="px-4 py-10 text-center text-[#94A3B8]">لا توجد Leads مطابقة حالياً</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
