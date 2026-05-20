import { motion } from "framer-motion";
import { Building2, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Container from "../../../shared/layout/Container";
import heroDevices from "../../../assets/hero_devices.png";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-[#F5F7FA]"
      dir="rtl"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-[-80px] h-64 w-64 rounded-full bg-[#1F3C88]/10 blur-3xl" />
        <div className="absolute top-20 left-[-100px] h-72 w-72 rounded-full bg-[#5B8CFF]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(#102A43_1px,transparent_1px),linear-gradient(90deg,#102A43_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <Container className="relative flex min-h-[calc(100vh-56px)] items-center">
        <div className="grid w-full items-center gap-8 md:grid-cols-2 lg:gap-10">
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-right"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#1F3C88]/10 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#1F3C88] shadow-sm md:mt-0 md:text-[13px]"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-[#1F3C88]" />
              منصة لإدارة العقارات عبر وسيط محترف
            </motion.div>

            {/* Title */}
            <h1 className="mt-4 text-[30px] font-extrabold leading-[1.15] text-[#102A43] md:text-[40px] lg:text-[46px]">
              إدارة عقاراتك
              <span className="block bg-gradient-to-l from-[#1F3C88] to-[#3E6FD8] bg-clip-text text-transparent">
                من خلال وسيط محترف
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-[560px] text-right text-[14px] leading-7 text-gray-600 md:text-[15px]">
              دع الوسيط العقاري يتولى إدارة عقاراتك بالكامل، من متابعة
              المستأجرين إلى تنظيم العقود وتحصيل المدفوعات، مع نظام ذكي يمنحك
              رؤية واضحة وتحكمًا كاملًا دون عناء.
            </p>

            {/* Cards */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3.5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F3C88]/10 text-[#1F3C88] sm:h-9 sm:w-9">
                  <Building2 size={16} />
                </div>
                <h3 className="text-[11px] font-bold text-[#102A43] sm:text-[14px]">
                  إدارة العقارات
                </h3>
                <p className="mt-1 text-[10px] font-bold leading-4 text-gray-600 sm:text-[12px] sm:leading-5">
                  إدارة ومتابعة العقارات بشكل منظم وواضح.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3.5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F3C88]/10 text-[#1F3C88] sm:h-9 sm:w-9">
                  <Users size={16} />
                </div>
                <h3 className="text-[11px] font-bold text-[#102A43] sm:text-[14px]">
                  إدارة المستأجرين
                </h3>
                <p className="mt-1 text-[10px] font-bold leading-4 text-gray-600 sm:text-[12px] sm:leading-5">
                  متابعة المستأجرين والتواصل والالتزامات بسهولة.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3.5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F3C88]/10 text-[#1F3C88] sm:h-9 sm:w-9">
                  <FileText size={16} />
                </div>
                <h3 className="text-[11px] font-bold text-[#102A43] sm:text-[14px]">
                  إدارة الرسائل
                </h3>
                <p className="mt-1 text-[10px] font-bold leading-4 text-gray-600 sm:text-[12px] sm:leading-5">
                  إدارة الرسائل والاستفسارات عبر الواتساب من قبل المالكين او
                  المستاجرين .
                </p>
              </div>
            </div>

            {/* CTA Card - Desktop Ultra */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="relative mb-8 mt-5 hidden w-full max-w-[365px] overflow-hidden rounded-[26px] border border-white/70 bg-white/75 p-4 shadow-[0_22px_60px_rgba(16,42,67,0.14)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_75px_rgba(31,60,136,0.20)] md:block"
            >
              <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#3E6FD8]/15 blur-2xl" />
              <div className="absolute -bottom-12 right-10 h-28 w-28 rounded-full bg-[#1F3C88]/15 blur-2xl" />

              <div className="relative">
                <span className="inline-flex rounded-full bg-[#1F3C88]/10 px-3 py-1 text-[11px] font-extrabold text-[#1F3C88]">
                  خدمة مخصصة للمالكين
                </span>

                <h3 className="mt-3 text-[19px] font-extrabold text-[#102A43]">
                  ابدأ مع وسيط عقاري اليوم
                </h3>

                <p className="mt-2 text-[13px] leading-6 text-gray-600">
                  اترك الإدارة اليومية للوسيط وركز على استثمارك ونمو أعمالك.
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/add-property")}
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-l from-[#1F3C88] to-[#3E6FD8] px-5 py-2.5 text-[13px] font-extrabold text-white shadow-[0_14px_30px_rgba(31,60,136,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(31,60,136,0.32)]"
                  >
                    أضف عقارك
                  </button>

                  <span className="text-[11px] font-bold text-gray-500">
                    خلال دقائق
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* IMAGE */}
          <div className="relative mx-auto mb-5 w-full max-w-[560px] md:mt-4">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* floating cards */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-4 right-0 z-10 hidden rounded-2xl border border-white/50 bg-white/85 px-3.5 py-2.5 shadow-xl backdrop-blur md:block"
              >
                <p className="text-[11px] font-medium text-gray-500">
                  العقود النشطة
                </p>
                <p className="mt-1 text-[18px] font-extrabold text-[#102A43]">
                  +1,200
                </p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-5 left-0 z-10 hidden rounded-2xl border border-white/50 bg-white/85 px-3.5 py-2.5 shadow-xl backdrop-blur md:block"
              >
                <p className="text-[11px] font-medium text-gray-500">
                  دقة البيانات
                </p>
                <p className="mt-1 text-[18px] font-extrabold text-[#102A43]">
                  99%
                </p>
              </motion.div>

              {/* image wrapper */}
              <div className="relative rounded-[24px] border border-white/60 bg-white/70 p-2.5 shadow-[0_24px_70px_rgba(16,42,67,0.12)] backdrop-blur-sm">
                <div className="rounded-[18px] bg-gradient-to-b from-white to-slate-100 p-2">
                  <motion.img
                    src={heroDevices}
                    alt="واجهة منصة عقارية لإدارة العقارات عبر وسيط"
                    className="w-full rounded-[14px] drop-shadow-xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* CTA Card - Mobile Ultra */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="relative mx-auto mb-8 mt-5 block w-full max-w-[340px] overflow-hidden rounded-[24px] border border-white/70 bg-white/80 p-4 text-right shadow-[0_20px_55px_rgba(16,42,67,0.13)] backdrop-blur-xl md:hidden"
            >
              <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-[#3E6FD8]/15 blur-2xl" />
              <div className="absolute -bottom-10 right-8 h-24 w-24 rounded-full bg-[#1F3C88]/15 blur-2xl" />

              <div className="relative">
                <span className="inline-flex rounded-full bg-[#1F3C88]/10 px-3 py-1 text-[11px] font-extrabold text-[#1F3C88]">
                  للمالكين
                </span>

                <h3 className="mt-3 text-[18px] font-extrabold text-[#102A43]">
                  أضف عقارك بسهولة
                </h3>

                <p className="mt-2 text-[13px] leading-6 text-gray-600">
                  اترك الإدارة للوسيط وركز على استثمارك.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/add-property")}
                  className="mt-4 w-full rounded-2xl bg-gradient-to-l from-[#1F3C88] to-[#3E6FD8] py-2.5 text-[13px] font-extrabold text-white shadow-[0_14px_30px_rgba(31,60,136,0.25)]"
                >
                  أضف عقارك
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}