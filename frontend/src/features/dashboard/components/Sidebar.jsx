import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  UserPlus,
  CreditCard,
  BarChart3,
  Wrench,
  Megaphone,
  Users,
  Settings,
  HelpCircle,
  Headphones,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../auth/services/auth";
import { supabase } from "../../../lib/supabase";

const menuSections = [
  {
    title: "عام",
    items: [
      { label: "نظرة عامة", icon: LayoutDashboard, path: "/dashboard" },
      { label: "العقارات", icon: Building2, path: "/dashboard/property" },
      { label: "إدارة المالكين", icon: Users, path: "/dashboard/owners" },
      { label: "Leads العملاء", icon: UserPlus, path: "/dashboard/leads" },
      {
        label: "الرسائل",
        icon: MessageSquare,
        path: "/dashboard/messages",
        key: "messages",
      },
    ],
  },
  {
    title: "الإدارة المالية",
    items: [
      { label: "المدفوعات", icon: CreditCard },
      { label: "التقارير والتحليلات", icon: BarChart3 },
    ],
  },
  {
    title: "الصيانة والخدمات",
    items: [
      { label: "طلبات الصيانة", icon: Wrench },
      { label: "المبيعات والتسويق", icon: Megaphone },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { label: "إدارة المستخدمين", icon: Users },
      { label: "الإعدادات", icon: Settings },
    ],
  },
  {
    title: "معلومات",
    items: [
      { label: "المساعدة والمركز", icon: HelpCircle },
      { label: "الدعم والمحادثة", icon: Headphones },
      { label: "تسجيل الخروج", icon: LogOut, action: "logout" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const fetchUnreadMessagesCount = async () => {
    try {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      if (error) {
        console.error("Error fetching unread messages count:", error);
        return;
      }

      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Unexpected error fetching unread messages count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadMessagesCount();

    const channel = supabase
      .channel(`messages-sidebar-${Date.now()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          fetchUnreadMessagesCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleItemClick = async (item) => {
    if (item.action === "logout") {
      try {
        await auth.logout();
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Logout error:", error);
        alert("حدث خطأ أثناء تسجيل الخروج");
      }
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <aside className="w-[250px] min-h-screen border-r border-[#E6EAF0] bg-gradient-to-b from-[#F9FAFB] via-[#F7F8FA] to-[#F3F5F8] px-3 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-[#1F3C88] to-[#18346F] px-4 py-4 text-white shadow-[0_10px_30px_rgba(31,60,136,0.22)]">
        <p className="text-[11px] font-medium text-white/75">لوحة التحكم</p>
        <h2 className="mt-1 text-[18px] font-bold tracking-tight">Aqari Dashboard</h2>
        <p className="mt-1 text-[11px] leading-5 text-white/75">
          إدارة العقارات والمالكين والرسائل من مكان واحد
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {menuSections.map((section, sectionIndex) => (
          <section key={sectionIndex}>
            <h3 className="mb-2.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
              {section.title}
            </h3>

            <div className="space-y-1.5">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                const isMessagesItem = item.key === "messages";
                const isLogout = item.action === "logout";

                return (
                  <button
                    key={itemIndex}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                      active
                        ? "border border-[#DCE6F8] bg-white text-[#102A43] shadow-[0_6px_18px_rgba(15,23,42,0.06)]"
                        : isLogout
                        ? "text-[#B42318] hover:bg-[#FEF3F2]"
                        : "text-[#4B5563] hover:bg-white hover:shadow-[0_6px_18px_rgba(15,23,42,0.05)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                          active
                            ? "bg-[#EEF4FF] text-[#1F3C88]"
                            : isLogout
                            ? "bg-[#FEF3F2] text-[#B42318]"
                            : "bg-[#F3F4F6] text-[#6B7280] group-hover:bg-[#EEF4FF] group-hover:text-[#1F3C88]"
                        }`}
                      >
                        <Icon size={16} strokeWidth={1.9} />
                      </div>

                      <span
                        className={`text-[13px] font-medium ${
                          active ? "text-[#111827]" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-[#1F3C88]" />
                      )}

                      {isMessagesItem && unreadCount > 0 && (
                        <span
                          className={`min-w-[22px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${
                            active
                              ? "bg-[#1F3C88] text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}