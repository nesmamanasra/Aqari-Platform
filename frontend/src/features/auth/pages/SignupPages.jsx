import { Eye, EyeOff, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import logo from "../../../assets/logo_top.png";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/auth";

export default function SignupPages() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    setErrorMessage("");

    if (
      !cleanFullName ||
      !cleanEmail ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setErrorMessage("يرجى تعبئة جميع الحقول");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    try {
      setLoading(true);

      await auth.signUp({
        fullName: cleanFullName,
        email: cleanEmail,
        password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Signup error:", err);

      if (
        err?.message?.includes("User already registered") ||
        err?.message?.includes("already") ||
        err?.code === "user_already_exists"
      ) {
        setErrorMessage("هذا البريد الإلكتروني مستخدم بالفعل");
      } else {
        setErrorMessage(err?.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {errorMessage && (
        <div className="fixed left-1/2 top-5 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2">
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 shadow-lg">
            <div className="mt-0.5 text-red-500">
              <AlertCircle size={18} />
            </div>

            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-red-600">
                {errorMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="text-gray-400 transition hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col lg:flex-row">
        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2 lg:px-16">
          <div className="w-full max-w-[430px]">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Aqari" className="h-20 w-auto" />
            </div>

            <div className="text-center lg:text-right">
              <h1 className="text-[42px] font-semibold leading-tight text-[#102A43]">
                إنشاء حساب
              </h1>
              <p className="mt-3 text-sm text-[#8a8a8a]">
                انضم الآن وابدأ باستخدام النظام بسهولة من اليوم الأول
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSignup}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#3a3a3a]">
                  الاسم
                </label>
                <input
                  type="text"
                  placeholder="Roger Gerrard"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 outline-none transition focus:border-[#4f46e5]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#3a3a3a]">
                  البريد الالكتروني
                </label>
                <input
                  type="email"
                  placeholder="sellostore@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="h-12 w-full rounded-lg border border-[#e6e6e6] bg-white px-4 text-sm text-[#222] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#3a3a3a]">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="5ellostore."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="h-12 w-full rounded-lg border border-[#e6e6e6] bg-white px-4 pr-12 text-sm text-[#222] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9b9b9b]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#3a3a3a]">
                  تاكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="5ellostore."
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="h-12 w-full rounded-lg border border-[#e6e6e6] bg-white px-4 pr-12 text-sm text-[#222] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "إخفاء تأكيد كلمة المرور"
                        : "إظهار تأكيد كلمة المرور"
                    }
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9b9b9b]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-lg bg-gradient-to-b from-[#1F3C88] to-[#18346F] text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "جاري إنشاء الحساب..." : "أنشئ الحساب"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e5e5e5]"></div>
              <span className="text-sm text-[#9b9b9b]">او انشئ حساب باستخدام</span>
              <div className="h-px flex-1 bg-[#e5e5e5]"></div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#e6e6e6] bg-white text-sm font-medium text-[#333] transition hover:border-indigo-300 hover:bg-[#fafaff]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.4-6 6.6l.1-.1 6.2 5.2C35.2 40 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#e6e6e6] bg-white text-sm font-medium text-[#333] transition hover:border-indigo-300 hover:bg-[#fafaff]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.365 1.43c0 1.14-.418 1.998-1.255 2.574-.836.576-1.55.864-2.143.864-.038-.13-.057-.29-.057-.48 0-.96.33-1.83.99-2.61.66-.78 1.457-1.216 2.39-1.308.05.16.075.313.075.46ZM20.93 17.06c-.29.67-.635 1.31-1.035 1.92-.547.82-.995 1.39-1.345 1.71-.54.53-1.12.8-1.74.81-.44 0-.97-.13-1.59-.39-.62-.26-1.19-.39-1.71-.39-.55 0-1.14.13-1.77.39-.63.26-1.14.4-1.53.42-.6.03-1.2-.25-1.8-.84-.39-.35-.86-.94-1.41-1.77-.59-.89-1.08-1.92-1.47-3.09-.42-1.26-.63-2.48-.63-3.66 0-1.35.29-2.51.87-3.49.46-.79 1.07-1.41 1.84-1.86.77-.45 1.6-.68 2.49-.69.49 0 1.14.15 1.96.45.81.3 1.33.45 1.56.45.17 0 .74-.18 1.7-.54.91-.33 1.67-.47 2.29-.42 1.69.14 2.96.8 3.81 1.97-1.51.91-2.26 2.18-2.25 3.81.01 1.27.47 2.33 1.4 3.18.42.4.9.71 1.42.92-.11.32-.23.63-.36.93Z" />
                </svg>
                Apple
              </button>
            </div>

            <p className="mt-7 text-center text-sm text-[#8f8f8f] lg:text-left">
              لديك حساب بالفعل؟{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-[#102A43] hover:text-indigo-700"
              >
                تسجيل دخول
              </button>
            </p>

            <div className="mt-16 flex flex-col gap-3 text-xs text-[#9c9c9c] sm:flex-row sm:items-center sm:justify-between">
              <span>© 2025 عقاري. جميع الحقوق محفوظة.</span>
              <button className="hover:text-[#666]">سياسة الخصوصية</button>
            </div>
          </div>
        </div>

        <div className="hidden w-full p-4 lg:block lg:w-1/2">
          <div className="relative flex h-full min-h-[720px] items-center overflow-hidden rounded-[28px] bg-gradient-to-b from-[#1F3C88] to-[#18346F] px-12 py-14 text-white">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-white/5"></div>
              <div className="absolute top-24 left-16 h-56 w-56 rounded-full bg-white/5"></div>
              <div className="absolute bottom-10 left-10 h-44 w-44 rounded-[40px] border border-white/5"></div>
              <div className="absolute bottom-16 right-16 h-52 w-52 rounded-[40px] border border-white/5"></div>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[520px]">
              <div className="mb-10">
                <h2 className="max-w-[420px] text-[42px] font-semibold leading-[1.2]">
                  أدر فريقك وعملياتك بسهولة تامة.
                </h2>
                <p className="mt-5 max-w-[410px] text-sm leading-7 text-white/80">
                  سجّل الدخول للوصول إلى لوحة التحكم الخاصة بك وإدارة فريقك وأعمالك.
                </p>
              </div>

              <div className="relative mt-8">
                <div className="rounded-[22px] bg-white p-5 shadow-2xl">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-[#4a42ff] p-4 text-white">
                      <p className="text-[11px] text-white/70">إجمالي المبيعات</p>
                      <h3 className="mt-3 text-2xl font-semibold">$189,374</h3>
                      <div className="mt-6 h-1.5 w-14 rounded-full bg-white/30">
                        <div className="h-1.5 w-9 rounded-full bg-white"></div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#f8f8fc] p-4">
                      <p className="text-[11px] text-[#7b7b8f]">أداء المحادثات</p>
                      <h3 className="mt-3 text-xl font-semibold text-[#1d1d1f]">
                        00:01:30
                      </h3>
                      <div className="mt-5 flex h-12 items-end gap-1">
                        <span className="h-3 w-6 rounded-full bg-indigo-200"></span>
                        <span className="h-5 w-6 rounded-full bg-indigo-300"></span>
                        <span className="h-7 w-6 rounded-full bg-indigo-400"></span>
                        <span className="h-10 w-6 rounded-full bg-indigo-500"></span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#f8f8fc] p-4">
                      <p className="text-[11px] text-[#7b7b8f]">نظرة عامة على المبيعات</p>
                      <div className="mt-4 flex h-20 items-end justify-center gap-2">
                        <span className="h-8 w-4 rounded-full bg-indigo-200"></span>
                        <span className="h-14 w-4 rounded-full bg-indigo-300"></span>
                        <span className="h-20 w-4 rounded-full bg-indigo-500"></span>
                        <span className="h-11 w-4 rounded-full bg-indigo-300"></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#f0f0f4] bg-[#fcfcff] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#252525]">
                        معاملات المنتجات
                      </h4>
                      <button className="text-xs text-[#8b8b9c]">المزيد</button>
                    </div>

                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div
                          key={item}
                          className="grid grid-cols-4 items-center gap-3 rounded-xl bg-white px-3 py-3"
                        >
                          <div>
                            <div className="h-3 w-20 rounded bg-[#ececf4]"></div>
                          </div>
                          <div>
                            <div className="h-3 w-14 rounded bg-[#ececf4]"></div>
                          </div>
                          <div>
                            <div className="h-3 w-16 rounded bg-[#ececf4]"></div>
                          </div>
                          <div className="flex justify-end">
                            <div className="h-3 w-12 rounded bg-indigo-200"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute -right-10 top-12 w-[230px] rounded-[22px] bg-white p-5 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#1d1d1f]">
                      فئات المبيعات
                    </h4>
                    <button className="text-xs text-[#8b8b9c]">شهري</button>
                  </div>

                  <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-[14px] border-indigo-500 border-r-indigo-200 border-b-indigo-300">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#1d1d1f]">6,248</p>
                      <span className="text-xs text-[#8b8b9c]">وحدة</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#6d6d7a]">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
                        <span>التسويق</span>
                      </div>
                      <span>44%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6d6d7a]">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-300"></span>
                        <span>المبيعات</span>
                      </div>
                      <span>31%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6d6d7a]">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-200"></span>
                        <span>أخرى</span>
                      </div>
                      <span>25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Right Side */}
      </div>
    </div>
  );
}