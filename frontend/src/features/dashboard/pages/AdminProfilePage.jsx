import React, { useEffect, useState } from "react";
import {
  Mail,
  CalendarDays,
  ShieldCheck,
  LogOut,
  UserCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminProfile();
  }, []);

  const getAdminProfile = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("admins")
      .select("id, full_name, email, created_at")
      .eq("email", user.email)
      .single();

    if (!error) {
      setAdmin(data);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6" dir="rtl">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200/70 bg-white p-10 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="flex min-h-[220px] flex-col items-center justify-center">
            <div className="relative">
              <div className="h-14 w-14 animate-spin rounded-full border-[3px] border-[#D8E4FF] border-t-[#1F3C88]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-[#1F3C88]/10" />
              </div>
            </div>

            <p className="mt-5 text-[13px] font-medium text-slate-500">
              يتم تحميل الملف الشخصي...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="p-4 md:p-6" dir="rtl">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="bg-gradient-to-l from-[#1F3C88] to-[#315EDE] px-6 py-6 text-white sm:px-8 sm:py-8">
            <div className="flex flex-col gap-5">
              <div className="flex justify-start">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-[12px] font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <ArrowRight size={15} />
                  الرجوع للداشبورد
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-right">
                <div className="order-2 sm:order-1">
                  <h1 className="text-[20px] sm:text-[24px] font-bold">
                    الملف الشخصي
                  </h1>
                  <p className="mt-2 text-[12px] sm:text-[13px] text-white/85">
                    معلومات الأدمن المسجل داخل النظام
                  </p>
                </div>

                <div className="order-1 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur sm:order-2">
                  <UserCircle2 size={44} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-end gap-2">
                  <span className="text-[13px] font-bold text-slate-800">
                    الاسم الكامل
                  </span>
                  <UserCircle2 size={16} className="text-[#1F3C88]" />
                </div>
                <p className="text-right text-[13px] text-slate-600">
                  {admin?.full_name || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-end gap-2">
                  <span className="text-[13px] font-bold text-slate-800">
                    البريد الإلكتروني
                  </span>
                  <Mail size={16} className="text-[#1F3C88]" />
                </div>
                <p className="text-right text-[13px] text-slate-600">
                  {admin?.email || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-end gap-2">
                  <span className="text-[13px] font-bold text-slate-800">
                    نوع الحساب
                  </span>
                  <ShieldCheck size={16} className="text-[#1F3C88]" />
                </div>
                <p className="text-right text-[13px] text-slate-600">Admin</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-end gap-2">
                  <span className="text-[13px] font-bold text-slate-800">
                    تاريخ الإنشاء
                  </span>
                  <CalendarDays size={16} className="text-[#1F3C88]" />
                </div>
                <p className="text-right text-[13px] text-slate-600">
                  {admin?.created_at
                    ? new Date(admin.created_at).toLocaleDateString("ar-EG")
                    : "-"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-start">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-[13px] font-bold text-red-600 transition hover:bg-red-100"
              >
                <LogOut size={16} />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}