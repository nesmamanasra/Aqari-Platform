import { Eye, EyeOff, AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/auth";
import { supabase } from "../../../lib/supabase";
import logo from "../../../assets/logo_top.png";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const navigate = useNavigate();

  const showToast = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const clearToast = () => {
    setMessage("");
  };

  useEffect(() => {
    let isMounted = true;

    const setupRecoverySession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          if (isMounted) setSessionReady(true);
          return;
        }

        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) throw error;

          if (isMounted) {
            setSessionReady(true);
            window.history.replaceState({}, document.title, "/reset-password");
          }
          return;
        }

        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.substring(1)
          : window.location.hash;

        const hashParams = new URLSearchParams(hash);
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (type === "recovery" && access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) throw error;

          if (isMounted) {
            setSessionReady(true);
            window.history.replaceState({}, document.title, "/reset-password");
          }
          return;
        }

        if (isMounted) {
          showToast("رابط إعادة التعيين غير صالح أو منتهي الصلاحية");
        }
      } catch (err) {
        console.error("Recovery session error:", err);
        if (isMounted) {
          showToast("تعذر تفعيل رابط إعادة التعيين، جرّبي طلب رابط جديد");
        }
      }
    };

    setupRecoverySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    clearToast();

    if (!sessionReady) {
      showToast("جاري التحقق من رابط إعادة التعيين...");
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      showToast("يرجى تعبئة جميع الحقول");
      return;
    }

    if (password.length < 6) {
      showToast("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      showToast("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      setLoading(true);
      await auth.updatePassword(password);
      showToast("تم تحديث كلمة المرور بنجاح", "success");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1200);
    } catch (err) {
      console.error("Update password error:", err);
      showToast(err?.message || "حدث خطأ أثناء تحديث كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {message && (
        <div className="fixed left-1/2 top-5 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2">
          <div
            className={`flex items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-lg ${
              messageType === "success"
                ? "border border-green-200"
                : "border border-red-200"
            }`}
          >
            <div
              className={`mt-0.5 ${
                messageType === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              <AlertCircle size={18} />
            </div>

            <div className="flex-1 text-right">
              <p
                className={`text-sm font-medium ${
                  messageType === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            </div>

            <button
              type="button"
              onClick={clearToast}
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
              <img src={logo} alt="عقاري" className="h-20 w-auto" />
            </div>

            <div className="mb-10 text-center lg:text-right">
              <h2 className="text-[42px] font-semibold leading-tight text-[#102A43]">
                تعيين كلمة مرور جديدة
              </h2>
              <p className="mt-3 text-sm text-[#8a8a8a]">
                أدخل كلمة المرور الجديدة ثم أكدها للمتابعة.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleUpdatePassword}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#3a3a3a]">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (message) clearToast();
                    }}
                    className="h-12 w-full rounded-lg border border-[#e6e6e6] bg-white px-4 pr-12 text-sm text-[#222] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9b9b9b]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#3a3a3a]">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (message) clearToast();
                    }}
                    className="h-12 w-full rounded-lg border border-[#e6e6e6] bg-white px-4 pr-12 text-sm text-[#222] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    type="button"
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
                disabled={loading || !sessionReady}
                className="h-12 w-full rounded-lg bg-gradient-to-b from-[#1F3C88] to-[#18346F] text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? "جاري الحفظ..."
                  : !sessionReady
                  ? "جاري التحقق من الرابط..."
                  : "حفظ كلمة المرور الجديدة"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#8f8f8f] lg:text-left">
              تذكرت كلمة المرور؟{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-[#102A43] hover:text-indigo-700"
              >
                العودة لتسجيل الدخول
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
                  حماية حسابك تبدأ من كلمة مرور قوية.
                </h2>
                <p className="mt-5 max-w-[410px] text-sm leading-7 text-white/80">
                  قم بتحديث كلمة المرور الخاصة بك للمتابعة والوصول الآمن إلى لوحة التحكم.
                </p>
              </div>

              <div className="relative mt-8">
                <div className="rounded-[22px] bg-white p-5 shadow-2xl">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-[#4a42ff] p-4 text-white">
                      <p className="text-[11px] text-white/70">أمان الحساب</p>
                      <h3 className="mt-3 text-2xl font-semibold">100%</h3>
                      <div className="mt-6 h-1.5 w-14 rounded-full bg-white/30">
                        <div className="h-1.5 w-10 rounded-full bg-white"></div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#f8f8fc] p-4">
                      <p className="text-[11px] text-[#7b7b8f]">تحديث فوري</p>
                      <h3 className="mt-3 text-xl font-semibold text-[#1d1d1f]">
                        آمن وسريع
                      </h3>
                      <div className="mt-5 flex h-12 items-end gap-1">
                        <span className="h-3 w-6 rounded-full bg-indigo-200"></span>
                        <span className="h-5 w-6 rounded-full bg-indigo-300"></span>
                        <span className="h-7 w-6 rounded-full bg-indigo-400"></span>
                        <span className="h-10 w-6 rounded-full bg-indigo-500"></span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#f8f8fc] p-4">
                      <p className="text-[11px] text-[#7b7b8f]">الوصول للحساب</p>
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
                        التحقق من البيانات
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
                      حالة الأمان
                    </h4>
                    <button className="text-xs text-[#8b8b9c]">الآن</button>
                  </div>

                  <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-[14px] border-indigo-500 border-r-indigo-200 border-b-indigo-300">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#1d1d1f]">آمن</p>
                      <span className="text-xs text-[#8b8b9c]">الحساب</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#6d6d7a]">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
                        <span>كلمة مرور قوية</span>
                      </div>
                      <span>44%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6d6d7a]">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-300"></span>
                        <span>تحديث الحساب</span>
                      </div>
                      <span>31%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6d6d7a]">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-200"></span>
                        <span>دخول آمن</span>
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