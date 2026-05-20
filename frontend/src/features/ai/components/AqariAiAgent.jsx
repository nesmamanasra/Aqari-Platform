import React, { useMemo, useState } from "react";
import { Bot, Send, X, MessageCircle, Sparkles } from "lucide-react";
import LeadCaptureForm from "../../leads/components/LeadCaptureForm";
import { searchPropertiesWithAi } from "../services/aiAgentApi";

export default function AqariAiAgent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: "أهلًا 👋 أنا عقاري الذكي. اكتب المدينة أو نوع العقار أو بيع/إيجار وسأقترح لك خيارات مناسبة.",
    },
  ]);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const suggestions = useMemo(
    () => ["شقة في نابلس", "أرض للبيع", "بيت للإيجار", "فيلا رام الله"],
    []
  );

  const sendMessage = async (text = input) => {
    const clean = text.trim();
    if (!clean || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: clean }]);
    setInput("");
    setLoading(true);

    try {
      const data = await searchPropertiesWithAi(clean);

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text:
            data.reply ||
            (data.results?.length
              ? "هاي أفضل النتائج حسب طلبك 👇"
              : "ما لقيت نتائج دقيقة 😅 جرب غيّر الوصف أو اترك بياناتك وسيتواصل معك فريق عقاري."),
          matches: data.results || [],
        },
      ]);
    } catch (error) {
      console.error("AI Agent error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "صار خطأ في الاتصال بالمساعد. تأكدي من نشر Supabase Edge Function باسم aqari-ai-agent ومن إضافة OPENAI_API_KEY في Supabase Secrets.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="fixed bottom-5 left-5 z-50">
      {open && (
        <div className="mb-3 w-[calc(100vw-40px)] max-w-[390px] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.22)]">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1F3C88] to-[#18346F] px-4 py-3 text-white">
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/10 p-1.5"
            >
              <X size={16} />
            </button>

            <div className="text-right">
              <p className="text-sm font-black">اسأل عقاري الذكي</p>
              <p className="text-[11px] text-white/75">
                مساعد بحث وتحويل العملاء إلى Leads
              </p>
            </div>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto bg-[#F8FAFC] p-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-2xl px-3 py-2 text-[13px] leading-6 ${
                  msg.role === "user"
                    ? "mr-auto max-w-[85%] bg-[#1F3C88] text-white"
                    : "ml-auto max-w-[92%] bg-white text-[#334155] shadow-sm"
                }`}
              >
                {msg.text}

                {msg.matches?.length ? (
                  <div className="mt-2 space-y-2">
                    {msg.matches.map((item) => (
                      <a
                        key={item.id}
                        href={`/property/${item.id}`}
                        className="block rounded-xl border border-[#E6ECF5] bg-[#F8FBFF] p-2 text-[#1F3C88]"
                      >
                        <b>{item.title}</b>

                        <span className="block text-[11px] text-[#64748B]">
                          {item.city} - {item.property_type} -{" "}
                          {item.operation_type} -{" "}
                          {Number(item.price || 0).toLocaleString()}{" "}
                          {item.currency || ""}
                        </span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {loading && (
              <div className="ml-auto max-w-[92%] rounded-2xl bg-white px-3 py-2 text-[12px] font-bold text-[#1F3C88] shadow-sm">
                جاري تحليل طلبك...
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => sendMessage(item)}
                  disabled={loading}
                  className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#1F3C88] shadow-sm disabled:opacity-60"
                >
                  {item}
                </button>
              ))}
            </div>

            {showLeadForm && (
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <LeadCaptureForm
                  source="ai-agent"
                  onCreated={() => setShowLeadForm(false)}
                />
              </div>
            )}
          </div>

          <div className="border-t border-[#EEF2F7] bg-white p-3">
            <button
              onClick={() => setShowLeadForm((v) => !v)}
              className="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#EEF4FF] px-3 py-2 text-[12px] font-bold text-[#1F3C88]"
            >
              <Sparkles size={14} />
              اترك بياناتك كـ Lead
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => sendMessage()}
                disabled={loading}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F3C88] text-white disabled:opacity-60"
              >
                <Send size={16} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="min-w-0 flex-1 rounded-2xl border border-[#E6ECF5] px-3 text-sm outline-none"
                placeholder="اكتب طلبك..."
              />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1F3C88] to-[#18346F] px-5 py-3 text-sm font-black text-white shadow-[0_15px_35px_rgba(31,60,136,0.35)]"
      >
        <Bot size={19} />
        اسأل عقاري الذكي
        <MessageCircle size={17} />
      </button>
    </div>
  );
}
