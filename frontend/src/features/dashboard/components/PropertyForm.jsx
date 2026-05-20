import React, { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function PropertyForm({
  editingItem,
  setEditingItem,
  onSuccess,
}) {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [owners, setOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [compressingImage, setCompressingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    owner_id: "",
    propertyName: "",
    propertyType: "فيلا",
    purchaseType: "بيع",
    city: "نابلس",
    price: "",
    currency: "ILS",
    status: "قيد الانتظار",
    description: "",
    image: "",
    video_url: "",
  });

  const fetchOwners = async () => {
    try {
      setLoadingOwners(true);

      const { data, error } = await supabase
        .from("owners")
        .select("id, full_name")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching owners:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        return;
      }

      setOwners(data || []);
    } catch (error) {
      console.error("Unexpected owners fetch error:", error);
    } finally {
      setLoadingOwners(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const resetForm = () => {
    setFormError("");
    setFormData({
      owner_id: "",
      propertyName: "",
      propertyType: "فيلا",
      purchaseType: "بيع",
      city: "نابلس",
      price: "",
      currency: "ILS",
      status: "قيد الانتظار",
      description: "",
      image: "",
      video_url: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem?.(null);
    resetForm();
  };

  const openAddModal = () => {
    setEditingItem?.(null);
    resetForm();
    setShowAddModal(true);
  };

  useEffect(() => {
    if (!editingItem) return;

    setFormError("");
    setFormData({
      owner_id: editingItem.owner_id || "",
      propertyName: editingItem.title || "",
      propertyType: editingItem.property_type || "فيلا",
      purchaseType: editingItem.operation_type || "بيع",
      city: editingItem.city || "نابلس",
      price:
        editingItem.price !== null && editingItem.price !== undefined
          ? String(editingItem.price)
          : "",
      currency: editingItem.currency || "ILS",
      status: editingItem.status || "قيد الانتظار",
      description: editingItem.description || "",
      image: editingItem.image || "",
      video_url: editingItem.video_url || "",
    });

    setShowAddModal(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  }, [editingItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
              reject(new Error("Canvas context not available"));
              return;
            }

            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;

            let { width, height } = img;

            const widthRatio = MAX_WIDTH / width;
            const heightRatio = MAX_HEIGHT / height;
            const ratio = Math.min(widthRatio, heightRatio, 1);

            width = Math.round(width * ratio);
            height = Math.round(height * ratio);

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
            resolve(compressedBase64);
          } catch (err) {
            reject(err);
          }
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = event.target?.result;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressingImage(true);

      const compressedImage = await compressImage(file);

      setFormData((prev) => ({
        ...prev,
        image: typeof compressedImage === "string" ? compressedImage : "",
      }));
    } catch (error) {
      console.error("Error compressing image:", error);
      setFormError("حدث خطأ أثناء تجهيز الصورة");
    } finally {
      setCompressingImage(false);
    }
  };

  const getVideoFilePath = (file) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "mp4";
    const safeName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}.${extension}`;

    return `properties/${safeName}`;
  };

  const removeOldVideoFromStorage = async (videoUrl) => {
    try {
      if (!videoUrl || !videoUrl.includes("/storage/v1/object/public/property-videos/")) {
        return;
      }

      const marker = "/storage/v1/object/public/property-videos/";
      const path = videoUrl.split(marker)[1];

      if (!path) return;

      const { error } = await supabase.storage
        .from("property-videos")
        .remove([path]);

      if (error) {
        console.error("Error removing old video:", error);
      }
    } catch (error) {
      console.error("Unexpected remove old video error:", error);
    }
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeInBytes = 25 * 1024 * 1024;

    if (!file.type.startsWith("video/")) {
      setFormError("يرجى اختيار ملف فيديو صحيح");
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
      return;
    }

    if (file.size > maxSizeInBytes) {
      setFormError("حجم الفيديو كبير جداً. الحد الأقصى 25MB");
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
      return;
    }

    try {
      setUploadingVideo(true);
      setFormError("");

      const oldVideoUrl = formData.video_url;
      const filePath = getVideoFilePath(file);

      const { error: uploadError } = await supabase.storage
        .from("property-videos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Video upload error:", uploadError);
        setFormError(uploadError.message || "حدث خطأ أثناء رفع الفيديو");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("property-videos")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl || "";

      if (!publicUrl) {
        setFormError("تعذر إنشاء رابط الفيديو");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        video_url: publicUrl,
      }));

      if (oldVideoUrl) {
        await removeOldVideoFromStorage(oldVideoUrl);
      }
    } catch (error) {
      console.error("Unexpected video upload error:", error);
      setFormError("حدث خطأ غير متوقع أثناء رفع الفيديو");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveVideo = async () => {
    const currentVideoUrl = formData.video_url;

    setFormData((prev) => ({
      ...prev,
      video_url: "",
    }));

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }

    if (editingItem?.id && currentVideoUrl) {
      await removeOldVideoFromStorage(currentVideoUrl);
    }
  };

  const handleSubmitProperty = async () => {
    if (submitting || compressingImage || uploadingVideo) return;

    if (!formData.owner_id) {
      setFormError("يرجى اختيار المالك");
      return;
    }

    if (!formData.propertyName.trim()) {
      setFormError("يرجى إدخال اسم العقار");
      return;
    }

    if (!formData.price.trim()) {
      setFormError("يرجى إدخال السعر");
      return;
    }

    if (!formData.description.trim()) {
      setFormError("يرجى إدخال وصف العقار");
      return;
    }

    const payload = {
      owner_id: formData.owner_id,
      title: formData.propertyName.trim(),
      property_type: formData.propertyType,
      operation_type: formData.purchaseType,
      city: formData.city,
      description: formData.description.trim(),
      price: Number(formData.price),
      currency: formData.currency,
      status: formData.status,
      image: formData.image || null,
      video_url: formData.video_url || null,
    };

    try {
      setSubmitting(true);
      setFormError("");

      if (editingItem?.id) {
        const { data, error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", editingItem.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating property:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          setFormError(error.message || "حدث خطأ أثناء تعديل العقار");
          return;
        }

        closeModal();

        if (onSuccess && data) {
          onSuccess(data, "update");
        }

        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("Error inserting property:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        setFormError(error.message || "حدث خطأ أثناء إضافة العقار");
        return;
      }

      closeModal();

      if (onSuccess && data) {
        onSuccess(data, "insert");
      }
    } catch (error) {
      console.error("Unexpected submit error:", error);
      setFormError("حدث خطأ غير متوقع");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={openAddModal}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#18346F] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1F3C88]"
      >
        <Plus size={16} />
        إضافة عقار
      </button>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#ECEEF2] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-5 py-4">
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-[#6B7280] transition hover:bg-[#F3F4F6]"
              >
                <X size={18} />
              </button>

              <h3 className="text-right text-lg font-semibold text-[#1F2937]">
                {editingItem ? "تعديل العقار" : "إضافة عقار جديد"}
              </h3>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-5 py-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  اسم المالك
                </label>
                <select
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-right text-sm text-[#374151] outline-none transition focus:border-[#18346F]"
                >
                  <option value="">
                    {loadingOwners ? "جاري تحميل المالكين..." : "اختر المالك"}
                  </option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  اسم العقار
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم العقار"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-right text-sm text-[#374151] outline-none transition focus:border-[#18346F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  نوع العقار
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-right text-sm text-[#374151] outline-none transition focus:border-[#18346F]"
                >
                  <option value="فيلا">فيلا</option>
                  <option value="شقة">شقة</option>
                  <option value="بيت">بيت</option>
                  <option value="محل">محل</option>
                  <option value="أرض">أرض</option>
                  <option value="مصيف">مصيف</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  نوع العملية
                </label>
                <select
                  name="purchaseType"
                  value={formData.purchaseType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-right text-sm text-[#374151] outline-none transition focus:border-[#18346F]"
                >
                  <option value="بيع">بيع</option>
                  <option value="إيجار">إيجار</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  مكان العقار
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-right text-sm text-[#374151] outline-none transition focus:border-[#18346F]"
                >
                  <option value="نابلس">نابلس</option>
                  <option value="رام الله">رام الله</option>
                  <option value="الخليل">الخليل</option>
                  <option value="جنين">جنين</option>
                  <option value="طولكرم">طولكرم</option>
                  <option value="القدس">القدس</option>
                  <option value="قلقيلية">قلقيلية</option>
                  <option value="طوباس">طوباس</option>
                  <option value="بيت لحم">بيت لحم</option>
                  <option value="سلفيت">سلفيت</option>
                  <option value="أريحا">أريحا</option>
                  <option value="غزة">غزة</option>
                  <option value="يافا">يافا</option>
                  <option value="حيفا">حيفا</option>
                  <option value="عكا">عكا</option>
                  <option value="الناصرة">الناصرة</option>
                  <option value="صفد">صفد</option>
                  <option value="الرملة">الرملة</option>
                  <option value="اللد">اللد</option>
                  <option value="بيسان">بيسان</option>
                  <option value="طبريا">طبريا</option>
                  <option value="أم الفحم">أم الفحم</option>
                  <option value="مناطق الداخل">مناطق الداخل</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  السعر
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="مثال: 250000"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-right text-sm text-[#374151] outline-none transition focus:border-[#18346F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  العملة
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-right text-sm text-[#374151] outline-none transition focus:border-[#18346F]"
                >
                  <option value="ILS">شيكل (₪)</option>
                  <option value="JOD">دينار (د.أ)</option>
                  <option value="USD">دولار ($)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  الحالة
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-right text-sm text-[#374151] outline-none transition focus:border-[#18346F]"
                >
                  <option value="قيد الانتظار">قيد الانتظار</option>
                  <option value="متاح">متاح</option>
                  <option value="تم البيع">تم البيع</option>
                  <option value="تم التأجير">تم التأجير</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  وصف العقار
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="اكتب وصفًا عن العقار"
                  className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-right text-sm text-[#374151] outline-none transition focus:border-[#18346F]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  صورة العقار
                </label>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-right text-sm text-[#374151] file:ml-3 file:rounded-lg file:border-0 file:bg-[#18346F] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#1F3C88]"
                  />

                  {formData.image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    >
                      إلغاء الصورة
                    </button>
                  )}
                </div>

                {compressingImage && (
                  <p className="mt-2 text-right text-sm text-[#6B7280]">
                    جاري ضغط الصورة...
                  </p>
                )}

                {formData.image && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB]">
                    <img
                      src={formData.image}
                      alt="preview"
                      loading="lazy"
                      className="h-56 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-right text-sm font-medium text-[#374151]">
                  فيديو العقار
                </label>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={handleVideoChange}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-right text-sm text-[#374151] file:ml-3 file:rounded-lg file:border-0 file:bg-[#18346F] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#1F3C88]"
                  />

                  {formData.video_url && (
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    >
                      إلغاء الفيديو
                    </button>
                  )}
                </div>

                {uploadingVideo && (
                  <p className="mt-2 text-right text-sm text-[#6B7280]">
                    جاري رفع الفيديو...
                  </p>
                )}

                {formData.video_url && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-black">
                    <video
                      src={formData.video_url}
                      controls
                      preload="metadata"
                      className="h-56 w-full object-cover"
                    />
                  </div>
                )}

                <p className="mt-2 text-right text-xs text-[#6B7280]">
                  يفضل رفع فيديو قصير وخفيف للحفاظ على سرعة الموقع. الحد الأقصى 25MB.
                </p>
              </div>

              {formError && (
                <div className="md:col-span-2">
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-right text-sm text-red-600">
                    {formError}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#EEF1F5] bg-white px-5 py-4">
              <button
                onClick={closeModal}
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#4B5563] transition hover:bg-[#f9fafb]"
              >
                إلغاء
              </button>

              <button
                onClick={handleSubmitProperty}
                disabled={submitting || compressingImage || uploadingVideo}
                className="rounded-xl bg-[#18346F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1F3C88] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {compressingImage
                  ? "جاري تجهيز الصورة..."
                  : uploadingVideo
                  ? "جاري رفع الفيديو..."
                  : submitting
                  ? "جاري الحفظ..."
                  : editingItem
                  ? "حفظ التعديلات"
                  : "إضافة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}