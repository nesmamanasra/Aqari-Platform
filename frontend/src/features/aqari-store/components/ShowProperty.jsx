import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Home,
  Tag,
  CircleDollarSign,
  MessageCircle,
  ShieldCheck,
  PhoneCall,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import LeadCaptureForm from "../../leads/components/LeadCaptureForm";
import { buildPropertyWhatsAppMessage, openWhatsAppMessage } from "../../../shared/utils/whatsapp";

function getCurrencyLabel(currency) {
  const map = {
    ILS: "شيكل",
    USD: "دولار",
    JOD: "دينار",
    EUR: "يورو",
    GBP: "جنيه إسترليني",
  };

  const normalized = String(currency || "").trim().toUpperCase();
  return map[normalized] || currency || "";
}

function formatPrice(price, currency) {
  const formattedPrice = Number(price || 0).toLocaleString();
  const currencyLabel = getCurrencyLabel(currency);

  return currencyLabel
    ? `${formattedPrice} ${currencyLabel}`
    : formattedPrice;
}

export default function ShowProperty() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState("image");

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setProperty(data);
      setActiveMedia(data?.video_url ? "video" : "image");
    }

    setLoading(false);
  };

  const handleWhatsApp = () => {
    openWhatsAppMessage(buildPropertyWhatsAppMessage(property));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <div className="flex h-[70vh] items-center justify-center">
          <div className="rounded-2xl bg-white px-7 py-5 text-center shadow-md">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#1F3C88]/20 border-t-[#1F3C88]" />
            <p className="text-[14px] font-medium text-gray-600">
              جاري تحميل تفاصيل العقار...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <div className="flex h-[70vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-lg">
            <h2 className="text-xl font-bold text-[#1F3C88]">
              لم يتم العثور على العقار
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              يبدو أن العقار غير موجود أو تم حذفه من قاعدة البيانات.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasVideo = !!property.video_url;
  const hasImage = !!property.image;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#18346F]/80 to-[#F5F7FA]" />

        <div className="relative mx-auto max-w-[1400px] px-4 pb-8 pt-5 sm:px-6 lg:px-10">
          <div className="grid gap-5 lg:grid-cols-[1.55fr_.8fr]">
            <div className="relative overflow-hidden rounded-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.28)] bg-black">
              {activeMedia === "video" && hasVideo ? (
                <video
                  src={property.video_url}
                  controls
                  preload="metadata"
                  playsInline
                  className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[420px]"
                />
              ) : hasImage ? (
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[420px]"
                />
              ) : (
                <div className="flex h-[260px] w-full items-center justify-center bg-[#0F172A] text-white sm:h-[340px] lg:h-[420px]">
                  لا توجد وسائط متوفرة
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute right-4 top-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  {property.operation_type}
                </span>
                <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  {property.property_type}
                </span>
                {hasVideo && (
                  <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    يوجد فيديو
                  </span>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className="max-w-[800px]">
                  <p className="mb-2 text-[11px] font-medium tracking-[0.18em] text-white/75 uppercase">
                    Aqari Store
                  </p>

                  <h1 className="text-xl font-bold leading-tight text-white sm:text-3xl">
                    {property.title}
                  </h1>

                  <div className="mt-2 flex items-center gap-2 text-xs text-white/85 sm:text-sm">
                    <MapPin size={15} />
                    <span>{property.city}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-gray-100 sm:p-6">
                <p className="text-[13px] font-medium text-gray-400">
                  السعر المطلوب
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1F3C88]/10 text-[#1F3C88]">
                    <CircleDollarSign size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#1F3C88]">
                      {formatPrice(property.price, property.currency)}
                    </h2>
                    <p className="mt-1 text-[13px] text-gray-500">
                      قيمة العقار المعروضة حالياً
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2.5">
                  <div className="rounded-xl bg-[#F8FAFC] px-3 py-2.5">
                    <p className="text-[11px] text-gray-400">نوع العقار</p>
                    <p className="mt-1 text-[14px] font-semibold text-gray-800">
                      {property.property_type}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] px-3 py-2.5">
                    <p className="text-[11px] text-gray-400">نوع العملية</p>
                    <p className="mt-1 text-[14px] font-semibold text-gray-800">
                      {property.operation_type}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] px-3 py-2.5">
                    <p className="text-[11px] text-gray-400">المدينة</p>
                    <p className="mt-1 text-[14px] font-semibold text-gray-800">
                      {property.city}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] bg-gradient-to-br from-[#1F3C88] via-[#18346F] to-[#10295A] p-5 text-white shadow-[0_18px_45px_rgba(31,60,136,0.25)] sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <h3 className="text-[17px] font-bold">معلومة مهمة</h3>
                    <p className="mt-2 text-[13px] leading-6 text-white/85">
                      إذا كنت تريد معرفة المزيد حول هذا العقار أو ترتيب تواصل
                      مباشر، يمكنك التحدث مع فريقنا بكل سهولة عبر واتساب.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-[13px] font-bold text-white shadow-lg transition duration-300 hover:-translate-y-[1px] hover:scale-[1.01]"
                >
                  <MessageCircle size={17} />
                  تواصل عبر واتساب
                </button>
              </div>
            </div>
          </div>

          {(hasImage || hasVideo) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {hasImage && (
                <button
                  type="button"
                  onClick={() => setActiveMedia("image")}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[12px] font-semibold transition ${
                    activeMedia === "image"
                      ? "bg-white text-[#1F3C88] shadow-md"
                      : "bg-white/15 text-white backdrop-blur-md"
                  }`}
                >
                  <ImageIcon size={15} />
                  الصورة
                </button>
              )}

              {hasVideo && (
                <button
                  type="button"
                  onClick={() => setActiveMedia("video")}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[12px] font-semibold transition ${
                    activeMedia === "video"
                      ? "bg-white text-[#1F3C88] shadow-md"
                      : "bg-white/15 text-white backdrop-blur-md"
                  }`}
                >
                  <Video size={15} />
                  الفيديو
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[1.55fr_.8fr]">
          <div className="space-y-5">
            <div className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] ring-1 ring-gray-100 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F3C88]/10 text-[#1F3C88]">
                  <Home size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1F3C88]">
                    المعلومات الأساسية
                  </h2>
                  <p className="mt-1 text-[13px] text-gray-500">
                    عرض مختصر ومنظم لكامل البيانات الأساسية للعقار
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-[#FAFBFC] p-4 transition hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F3C88]/10 text-[#1F3C88]">
                      <Tag size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">نوع العملية</p>
                      <p className="mt-1 text-[14px] font-semibold text-gray-800">
                        {property.operation_type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FAFBFC] p-4 transition hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F3C88]/10 text-[#1F3C88]">
                      <Home size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">نوع العقار</p>
                      <p className="mt-1 text-[14px] font-semibold text-gray-800">
                        {property.property_type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FAFBFC] p-4 transition hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F3C88]/10 text-[#1F3C88]">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">الموقع</p>
                      <p className="mt-1 text-[14px] font-semibold text-gray-800">
                        {property.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FAFBFC] p-4 transition hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F3C88]/10 text-[#1F3C88]">
                      <CircleDollarSign size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">السعر</p>
                      <p className="mt-1 text-[14px] font-semibold text-gray-800">
                        {formatPrice(property.price, property.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FAFBFC] p-4 transition hover:shadow-md sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F3C88]/10 text-[#1F3C88]">
                      <Video size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">الفيديو</p>
                      <p className="mt-1 text-[14px] font-semibold text-gray-800">
                        {hasVideo ? "متوفر لهذا العقار" : "غير متوفر"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {hasVideo && (
              <div className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] ring-1 ring-gray-100 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F3C88]/10 text-[#1F3C88]">
                    <Video size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1F3C88]">
                      فيديو العقار
                    </h2>
                    <p className="mt-1 text-[13px] text-gray-500">
                      استعراض مرئي سريع للعقار بجودة مناسبة وسرعة جيدة
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[24px] bg-black shadow-inner">
                  <video
                    src={property.video_url}
                    controls
                    preload="metadata"
                    playsInline
                    className="max-h-[520px] w-full bg-black"
                  />
                </div>
              </div>
            )}

            <div className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] ring-1 ring-gray-100 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-9 w-1 rounded-full bg-gradient-to-b from-[#1F3C88] to-[#18346F]" />
                <div>
                  <h2 className="text-lg font-bold text-[#1F3C88]">
                    وصف العقار
                  </h2>
                  <p className="mt-1 text-[13px] text-gray-500">
                    كافة التفاصيل والمعلومات الوصفية الخاصة بالعقار
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#FAFBFC] p-4 sm:p-5">
                <p className="text-sm leading-7 text-gray-600">
                  {property.description || "لا يوجد وصف متوفر لهذا العقار حالياً."}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:pt-0">
            <div className="sticky top-6 rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-gray-100 sm:p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1F3C88]/10 px-3 py-1.5 text-[11px] font-semibold text-[#1F3C88]">
                <PhoneCall size={13} />
                فريق عقاري جاهز لخدمتك
              </div>

              <h3 className="text-xl font-bold leading-snug text-[#1F3C88]">
                هل أعجبك هذا العقار؟
              </h3>

              <p className="mt-3 text-[13px] leading-6 text-gray-600">
                إذا كنت ترغب في معرفة المزيد يمكنك التواصل مع فريقنا، وسنقوم
                بالرد عليك بسرعة وتزويدك بكامل التفاصيل اللازمة.
              </p>

              <button
                onClick={handleWhatsApp}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-[13px] font-bold text-white shadow-lg transition duration-300 hover:-translate-y-[1px] hover:scale-[1.01]"
              >
                <MessageCircle size={17} />
                تواصل الآن عبر واتساب
              </button>

              <div className="mt-5 rounded-2xl border border-[#1F3C88]/10 bg-[#F8FAFF] p-4">
                <p className="text-[12px] leading-6 text-gray-600">
                  ملاحظة: قد تختلف بعض التفاصيل البسيطة حسب آخر تحديث للعقار،
                  لذلك يفضل التواصل المباشر للحصول على أحدث المعلومات.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ring-1 ring-gray-100 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#1F3C88]">اترك بياناتك لهذا العقار</h3>
                <p className="mt-1 text-[13px] leading-6 text-gray-500">سيتم حفظ الطلب داخل Lead System ليتابع معك فريق عقاري.</p>
              </div>
              <LeadCaptureForm property={property} source="property-details" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}