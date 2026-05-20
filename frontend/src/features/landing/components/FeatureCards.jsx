import { motion } from "framer-motion";
import { Building2, FileText, ShieldCheck, Headphones } from "lucide-react";

const stats = [
  { value: "+500", label: "عقار تتم إدارته بكفاءة عالية", icon: Building2 },
  { value: "+300", label: "عقد تم إنجازه بكل سلاسة", icon: FileText },
  { value: "99%", label: "دقة في البيانات واتخاذ القرار", icon: ShieldCheck },
  { value: "24/7", label: "دعم مستمر في أي وقت تحتاجه", icon: Headphones },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55 },
  },
};

export default function FeatureCards() {
  return (
    <motion.section
      className="relative overflow-hidden py-14 md:py-20"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {/* ✅ Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-property.jpg')" }}
      />

      {/* ✅ Overlay خفيف فقط */}
      <div className="absolute inset-0 bg-white/70" />

      {/* ✨ effects (بدون شبكة) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-[8%] h-56 w-56 rounded-full bg-[#1F3C88]/10 blur-3xl" />
        <div className="absolute bottom-0 left-[8%] h-64 w-64 rounded-full bg-[#3E6FD8]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center rounded-full border border-[#1F3C88]/10 bg-[#1F3C88]/5 px-4 py-1.5 text-[12px] font-semibold text-[#1F3C88] md:text-[13px]"
          >
            مؤشرات المنصة
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="mt-4 text-2xl font-extrabold text-[#102A43] md:text-4xl"
          >
            أرقام تعكس قوة منصة عقاري
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-3 max-w-2xl text-sm text-[#486581] md:text-base font-bold"
          >
            تجربة متكاملة تساعدك على إدارة العقارات والعقود والمستأجرين بطريقة
            أكثر وضوحًا واحترافية من مكان واحد.
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
        >
          {stats.map(({ value, label, icon: Icon }) => (
            <motion.div
              key={value}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/85 p-5 text-center shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:shadow-[0_18px_42px_rgba(15,23,42,0.10)]"
            >
              {/* top line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#1F3C88] via-[#3E6FD8] to-[#7AA2FF]" />

              {/* glow */}
              <div className="absolute -top-8 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-[#1F3C88]/10 blur-2xl" />

              <div className="relative">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-[#1F3C88]/10 to-[#3E6FD8]/10 text-[#1F3C88]">
                  <Icon size={20} />
                </div>

                <div className="mt-4 text-2xl font-extrabold text-[#102A43] md:text-3xl">
                  {value}
                </div>

                <div className="mx-auto my-3 h-px w-14 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                <p className="text-sm text-[#17365d] md:text-[14px]">
                  {label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}