import { supabase } from "../../../lib/supabase";

export const auth = {
  async signUp({ fullName, email, password }) {
    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanFullName,
          role: "admin",
        },
      },
    });

    if (error) throw error;

    const user = data?.user;
    if (!user) {
      throw new Error("فشل إنشاء المستخدم");
    }

    const { error: adminError } = await supabase.from("admins").upsert({
      id: user.id,
      full_name: cleanFullName,
      email: cleanEmail,
      role: "admin",
    });

    if (adminError) throw adminError;

    return data;
  },

  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) throw error;

    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },

  // 🔥 إرسال رابط إعادة تعيين كلمة المرور
  async resetPassword(email) {
    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },

  // 🔥 تحديث كلمة المرور
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return data;
  },
};