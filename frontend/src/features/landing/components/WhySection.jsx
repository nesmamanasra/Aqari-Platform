import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "إدارة العقارات",
    points: [
      "الوسيط يتولى إضافة العقارات وتنظيمها ومتابعتها بشكل كامل",
      "عرض العقارات والتعامل مع الطلبات الواردة دون تدخل منك",
      "متابعة حالة كل عقار سواء كان متاحًا أو مؤجرًا بشكل مستمر",
      "ضمان تشغيل العقارات بأفضل شكل لتحقيق أعلى عائد ممكن",
    ],
    icon: (
      <svg
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21V11h6v10" />
      </svg>
    ),
  },
  {
    title: "إدارة المستأجرين والعقود",
    points: [
      {
        text: "الوسيط يتعامل مع المستأجرين بالكامل من أول تواصل حتى تسليم العقار",
        comingSoon: false,
      },
      {
        text: "توقيع العقود إلكترونيًا ومتابعة حالتها بشكل مباشر",
        comingSoon: true,
      },
      {
        text: "تنبيهات ذكية لمواعيد التجديد والانتهاء والمتابعات المهمة",
        comingSoon: true,
      },
      {
        text: "لوحة متابعة موحدة لكل العقود والمستأجرين في مكان واحد",
        comingSoon: true,
      },
    ],
    icon: (
      <svg
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
      </svg>
    ),
  },
  {
    title: "متابعة الدفعات والتحصيل",
    isComingCard: true,
    points: [
      "متابعة الدفعات والتحصيل بشكل آلي وأكثر تنظيمًا",
      "تنبيهات فورية للدفعات المتأخرة والمستحقة",
      "تقارير مالية أوضح تساعدك على متابعة الأداء بسهولة",
      "سجل دفعات منظم يوضح كل العمليات المالية الخاصة بعقاراتك",
    ],
    icon: (
      <svg
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    ),
  },
];

function ComingSoonIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path d="M12 8v4l2.5 2.5" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

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

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardsContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function WhySection() {
  return (
    <motion.section
      className="bg-white py-24"
      dir="rtl"
      id="features"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={headerVariants}
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center rounded-full bg-[#1F3C88]/10 px-4 py-1.5 text-sm font-medium text-[#1F3C88]"
          >
            لماذا تختار إدارة عقاراتك عبر وسيط؟
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="mt-5 text-3xl font-bold leading-tight text-[#102A43] md:text-4xl"
          >
            الوسيط يتولى كل شيء عنك وأنت تتابع بكل راحة
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 mb-10 text-base leading-8 text-gray-600 md:text-lg font-bold"
          >
            من إدارة العقارات إلى التعامل مع المستأجرين وتنظيم العقود وتحصيل
            الدفعات، يقوم الوسيط العقاري بإدارة كل التفاصيل اليومية نيابة عنك،
            بينما يمنحك النظام رؤية واضحة وتحكمًا كاملاً دون أي تعقيد.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={cardsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className={`group relative overflow-hidden rounded-3xl bg-white p-7 transition-all duration-300 hover:shadow-xl ${
                feature.isComingCard
                  ? "border border-dashed border-amber-300 shadow-[0_10px_35px_rgba(245,158,11,0.14)]"
                  : "border border-gray-200 shadow-sm"
              }`}
            >
              {feature.isComingCard && (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/90 via-white to-white" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-amber-100/40 blur-3xl"
                  />
                </>
              )}

              <div className="relative z-10">
                <motion.div
                  variants={itemVariants}
                  className="mb-5 flex items-center justify-between"
                >
                  <motion.div
                    whileHover={{ scale: 1.04, rotate: -1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${
                      feature.isComingCard
                        ? "bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white"
                        : "bg-[#1F3C88]/10 text-[#1F3C88] group-hover:bg-[#1F3C88] group-hover:text-white"
                    }`}
                  >
                    {feature.icon}
                  </motion.div>

                  {feature.isComingCard && (
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-sm">
                        <ComingSoonIcon />
                      </div>

                      <div className="text-left">
                        <div className="flex items-center gap-1 text-amber-700">
                          <LockIcon />
                          <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                            New Feature
                          </span>
                        </div>
                        <div className="text-2xl font-extrabold leading-none text-amber-600 md:text-3xl">
                          قريبًا
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <motion.h3
                  variants={itemVariants}
                  className={`text-xl font-bold ${
                    feature.isComingCard ? "text-amber-900" : "text-[#102A43]"
                  }`}
                >
                  {feature.title}
                </motion.h3>

                <motion.ul
                  className="mt-5 space-y-3"
                  variants={cardsContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                >
                  {feature.points.map((point, i) => (
                    <motion.li
                      key={i}
                      variants={itemVariants}
                      className={`flex items-start gap-3 text-sm leading-7 ${
                        feature.isComingCard ? "text-amber-900/80" : "text-gray-600"
                      }`}
                    >
                      {typeof point === "string" && !feature.isComingCard && (
                        <>
                          <span className="mt-2 h-2 w-2 rounded-full bg-[#1F3C88]" />
                          <span>{point}</span>
                        </>
                      )}

                      {typeof point === "string" && feature.isComingCard && (
                        <>
                          <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                            <LockIcon />
                          </span>
                          <span>{point}</span>
                        </>
                      )}

                      {typeof point !== "string" && (
                        <>
                          <span className="mt-2 h-2 w-2 rounded-full bg-[#1F3C88]" />

                          <div className="flex w-full items-center justify-between gap-2">
                            <span>{point.text}</span>

                            {point.comingSoon && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.35 }}
                                viewport={{ once: true }}
                                className="mr-auto flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                              >
                                <ComingSoonIcon />
                                قريبًا
                              </motion.span>
                            )}
                          </div>
                        </>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                  className={`mt-6 h-[2px] ${
                    feature.isComingCard ? "bg-amber-400" : "bg-[#1F3C88]"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom info */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 rounded-3xl border border-gray-200 bg-[#F8FAFC] px-6 py-10 text-center md:px-12"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl font-bold text-[#102A43]"
          >
            إدارة عقاراتك بدون تعب أو متابعة يومية
          </motion.h3>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-4 max-w-3xl text-base leading-8 text-gray-600"
          >
            مع الوسيط العقاري، لن تحتاج لمتابعة التفاصيل اليومية أو التعامل مع
            المستأجرين أو القلق حول العقود والدفعات. كل شيء يتم إدارته باحتراف،
            بينما تتابع أنت الأداء والنتائج بكل وضوح وسهولة.
          </motion.p>

          <motion.div
            variants={cardsContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {[
              "بدون متابعة يومية",
              "إدارة كاملة عنك",
              "تحصيل مضمون",
              "رؤية واضحة",
            ].map((tag, i) => (
              <motion.span
                key={i}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}