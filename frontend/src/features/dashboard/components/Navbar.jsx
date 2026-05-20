import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  User,
  MessageSquare,
  X,
  Menu,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import logo from "../../../assets/aqari_top_white.png";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessageAlert, setShowMessageAlert] = useState(false);
  const [latestMessageText, setLatestMessageText] = useState("");
  const [admin, setAdmin] = useState(() => {
    const cachedName = localStorage.getItem("admin_full_name") || "";
    const cachedEmail = localStorage.getItem("admin_email") || "";

    return {
      full_name: cachedName,
      email: cachedEmail,
    };
  });
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  const initializedRef = useRef(false);
  const previousUnreadCountRef = useRef(0);

  const playNotificationSound = () => {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTAAAAAA/////wAAAP///wAAAP///wAAAP///wAAAP///wAA"
      );
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (error) {
      console.error("Sound play error:", error);
    }
  };

  const fetchAdminData = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from("admins")
        .select("id, full_name, email")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("Error fetching admin data:", error);
        return;
      }

      setAdmin(data);

      if (data?.full_name) {
        localStorage.setItem("admin_full_name", data.full_name);
      }

      if (data?.email) {
        localStorage.setItem("admin_email", data.email);
      }
    } catch (error) {
      console.error("Unexpected error fetching admin data:", error);
    }
  };

  const fetchUnreadMessagesCount = async (showInitialAlert = false) => {
    try {
      const { data, count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .eq("is_read", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching unread messages count:", error);
        return;
      }

      const newCount = count || 0;
      const latestMessage = data?.[0] || null;

      setUnreadCount(newCount);

      if (latestMessage) {
        setLatestMessageText(
          latestMessage.name
            ? `رسالة جديدة من ${latestMessage.name}`
            : "لديك رسالة جديدة"
        );
      }

      if (!initializedRef.current) {
        previousUnreadCountRef.current = newCount;
        initializedRef.current = true;

        if (showInitialAlert && newCount > 0) {
          setShowMessageAlert(true);
        }
        return;
      }

      if (newCount > previousUnreadCountRef.current) {
        previousUnreadCountRef.current = newCount;
        setShowMessageAlert(true);
        playNotificationSound();
      } else {
        previousUnreadCountRef.current = newCount;
      }
    } catch (error) {
      console.error("Unexpected error fetching unread messages count:", error);
    }
  };

  useEffect(() => {
    fetchAdminData();
    fetchUnreadMessagesCount(true);

    const channel = supabase
      .channel("navbar-live-messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new;

          setUnreadCount((prev) => prev + 1);
          setLatestMessageText(
            newMessage?.name
              ? `رسالة جديدة من ${newMessage.name}`
              : "لديك رسالة جديدة"
          );
          setShowMessageAlert(true);
          playNotificationSound();
          previousUnreadCountRef.current += 1;
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchUnreadMessagesCount(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!showMessageAlert) return;

    const timer = setTimeout(() => {
      setShowMessageAlert(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, [showMessageAlert]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToMessages = () => {
    setShowMessageAlert(false);
    navigate("/dashboard/messages");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("admin_full_name");
      localStorage.removeItem("admin_email");
      setOpenProfileMenu(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="w-full bg-gradient-to-b from-[#1F3C88] to-[#18346F] px-3 sm:px-4 md:px-8 lg:px-14">
        <div className="mx-auto flex h-[64px] sm:h-[70px] max-w-[1400px] items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 md:hidden"
            >
              <Menu size={20} />
            </button>

            <img
              src={logo}
              alt="Aqari"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />

            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-[11px] md:text-[12px] text-white/75 font-medium">
                أهلاً بك
              </span>

              <span className="min-h-[18px] text-[12px] md:text-[13px] font-bold text-white">
                {admin?.full_name || ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={goToMessages}
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            >
              <MessageSquare size={17} className="sm:hidden" />
              <MessageSquare size={18} className="hidden sm:block" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[18px] sm:min-w-[20px] rounded-full bg-red-500 px-1.5 py-[2px] text-center text-[9px] sm:text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            >
              <Bell size={17} className="sm:hidden" />
              <Bell size={18} className="hidden sm:block" />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setOpenProfileMenu((prev) => !prev)}
                className="flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-xl bg-white/10 px-2.5 sm:px-3 text-white transition hover:bg-white/20"
              >
                <User size={17} className="sm:hidden" />
                <User size={18} className="hidden sm:block" />
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    openProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openProfileMenu && (
                <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-52 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
                  <div className="border-b border-[#EEF2F7] px-4 py-3 text-right">
                    <p className="min-h-[20px] text-[13px] font-bold text-[#102A43]">
                      {admin?.full_name || ""}
                    </p>
                    <p className="mt-1 min-h-[16px] text-[11px] text-gray-500">
                      {admin?.email || ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenProfileMenu(false);
                      navigate("/dashboard/profile");
                    }}
                    className="flex w-full items-center justify-end gap-2 px-4 py-3 text-right text-[13px] font-medium text-[#102A43] transition hover:bg-gray-50"
                  >
                    الملف الشخصي
                    <User size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-end gap-2 px-4 py-3 text-right text-[13px] font-medium text-red-600 transition hover:bg-red-50"
                  >
                    تسجيل الخروج
                    <LogOut size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showMessageAlert &&
        unreadCount > 0 &&
        location.pathname !== "/dashboard/messages" && (
          <div className="fixed right-3 top-20 z-[9999] w-[calc(100vw-24px)] max-w-[380px] animate-[fadeIn_.25s_ease] rounded-2xl border border-[#DDE7F3] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.14)] sm:right-6 sm:top-24">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1F3C88]/10 text-[#1F3C88]">
                <MessageSquare size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-[#102A43]">
                  {latestMessageText || "لديك رسالة جديدة"}
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  لديك {unreadCount} رسالة غير مقروءة، تفقدها الآن في قسم
                  الرسائل داخل الداشبورد.
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={goToMessages}
                    className="rounded-xl bg-[#1F3C88] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#18346F]"
                  >
                    عرض الرسائل
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMessageAlert(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    إغلاق
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMessageAlert(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
    </>
  );
}