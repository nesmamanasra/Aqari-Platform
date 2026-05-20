import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FileText,
  Phone,
  ShieldCheck,
  Upload,
  UserRound,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";

const PROPERTY_TYPES = ["شقة", "بيت", "فيلا", "أرض", "محل", "مصيف"];
const OPERATION_TYPES = ["بيع", "إيجار"];
const CURRENCIES = ["شيكل", "دينار", "دولار"];
const CITIES = [
  "نابلس",
  "رام الله",
  "الخليل",
  "جنين",
  "طولكرم",
  "القدس",
  "قلقيلية",
  "طوباس",
  "بيت لحم",
  "سلفيت",
  "أريحا",
  "غزة",
  "يافا",
  "حيفا",
  "عكا",
  "الناصرة",
  "صفد",
  "الرملة",
  "اللد",
  "بيسان",
  "طبريا",
  "أم الفحم",
  "مناطق الداخل",
];

const initialForm = {
  full_name: "",
  national_id: "",
  phone: "",
  title: "",
  property_type: "",
  operation_type: "",
  city: "",
  description: "",
  price: "",
  currency: "شيكل",
  image: null,
  video: null,
};

export default function AddPropertyPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState("idle");
  const [message, setMessage] = useState("");

  const pricePreview = useMemo(() => {
    if (!form.price) return "";
    const num = Number(form.price);
    if (Number.isNaN(num)) return form.price;
    return new Intl.NumberFormat("ar-EG").format(num);
  }, [form.price]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.full_name.trim()) newErrors.full_name = "الاسم الكامل مطلوب";
    if (!form.national_id.trim()) newErrors.national_id = "رقم الهوية مطلوب";
    if (!form.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!form.title.trim()) newErrors.title = "عنوان العقار مطلوب";
    if (!form.property_type) newErrors.property_type = "نوع العقار مطلوب";
    if (!form.operation_type) newErrors.operation_type = "نوع العملية مطلوب";
    if (!form.city) newErrors.city = "المدينة مطلوبة";
    if (!form.price.toString().trim()) newErrors.price = "السعر مطلوب";
    if (!form.currency) newErrors.currency = "العملة مطلوبة";

    if (form.phone.trim() && !/^[0-9+\-\s]{8,20}$/.test(form.phone.trim())) {
      newErrors.phone = "رقم الهاتف غير صالح";
    }

    if (
      form.national_id.trim() &&
      !/^[0-9]{5,20}$/.test(form.national_id.trim())
    ) {
      newErrors.national_id = "رقم الهوية غير صالح";
    }

    if (form.price && (Number.isNaN(Number(form.price)) || Number(form.price) <= 0)) {
      newErrors.price = "أدخل سعرًا صحيحًا";
    }

    if (form.image) {
      if (!form.image.type.startsWith("image/")) {
        newErrors.image = "الملف المختار للصورة غير صالح";
      } else if (form.image.size > 10 * 1024 * 1024) {
        newErrors.image = "حجم الصورة يجب أن يكون أقل من 10MB";
      }
    }

    if (form.video) {
      if (!form.video.type.startsWith("video/")) {
        newErrors.video = "الملف المختار للفيديو غير صالح";
      } else if (form.video.size > 100 * 1024 * 1024) {
        newErrors.video = "حجم الفيديو يجب أن يكون أقل من 100MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
  };

  const uploadImageToStorage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `images/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const uploadVideoToStorage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `videos/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("property-videos")
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("property-videos")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      setSubmitState("loading");

      const { data: existingOwner, error: findOwnerError } = await supabase
        .from("owners")
        .select("id, full_name, national_id, phone")
        .eq("national_id", form.national_id.trim())
        .maybeSingle();

      if (findOwnerError) {
        throw findOwnerError;
      }

      let ownerId = existingOwner?.id;

      if (!ownerId) {
        const { data: insertedOwner, error: insertOwnerError } = await supabase
          .from("owners")
          .insert([
            {
              full_name: form.full_name.trim(),
              national_id: form.national_id.trim(),
              phone: form.phone.trim(),
            },
          ])
          .select()
          .single();

        if (insertOwnerError) {
          throw insertOwnerError;
        }

        ownerId = insertedOwner.id;
      }

      let imageUrl = null;
      let videoUrl = null;

      if (form.image) {
        imageUrl = await uploadImageToStorage(form.image);
      }

      if (form.video) {
        videoUrl = await uploadVideoToStorage(form.video);
      }

      const { error: insertPropertyError } = await supabase
        .from("properties")
        .insert([
          {
            owner_id: ownerId,
            title: form.title.trim(),
            image: imageUrl,
            property_type: form.property_type,
            operation_type: form.operation_type,
            city: form.city,
            description: form.description.trim() || null,
            price: Number(form.price),
            status: "قيد الانتظار",
            currency: form.currency,
            video_url: videoUrl,
          },
        ]);

      if (insertPropertyError) {
        throw insertPropertyError;
      }

      setSubmitState("success");
      setMessage(
        "تم إرسال بيانات العقار بنجاح. سيبقى العقار قيد الانتظار إلى حين مراجعة البيانات والتواصل معك من قبل الوسيط."
      );
      resetForm();
    } catch (error) {
      console.error("Add property error:", error);
      setSubmitState("error");
      setMessage(
        error?.message ||
          "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى."
      );
    }
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#F5F7FA]"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-120px] top-[-70px] h-72 w-72 rounded-full bg-[#1F3C88]/10 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-80px] h-72 w-72 rounded-full bg-[#5B8CFF]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(#102A43_1px,transparent_1px),linear-gradient(90deg,#102A43_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1F3C88]/10 bg-white px-4 py-2 text-sm font-semibold text-[#1F3C88] shadow-sm transition hover:bg-[#f8fbff]"
          >
            <ArrowRight size={16} />
            العودة للرئيسية
          </button>

          <div className="rounded-[30px] border border-white/60 bg-white/80 p-6 shadow-[0_24px_70px_rgba(16,42,67,0.08)] backdrop-blur-sm md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="text-right">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#1F3C88]/10 bg-[#F8FAFD] px-3.5 py-1.5 text-[12px] font-semibold text-[#1F3C88] shadow-sm md:text-[13px]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#1F3C88]" />
                  إضافة عقار جديد إلى منصة عقاري
                </div>

                <h1 className="mt-4 text-[30px] font-extrabold leading-[1.2] text-[#102A43] md:text-[40px] lg:text-[46px]">
                  أضف عقارك الآن
                  <span className="block bg-gradient-to-l from-[#1F3C88] to-[#3E6FD8] bg-clip-text text-transparent">
                    وسنتولى التواصل معك ومراجعة الطلب
                  </span>
                </h1>

                <p className="mt-4 max-w-[700px] text-[14px] leading-7 text-gray-600 md:text-[15px]">
                  يمكنك من خلال هذه الصفحة إرسال بيانات العقار وبيانات المالك
                  بسهولة، وسيتم تسجيل الطلب داخل النظام بحالة{" "}
                  <span className="font-extrabold text-[#1F3C88]">
                    قيد الانتظار
                  </span>
                  . بعد ذلك سيتواصل معك الوسيط المسؤول لمراجعة التفاصيل
                  والاتفاق على خطوات النشر، وعند الموافقة يتم تحويل حالة العقار
                  إلى <span className="font-extrabold text-[#1F3C88]">متاح</span>{" "}
                  ليظهر على منصة عقاري ستور.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <InfoCard
                    icon={<FileText size={18} />}
                    title="أرسل البيانات"
                    text="أدخل بيانات المالك والعقار بشكل واضح ومنظم."
                  />
                  <InfoCard
                    icon={<Phone size={18} />}
                    title="نتواصل معك"
                    text="يقوم الوسيط بمراجعة الطلب والتواصل معك لاستكمال الاتفاق."
                  />
                  <InfoCard
                    icon={<BadgeCheck size={18} />}
                    title="النشر بعد الموافقة"
                    text="لا يتم نشر العقار مباشرة، بل بعد تحويله إلى متاح."
                  />
                </div>
              </div>

              <div className="flex h-full items-stretch">
                <div className="w-full rounded-[28px] border border-[#1F3C88]/10 bg-gradient-to-br from-[#1F3C88] to-[#3E6FD8] p-6 text-white shadow-[0_24px_70px_rgba(31,60,136,0.22)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <ShieldCheck size={22} />
                  </div>

                  <h2 className="mt-5 text-[24px] font-extrabold leading-[1.3]">
                    ملاحظة مهمة قبل الإرسال
                  </h2>

                  <p className="mt-4 text-[14px] leading-7 text-white/90">
                    العقار الذي يتم إضافته من خلال هذه الصفحة لن يُنشر مباشرة على
                    المنصة، بل سيظهر داخل النظام بحالة{" "}
                    <span className="font-bold text-white">قيد الانتظار</span>{" "}
                    إلى حين التواصل معك من قبل الوسيط ومراجعة جميع التفاصيل.
                  </p>

                  <ul className="mt-6 space-y-3 text-[14px] text-white/95">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                      يتم حفظ بيانات المالك في جدول المالكين.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                      يتم حفظ العقار في جدول العقارات بحالة قيد الانتظار.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                      لا يظهر في عقاري ستور إلا بعد تحويل حالته إلى متاح.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="rounded-[30px] border border-white/60 bg-white/85 p-6 shadow-[0_24px_70px_rgba(16,42,67,0.08)] backdrop-blur-sm md:p-8"
        >
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[24px] font-extrabold text-[#102A43]">
                نموذج إضافة عقار
              </h2>
              <p className="mt-1 text-[14px] text-gray-600">
                يرجى تعبئة البيانات التالية بدقة حتى يتم مراجعة الطلب بسرعة.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#1F3C88]/8 px-4 py-2 text-sm font-bold text-[#1F3C88]">
              <BadgeCheck size={16} />
              الحالة عند الإرسال: قيد الانتظار
            </div>
          </div>

          {message ? (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
                submitState === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F3C88]/10 text-[#1F3C88]">
                  <UserRound size={18} />
                </div>
                <div>
                  <h3 className="text-[18px] font-extrabold text-[#102A43]">
                    بيانات المالك
                  </h3>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field
                  label="الاسم الكامل"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  error={errors.full_name}
                  placeholder="أدخل الاسم الكامل"
                />
                <Field
                  label="رقم الهوية"
                  name="national_id"
                  value={form.national_id}
                  onChange={handleChange}
                  error={errors.national_id}
                  placeholder="أدخل رقم الهوية"
                />
                <Field
                  label="رقم الهاتف"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F3C88]/10 text-[#1F3C88]">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-[18px] font-extrabold text-[#102A43]">
                    بيانات العقار
                  </h3>
                  <p className="text-sm text-gray-500">
                    سيتم حفظ العقار داخل النظام بحالة قيد الانتظار.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="عنوان العقار"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  error={errors.title}
                  placeholder="مثال: شقة للبيع في نابلس"
                />

                <SelectField
                  label="نوع العقار"
                  name="property_type"
                  value={form.property_type}
                  onChange={handleChange}
                  error={errors.property_type}
                  options={PROPERTY_TYPES}
                />

                <SelectField
                  label="نوع العملية"
                  name="operation_type"
                  value={form.operation_type}
                  onChange={handleChange}
                  error={errors.operation_type}
                  options={OPERATION_TYPES}
                />

                <SelectField
                  label="المدينة"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  error={errors.city}
                  options={CITIES}
                />

                <Field
                  label="السعر"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  error={errors.price}
                  placeholder="أدخل السعر"
                />

                <SelectField
                  label="العملة"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  error={errors.currency}
                  options={CURRENCIES}
                />

                <FileField
                  label="صورة العقار"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  error={errors.image}
                  fileName={form.image?.name}
                  helperText="يمكنك اختيار صورة للعقار من جهازك (اختياري)"
                  icon={<ImageIcon size={18} />}
                />

                <FileField
                  label="فيديو العقار"
                  name="video"
                  accept="video/*"
                  onChange={handleChange}
                  error={errors.video}
                  fileName={form.video?.name}
                  helperText="يمكنك اختيار فيديو توضيحي للعقار من جهازك (اختياري)"
                  icon={<Video size={18} />}
                />
              </div>

              <div className="mt-4">
                <TextAreaField
                  label="وصف العقار"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  error={errors.description}
                  placeholder="اكتب وصفًا مختصرًا وواضحًا عن العقار..."
                />
              </div>

              {pricePreview ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-[#102A43]">
                  السعر المدخل: {pricePreview} {form.currency}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={submitState === "loading"}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-l from-[#1F3C88] to-[#3E6FD8] px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(31,60,136,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(31,60,136,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitState === "loading"
                  ? "جاري إرسال الطلب..."
                  : "إرسال العقار"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F3C88]/10 text-[#1F3C88]">
        {icon}
      </div>
      <h3 className="text-sm font-extrabold text-[#102A43]">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#102A43]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-2xl border bg-[#F9FBFD] px-4 py-3 text-sm text-[#102A43] outline-none transition placeholder:text-gray-400 focus:bg-white ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-slate-200 focus:border-[#1F3C88]"
        }`}
      />
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, options = [] }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#102A43]">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border bg-[#F9FBFD] px-4 py-3 text-sm text-[#102A43] outline-none transition focus:bg-white ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-slate-200 focus:border-[#1F3C88]"
        }`}
      >
        <option value="">اختر</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#102A43]">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
        className={`w-full resize-none rounded-2xl border bg-[#F9FBFD] px-4 py-3 text-sm leading-7 text-[#102A43] outline-none transition placeholder:text-gray-400 focus:bg-white ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-slate-200 focus:border-[#1F3C88]"
        }`}
      />
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

function FileField({
  label,
  name,
  accept,
  onChange,
  error,
  fileName,
  helperText,
  icon,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#102A43]">
        {label}
      </label>

      <label
        htmlFor={name}
        className={`flex min-h-[54px] cursor-pointer items-center justify-between rounded-2xl border bg-[#F9FBFD] px-4 py-3 text-sm transition ${
          error
            ? "border-red-300"
            : "border-slate-200 hover:border-[#1F3C88] hover:bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F3C88]/10 text-[#1F3C88]">
            {icon || <Upload size={18} />}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-[#102A43]">
              {fileName || "اختر ملفًا من جهازك"}
            </p>
            <p className="text-xs text-gray-500">{helperText}</p>
          </div>
        </div>

        <div className="rounded-xl bg-[#1F3C88] px-3 py-2 text-xs font-bold text-white">
          اختيار ملف
        </div>
      </label>

      <input
        id={name}
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="hidden"
      />

      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}