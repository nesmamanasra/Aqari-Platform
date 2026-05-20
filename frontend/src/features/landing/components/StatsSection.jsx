import React from "react";
import {
  Building2,
  Users,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";

const STATS = [
  {
    title: "إدارة العقارات",
    desc: "الوسيط يتولى إدارة عقاراتك بالكامل من عرضها ومتابعتها لضمان تشغيلها بأفضل شكل",
    Icon: Building2,
  },
  {
    title: "إدارة المستأجرين",
    desc: "يتعامل الوسيط مع المستأجرين نيابة عنك من التواصل إلى متابعة الالتزامات اليومية",
    Icon: Users,
  },
  {
    title: "متابعة الدفعات",
    desc: "الوسيط يتابع جميع الدفعات ويضمن تحصيلها في الوقت المحدد دون تأخير أو ضياع",
    Icon: CreditCard,
  },
  {
    title: "لوحة تحكم واضحة",
    desc: "تابع كل ما يقوم به الوسيط من خلال لوحة تحكم تمنحك رؤية كاملة وتحكم ذكي",
    Icon: LayoutDashboard,
  },
];

export default function StatsSection() {
  return (
    <section className="relative py-16" dir="rtl" id="forwhom">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F8FAFC]" />

      <div className="relative mx-auto max-w-6xl px-4">

        {/* Title */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#1F3C88]/10 text-[#1F3C88] px-4 py-1 rounded-full text-sm mb-4">
            كل ما يقدمه لك الوسيط العقاري
          </span>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            إدارة كاملة لعقاراتك بدون أي جهد منك
          </h2>

          <p className="mt-3 text-slate-600 text-sm md:text-base">
            الوسيط يتولى كل التفاصيل، وأنت تتابع كل شيء بسهولة من مكان واحد
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ title, desc, Icon }, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-tr from-[#1F3C88]/5 to-transparent" />

              {/* Icon */}
              <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1F3C88]/10">
                <Icon className="h-7 w-7 text-[#1F3C88]" strokeWidth={1.8} />
              </div>

              {/* Title */}
              <h3 className="relative text-lg font-semibold text-slate-900">
                {title}
              </h3>

              {/* Desc */}
              <p className="relative mt-2 text-sm leading-6 text-slate-600">
                {desc}
              </p>

              {/* Hover line */}
              <div className="mt-4 h-[2px] w-0 bg-[#1F3C88] transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button className="bg-[#1F3C88] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#18346F] transition">
            ابدأ بإدارة عقاراتك عبر وسيط الآن
          </button>
        </div>

      </div>
    </section>
  );
}