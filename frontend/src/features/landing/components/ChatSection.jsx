import { useState } from "react";
import { motion } from "framer-motion";

const topics = [
  "عرض عقار",
  "استفسار عام",
  "طلب خدمة",
  "شراكة",
  "أخرى",
];

const contactInfo = [
  {
    title: "تواصل سريع",
    desc: "نستقبل استفساراتك ونرتب معك أفضل طريقة للمتابعة حسب نوع الطلب الذي ترغب به.",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: "فهم دقيق لاحتياجك",
    desc: "نراجع رسالتك بشكل واضح لنقدم لك الرد أو الخدمة الأنسب بطريقة منظمة وسهلة.",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "متابعة مرنة",
    desc: "يمكننا التواصل معك بالطريقة الأنسب لك سواء عبر الهاتف أو واتساب أو حسب ما تفضله.",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ChatSection() {
  const [selectedTopic, setSelectedTopic] = useState("عرض عقار");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | error | success | loading

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
      return;
    }

    try {
      setStatus("loading");

      const phone = "972597851386";

      const message = `مرحباً 👋
أرغب بعرض عقار لدي على منصة عقاري.

الاسم: ${form.name.trim()}
رقم الهاتف: ${form.phone.trim()}
نوع الطلب: ${selectedTopic}
${
  form.message.trim()
    ? `تفاصيل إضافية: ${form.message.trim()}`
    : "أرغب بمعرفة المتطلبات والخطوات اللازمة لعرض العقار."
}`;

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      setStatus("success");

      setTimeout(() => {
        window.open(url, "_blank");
        setForm({
          name: "",
          phone: "",
          message: "",
        });
        setSelectedTopic("عرض عقار");
        setStatus("idle");
      }, 400);
    } catch (err) {
      console.error("Error opening WhatsApp:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <motion.section
      dir="rtl"
      className="w-full bg-white py-3 "
      id="contact"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mx-auto mb-14 max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center rounded-full bg-[#1F3C88]/10 px-4 py-1.5 text-sm font-semibold text-[#1F3C88]"
          >
            تواصل معنا
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="mt-5 text-3xl font-bold leading-tight text-[#102A43] md:text-4xl"
          >
            نحن هنا لمساعدتك في عرض عقارك والوصول إلى المهتمين بسهولة
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-base leading-8 text-gray-600 md:text-lg font-bold"
          >
            أرسل لنا بياناتك الأساسية، وسنتواصل معك عبر واتساب لمساعدتك في معرفة
            الخطوات والمتطلبات اللازمة لعرض عقارك بطريقة واضحة وسريعة.
          </motion.p>
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-[32px] border border-gray-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="grid lg:grid-cols-2">
            <motion.div
              className="order-1 bg-gradient-to-b from-[#1F3C88] via-[#18346F] to-[#102A43] p-8 text-white md:p-10 lg:order-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={itemVariants} className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  متاحون لاستقبال الرسائل
                </div>

                <h3 className="text-2xl font-bold leading-snug md:text-3xl">
                  دعنا نفهم احتياجك بشكل أفضل
                </h3>

                <p className="mt-4 text-sm leading-8 text-white/80 md:text-base">
                  إذا كان لديك عقار وتود عرضه، يمكننا مساعدتك في فهم الخطوات
                  المطلوبة والتواصل معك بطريقة سهلة وسريعة عبر واتساب.
                </p>
              </motion.div>

              <motion.div className="space-y-4" variants={containerVariants}>
                {contactInfo.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                        {item.icon}
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm leading-7 text-white/75">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                {["واتساب", "عرض عقار", "متابعة سريعة"].map((tag) => (
                  <motion.span
                    key={tag}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="order-2 bg-white p-8 md:p-10 lg:order-1"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-2xl font-bold text-[#102A43]">
                  أرسل طلبك
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  املأ البيانات التالية وسنحوّلك مباشرة إلى واتساب لبدء التواصل
                  معنا بخصوص عرض العقار.
                </p>
              </motion.div>

              <motion.div className="flex flex-col gap-5" variants={containerVariants}>
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#102A43]">
                      الاسم الكامل
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="أدخل الاسم الكامل"
                      className="rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#1F3C88] focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#102A43]">
                      رقم الهاتف
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+970 5X XXX XXXX"
                      className="rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#1F3C88] focus:bg-white"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-[#102A43]">
                    اختر الموضوع
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <motion.button
                        key={topic}
                        type="button"
                        onClick={() => setSelectedTopic(topic)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          selectedTopic === topic
                            ? "border-[#1F3C88] bg-[#1F3C88]/10 font-semibold text-[#1F3C88]"
                            : "border-gray-200 bg-white text-gray-600 hover:border-[#1F3C88]/40 hover:text-[#1F3C88]"
                        }`}
                      >
                        {topic}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#102A43]">
                    تفاصيل إضافية
                    <span className="mr-2 text-xs font-normal text-gray-400">
                      (اختياري)
                    </span>
                  </label>

                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="مثلاً: لدي شقة للبيع في رام الله وأرغب بمعرفة خطوات عرضها"
                    className="resize-none rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-3 text-sm leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#1F3C88] focus:bg-white"
                  />
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleSubmit}
                  disabled={status === "success" || status === "loading"}
                  className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 ${
                    status === "success"
                      ? "cursor-default bg-green-600"
                      : status === "error"
                      ? "bg-red-600"
                      : status === "loading"
                      ? "cursor-wait bg-[#18346F]"
                      : "bg-[#1F3C88] hover:bg-[#18346F] active:scale-[0.99]"
                  }`}
                >
                  {status === "success" ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      جاري تحويلك إلى واتساب
                    </>
                  ) : status === "error" ? (
                    "يرجى تعبئة الاسم ورقم الهاتف"
                  ) : status === "loading" ? (
                    "جاري تجهيز الرسالة..."
                  ) : (
                    <>
                      تواصل عبر واتساب
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}