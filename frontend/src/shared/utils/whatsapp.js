export const AQARI_WHATSAPP_PHONE = "972597851386";

export function openWhatsAppMessage(message, phone = AQARI_WHATSAPP_PHONE) {
  const cleanPhone = String(phone || "").replace(/[^0-9]/g, "");
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function buildPropertyWhatsAppMessage(property, propertyUrl = window.location.href) {
  const price = Number(property?.price || 0).toLocaleString();
  const currency = property?.currency || "";
  return `مرحباً 👋\nأرغب بالاستفسار عن العقار التالي:\n\n📌 ${property?.title || ""}\n🏠 ${property?.property_type || ""}\n📍 ${property?.city || ""}\n💰 ${price} ${currency}\n🔗 ${propertyUrl}\n\nأرجو تزويدي بمزيد من التفاصيل.`;
}

export function buildLeadWhatsAppMessage(lead) {
  return `مرحباً ${lead?.full_name || ""} 👋\nمعك فريق عقاري. وصلنا طلبك بخصوص ${lead?.property_type || "عقار"} في ${lead?.city || "المدينة المطلوبة"}.\n\nيسعدنا مساعدتك واختيار أفضل الخيارات المناسبة لطلبك.`;
}
