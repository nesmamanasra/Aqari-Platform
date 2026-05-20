import logo from "../../../assets/logo_top.png";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF4FF]">

      {/* Glow خفيف بالخلفية */}
      <div className="absolute h-[300px] w-[300px] rounded-full bg-[#1F3C88]/10 blur-3xl" />

      {/* Wrapper */}
      <div className="relative flex flex-col items-center">

        {/* 🔵 الدائرة المتحركة */}
        <div className="absolute h-20 w-20 rounded-full border-4 border-transparent border-t-[#1F3C88] border-r-[#1F3C88]/40 animate-spin" />

        {/* اللوجو */}
        <img
          src={logo}
          alt="Aqari"
          className="h-10 w-auto object-contain md:h-10 mt-5"
        />

      
      </div>
    </div>
  );
}