import React from "react";
import { useDashboardData } from "../context/DashboardDataContext";
import {
  CalendarDays,
  Download,
  Home,
  Building2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "إجمالي الدخل",
    value: "$ 3,228,278",
    decimal: ".05",
    change: "10%",
    trend: "up",
    subtitle: "مقارنة بالأسبوع الماضي",
    compare: "$2,734,134.05",
    icon: TrendingUp,
    color: "text-[#4F7CFF]",
    iconBg: "from-[#4F7CFF]/15 to-[#7DA2FF]/10",
    glow: "from-[#4F7CFF]/20 to-transparent",
  },
  {
    title: "إجمالي المصروفات",
    value: "$ 1,228,920",
    decimal: ".12",
    change: "8%",
    trend: "down",
    subtitle: "مقارنة بالأسبوع الماضي",
    compare: "$1,334,420.12",
    icon: BarChart3,
    color: "text-[#A855F7]",
    iconBg: "from-[#A855F7]/15 to-[#D3A8FF]/10",
    glow: "from-[#A855F7]/20 to-transparent",
  },
  {
    title: "الوحدات المباعة",
    value: "278",
    decimal: "",
    change: "14%",
    trend: "up",
    subtitle: "مقارنة بالأسبوع الماضي",
    compare: "244 وحدة",
    icon: Home,
    color: "text-[#22C55E]",
    iconBg: "from-[#22C55E]/15 to-[#86EFAC]/10",
    glow: "from-[#22C55E]/20 to-transparent",
  },
  {
    title: "مشاهدات العقارات",
    value: "18,940",
    decimal: "",
    change: "22%",
    trend: "up",
    subtitle: "مقارنة بالأسبوع الماضي",
    compare: "15,420 مشاهدة",
    icon: Building2,
    color: "text-[#F59E0B]",
    iconBg: "from-[#F59E0B]/15 to-[#FCD34D]/10",
    glow: "from-[#F59E0B]/20 to-transparent",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

function StatCard({ item, index }) {
  const Icon = item.icon;
  const isUp = item.trend === "up";

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.glow} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="absolute -left-12 -top-12 h-28 w-28 rounded-full bg-white/40 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.1 + index * 0.06, duration: 0.45 }}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.iconBg} ${item.color} shadow-[0_8px_24px_rgba(15,23,42,0.08)]`}
          >
            <Icon size={20} />
          </motion.div>

          <div className="min-w-0 flex-1 text-right">
            <p
              className={`mb-1 text-[11px] font-bold tracking-wide ${item.color}`}
            >
              {item.title}
            </p>

            <div className="flex items-end justify-end gap-1">
              {item.decimal ? (
                <span className="mb-[2px] text-[12px] font-semibold text-[#94A3B8]">
                  {item.decimal}
                </span>
              ) : null}

              <h3 className="text-[15px] sm:text-[15px] text-[3px] font-black leading-none text-[#0F172A]">
                {item.value}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 text-right">
          <span className="text-[11px] font-medium text-[#64748B]">
            {item.compare}
          </span>
          <span className="text-[11px] text-[#CBD5E1]">•</span>
          <span className="text-[11px] text-[#94A3B8]">{item.subtitle}</span>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isUp
                ? "bg-[#ECFDF3] text-[#16A34A]"
                : "bg-[#FEF2F2] text-[#DC2626]"
            }`}
          >
            {item.change}
            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function MetricRow({ icon, label, value, color }) {
  const Icon = icon;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: -4 }}
      className="flex items-center justify-between gap-3 rounded-2xl border border-[#EEF2F7] bg-[#F8FAFC] px-4 py-3 transition-all duration-300 hover:border-[#DCE7F5] hover:bg-white"
    >
      <span className="text-[13px] sm:text-[14px] font-bold text-[#0F172A]">
        {value}
      </span>

      <div className="flex items-center gap-3">
        <span className="text-[12px] sm:text-[13px] font-medium text-[#334155]">
          {label}
        </span>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: color }}
        >
          <Icon size={17} className="text-[#1E3A8A]" />
        </div>
      </div>
    </motion.div>
  );
}

export default function MainSection() {
  const { properties, owners, leads } = useDashboardData();

  const totalProperties = properties?.length || 0;
  const availableProperties = properties?.filter((item) => item.status === "متاح").length || 0;
  const pendingProperties = properties?.filter((item) => item.status === "قيد الانتظار").length || 0;
  const newLeads = leads?.filter((item) => item.status === "جديد").length || 0;

  const dashboardStats = [
    { ...stats[0], title: "إجمالي العقارات", value: totalProperties.toLocaleString(), decimal: "", compare: availableProperties + " عقار متاح", subtitle: "كل العقارات داخل النظام", change: "+" },
    { ...stats[1], title: "قيد الانتظار", value: pendingProperties.toLocaleString(), decimal: "", compare: "بانتظار الموافقة", subtitle: "طلبات إضافة عقار", change: "!" },
    { ...stats[2], title: "عدد المالكين", value: (owners?.length || 0).toLocaleString(), decimal: "", compare: "مالك داخل النظام", subtitle: "بيانات المالكين", change: "+" },
    { ...stats[3], title: "Leads الجدد", value: newLeads.toLocaleString(), decimal: "", compare: (leads?.length || 0) + " Lead إجمالي", subtitle: "عملاء مهتمين", change: "+" },
  ];

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#F8FBFF_0%,#F4F7FB_45%,#EEF3F9_100%)] p-3 sm:p-4 md:p-6"
      dir="rtl"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#4F7CFF]/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-100px] h-[280px] w-[280px] rounded-full bg-[#A855F7]/10 blur-3xl" />
        <div className="absolute left-[30%] top-[20%] h-[220px] w-[220px] rounded-full bg-[#22C55E]/10 blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-[1450px]"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 overflow-hidden rounded-[30px] border border-white/70 bg-white/75 p-4 shadow-[0_15px_50px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:p-5 lg:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-right">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#EEF4FF] px-3 py-1.5 text-[11px] font-bold text-[#315EDE]">
                <Sparkles size={13} />
                لوحة تحكم عقاري الذكية
              </div>

              <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-black leading-tight text-[#0F172A]">
                نظرة شاملة على أداء العقارات
              </h1>

              <p className="mt-2 max-w-[700px] text-[12px] sm:text-[13px] leading-6 text-[#64748B]">
                تابع الإيرادات، حركة الوحدات، المشاهدات، وأكثر العقارات طلباً من
                خلال واجهة أنيقة، سريعة، ومريحة بصرياً.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white px-4 py-3 text-[12px] font-bold text-[#475569] shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:bg-[#F8FAFC]"
              >
                <CalendarDays size={16} />
                الشهر الماضي
              </motion.button>

              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1F3C88] to-[#315EDE] px-5 py-3 text-[12px] font-bold text-white shadow-[0_14px_30px_rgba(49,94,222,0.28)] transition"
              >
                <Download size={16} />
                تصدير التقرير
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {dashboardStats.map((item, index) => (
            <StatCard key={index} item={item} index={index} />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_15px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF3D6] to-[#FFE9B0] text-[#D97706] shadow-sm">
                <Sparkles size={18} />
              </div>

              <h3 className="text-right text-[15px] sm:text-[17px] font-black text-[#0F172A]">
                أكثر الوحدات طلباً
              </h3>
            </div>

            <motion.div
              whileHover={{ y: -3 }}
              className="mb-5 rounded-[24px] border border-[#F6E7BD] bg-gradient-to-r from-[#FFF9E9] to-[#FFF4D8] p-4 shadow-[0_10px_24px_rgba(245,158,11,0.08)]"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#F59E0B] shadow-sm">
                  ✦
                </div>

                <div className="text-right">
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#7C5A10]">
                    احصل على تحليلات أعمق
                  </p>
                  <p className="mt-1 text-[12px] sm:text-[13px] leading-6 text-[#8A6A1F]">
                    فعّل الخطة المميزة لمشاهدة سلوك العملاء واتجاهات الطلب بشكل
                    أكثر دقة.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="mb-6 text-right">
              <div className="flex items-end justify-end gap-2">
                <span className="mb-1 text-[12px] text-[#94A3B8]">وحدة</span>
                <h4 className="text-[26px] sm:text-[30px] font-black leading-none text-[#0F172A]">
                  28,278
                </h4>
              </div>

              <p className="mt-2 text-[12px] sm:text-[13px] text-[#94A3B8]">
                تم بيعها أو تأجيرها على مدار الفترة المحددة
              </p>
            </div>

            <motion.div variants={containerVariants} className="space-y-3">
              <MetricRow
                icon={Home}
                label="منزل"
                value="16,978"
                color="#EAF1FF"
              />
              <MetricRow
                icon={Building2}
                label="شقة"
                value="7,548"
                color="#EEFDF3"
              />
              <MetricRow
                icon={Building2}
                label="فيلا"
                value="4,278"
                color="#FFF7E8"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_15px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          >
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <h3 className="text-right text-[15px] sm:text-[17px] font-black text-[#0F172A]">
                أداء العقارات خلال السنة
              </h3>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#E6ECF5] bg-[#F8FBFF] px-3 py-2 text-[11px] sm:text-[12px] font-medium text-[#334155]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4F7CFF]" />
                  278 عقار تم بيعه
                </div>

                <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#E6ECF5] bg-[#FFF9F0] px-3 py-2 text-[11px] sm:text-[12px] font-medium text-[#334155]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                  328 عقار للإيجار
                </div>
              </div>
            </div>

            <div className="relative mt-3 h-[280px] sm:h-[330px] md:h-[360px] w-full overflow-hidden rounded-[24px] border border-[#EDF2F7] bg-[linear-gradient(180deg,#FCFDFE_0%,#F7FAFD_100%)] px-2 py-2 sm:px-3">
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scaleX: 0.92 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="absolute left-0 right-0 border-t border-dashed border-[#E8EEF6]"
                    style={{ top: `${i * 25}%` }}
                  />
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 px-2 sm:px-4 pb-2 text-[9px] sm:text-[10px] font-medium text-[#94A3B8]">
                {[
                  "يناير",
                  "فبراير",
                  "مارس",
                  "أبريل",
                  "مايو",
                  "يونيو",
                  "يوليو",
                  "أغسطس",
                  "سبتمبر",
                  "أكتوبر",
                  "نوفمبر",
                  "ديسمبر",
                ].map((month) => (
                  <span key={month} className="truncate">
                    {month}
                  </span>
                ))}
              </div>

              <svg
                viewBox="0 0 1000 320"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="blueStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4F7CFF" />
                    <stop offset="100%" stopColor="#76A1FF" />
                  </linearGradient>

                  <linearGradient id="orangeStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>

                  <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F7CFF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#4F7CFF" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="orangeArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d="M20 130 C80 210,140 80,200 120 S320 130,380 100 S500 260,560 180 S680 90,740 140 S860 180,980 120 L980 320 L20 320 Z"
                  fill="url(#blueArea)"
                />

                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.7, ease: "easeInOut", delay: 0.15 }}
                  d="M20 160 C90 90,150 180,220 120 S340 70,420 140 S540 60,620 190 S760 100,840 130 S920 50,980 150 L980 320 L20 320 Z"
                  fill="url(#orangeArea)"
                />

                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d="M20 130 C80 210,140 80,200 120 S320 130,380 100 S500 260,560 180 S680 90,740 140 S860 180,980 120"
                  fill="none"
                  stroke="url(#blueStroke)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.7, ease: "easeInOut", delay: 0.15 }}
                  d="M20 160 C90 90,150 180,220 120 S340 70,420 140 S540 60,620 190 S760 100,840 130 S920 50,980 150"
                  fill="none"
                  stroke="url(#orangeStroke)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}