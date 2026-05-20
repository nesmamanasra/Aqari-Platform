import React, { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Clock,
  ChevronLeft,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // all | unread | read
  const [deletingId, setDeletingId] = useState(null);

  const unreadCount = useMemo(
    () => messages.filter((item) => item.is_read === false).length,
    [messages]
  );

  const readCount = useMemo(
    () => messages.filter((item) => item.is_read === true).length,
    [messages]
  );

  const filteredMessages = useMemo(() => {
    if (activeFilter === "unread") {
      return messages.filter((item) => item.is_read === false);
    }

    if (activeFilter === "read") {
      return messages.filter((item) => item.is_read === true);
    }

    return messages;
  }, [messages, activeFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const allMessages = data || [];
      setMessages(allMessages);

      if (allMessages.length === 0) {
        setSelectedMessage(null);
      } else if (selectedMessage) {
        const updatedSelected = allMessages.find(
          (item) => item.id === selectedMessage.id
        );
        setSelectedMessage(updatedSelected || allMessages[0]);
      } else {
        setSelectedMessage(allMessages[0]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("messages-page-live-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (messageId) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((item) =>
          item.id === messageId ? { ...item, is_read: true } : item
        )
      );

      setSelectedMessage((prev) =>
        prev && prev.id === messageId ? { ...prev, is_read: true } : prev
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);

    if (!message.is_read) {
      await markAsRead(message.id);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذه الرسالة؟");
    if (!confirmed) return;

    try {
      setDeletingId(messageId);

      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;

      const updatedMessages = messages.filter((item) => item.id !== messageId);
      setMessages(updatedMessages);

      if (selectedMessage?.id === messageId) {
        setSelectedMessage(updatedMessages[0] || null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("حدث خطأ أثناء حذف الرسالة");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("ar-PS", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const openWhatsApp = (phone, name) => {
    if (!phone) {
      alert("رقم الهاتف غير متوفر لهذه الرسالة");
      return;
    }

    const cleanedPhone = phone.replace(/[^\d]/g, "");
    const normalizedPhone = cleanedPhone.startsWith("0")
      ? `970${cleanedPhone.slice(1)}`
      : cleanedPhone;

    const text = `مرحباً ${name || ""}، بخصوص رسالتك الواردة من موقع عقاري.`;
    const url = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
      text
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-6" dir="rtl">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">الرسائل</h1>
          <p className="mt-1 text-sm text-gray-500">
            هنا يمكنك متابعة جميع الرسائل الواردة من الزوار والمالكين.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-500">إجمالي الرسائل</p>
            <p className="mt-1 text-lg font-bold text-[#102A43]">
              {messages.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-500">غير المقروءة</p>
            <p className="mt-1 text-lg font-bold text-red-500">{unreadCount}</p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-500">المقروءة</p>
            <p className="mt-1 text-lg font-bold text-emerald-600">
              {readCount}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeFilter === "all"
              ? "bg-[#1F3C88] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#1F3C88]/30 hover:text-[#1F3C88]"
          }`}
        >
          الكل ({messages.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("unread")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeFilter === "unread"
              ? "bg-red-500 text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-500"
          }`}
        >
          الجديدة ({unreadCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("read")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeFilter === "read"
              ? "bg-emerald-600 text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
          }`}
        >
          المقروءة ({readCount})
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white shadow-sm">
          <div className="border-b border-[#EEF2F6] px-5 py-4">
            <h2 className="text-base font-bold text-[#102A43]">صندوق الرسائل</h2>
          </div>

          <div className="max-h-[75vh] overflow-y-auto">
            {loading ? (
              <div className="p-5 text-sm text-gray-500">جاري تحميل الرسائل...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex min-h-[250px] flex-col items-center justify-center p-6 text-center">
                <div className="mb-3 rounded-full bg-[#1F3C88]/10 p-4 text-[#1F3C88]">
                  <Mail size={24} />
                </div>
                <h3 className="text-base font-bold text-[#102A43]">
                  لا توجد رسائل ضمن هذا الفلتر
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-7 text-gray-500">
                  غيّر الفلتر أو انتظر وصول رسائل جديدة من نموذج التواصل.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9]">
                {filteredMessages.map((message) => {
                  const isSelected = selectedMessage?.id === message.id;

                  return (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => handleSelectMessage(message)}
                      className={`w-full px-5 py-4 text-right transition ${
                        isSelected
                          ? "bg-[#F8FAFC]"
                          : "bg-white hover:bg-[#FAFBFC]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3
                              className={`truncate text-sm font-bold ${
                                message.is_read ? "text-[#102A43]" : "text-[#18346F]"
                              }`}
                            >
                              {message.name || "بدون اسم"}
                            </h3>

                            {!message.is_read && (
                              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                            )}
                          </div>

                          <p className="truncate text-xs text-gray-500">
                            {message.topic || "بدون موضوع"}
                          </p>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                            {message.message || "لا توجد تفاصيل داخل الرسالة."}
                          </p>

                          <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock size={12} />
                            <span>{formatDate(message.created_at)}</span>
                          </div>
                        </div>

                        <ChevronLeft size={16} className="mt-1 shrink-0 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E5E7EB] bg-white shadow-sm">
          {!selectedMessage ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 rounded-full bg-[#1F3C88]/10 p-4 text-[#1F3C88]">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#102A43]">اختر رسالة</h3>
              <p className="mt-2 text-sm text-gray-500">
                اختر أي رسالة من القائمة لعرض تفاصيلها كاملة.
              </p>
            </div>
          ) : (
            <div className="flex min-h-[500px] flex-col">
              <div className="border-b border-[#EEF2F6] px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#102A43]">
                      {selectedMessage.topic || "تفاصيل الرسالة"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      تم الإرسال بتاريخ {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedMessage.is_read
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {selectedMessage.is_read ? "مقروءة" : "جديدة"}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#EEF2F6] bg-[#FAFBFC] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#18346F]">
                      <User size={16} />
                      <span className="text-sm font-semibold">اسم المرسل</span>
                    </div>
                    <p className="text-sm font-medium text-[#102A43]">
                      {selectedMessage.name || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#EEF2F6] bg-[#FAFBFC] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#18346F]">
                      <Phone size={16} />
                      <span className="text-sm font-semibold">رقم الهاتف</span>
                    </div>
                    <p className="text-sm font-medium text-[#102A43]">
                      {selectedMessage.phone || "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[#EEF2F6] bg-[#FAFBFC] p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#18346F]">
                    <MessageSquare size={16} />
                    <span className="text-sm font-semibold">نص الرسالة</span>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-8 text-[#334E68]">
                    {selectedMessage.message || "لا يوجد نص مضاف في هذه الرسالة."}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-[#EEF2F6] bg-[#FAFBFC] p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#18346F]">
                    <Clock size={16} />
                    <span className="text-sm font-semibold">وقت الإرسال</span>
                  </div>
                  <p className="text-sm font-medium text-[#102A43]">
                    {formatDate(selectedMessage.created_at)}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        selectedMessage.phone,
                        selectedMessage.name
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <MessageCircle size={16} />
                    رد عبر واتساب
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    disabled={deletingId === selectedMessage.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    {deletingId === selectedMessage.id
                      ? "جاري الحذف..."
                      : "حذف الرسالة"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}