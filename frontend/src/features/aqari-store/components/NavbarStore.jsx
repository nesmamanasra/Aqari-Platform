import React from "react";
import logo from "../../../assets/aqari_top_white.png";
import { ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NavbarStore() {
  const navigate = useNavigate();

  return (
    <nav className="relative w-full overflow-hidden bg-gradient-to-br from-[#1F3C88] via-[#1B3778] to-[#18346F] px-4 sm:px-6 lg:px-10">
      
      {/* خلفيات */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-8 left-10 h-24 w-24 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute right-10 top-4 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-20 w-20 rounded-full bg-emerald-300/10 blur-2xl"></div>
      </div>

      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Logo */}
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-white/10 p-2 shadow-md ring-1 ring-white/15 backdrop-blur-md" >
            <img
              src={logo}
              alt="Aqari"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Text */}
          <div>
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] text-white/85 backdrop-blur-md">
              <Home size={12} />
              Aqari Store
            </div>

            <h1 className="text-[18px] font-bold tracking-wide text-white sm:text-[22px]">
              تفاصيل العقار
            </h1>

            <p className="mt-0.5 max-w-[420px] text-[11px] leading-5 text-white/80 sm:text-[12px]">
              اكتشف كافة تفاصيل العقار بدقة وبطريقة أنيقة وسريعة.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-start lg:justify-end">
          <button
            onClick={() => navigate("/aqari-store")}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-medium text-white shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-[1px] hover:bg-white/20"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 transition group-hover:bg-white/25">
              <ArrowRight size={16} />
            </span>

            <div className="flex flex-col items-start text-right">
              <span className="text-[13px] font-semibold">
                العودة للمتجر
              </span>
              <span className="text-[10px] text-white/70">
                صفحة العقارات
              </span>
            </div>
          </button>
        </div>

      </div>
    </nav>
  );
}