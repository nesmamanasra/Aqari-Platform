import React, { useMemo, useRef, useState } from "react";
import {
  Download,
  Search,
  Printer,
  MoreHorizontal,
  Pencil,
  Trash2,
  Video,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useDashboardData } from "../context/DashboardDataContext";

function StatusBadge({ status }) {
  const styles = {
    "متاح": "bg-[#EAFBF0] text-[#22C55E]",
    "قيد الانتظار": "bg-[#FFF7E8] text-[#F59E0B]",
    "تم البيع": "bg-[#EEF2FF] text-[#4F46E5]",
    "تم التأجير": "bg-[#F3E8FF] text-[#9333EA]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-[2px] text-[10px] font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "—"}
    </span>
  );
}

function VideoBadge({ hasVideo }) {
  if (!hasVideo) {
    return <span className="text-[#9CA3AF]">—</span>;
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[10px] font-semibold text-[#1F3C88]">
      <Video size={12} />
      يوجد فيديو
    </span>
  );
}

export default function TableData({ onEdit, renderAddButton }) {
  const { properties, setProperties } = useDashboardData();

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const menuRef = useRef(null);

  const currencyMap = {
    ILS: "₪",
    JOD: "د.أ",
    USD: "$",
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return properties;

    return properties.filter((item) => {
      return (
        String(item.id || "").toLowerCase().includes(value) ||
        String(item.owners?.full_name || "").toLowerCase().includes(value) ||
        String(item.title || "").toLowerCase().includes(value) ||
        String(item.property_type || "").toLowerCase().includes(value) ||
        String(item.operation_type || "").toLowerCase().includes(value) ||
        String(item.city || "").toLowerCase().includes(value) ||
        String(item.price || "").toLowerCase().includes(value) ||
        String(item.currency || "").toLowerCase().includes(value) ||
        String(item.status || "").toLowerCase().includes(value) ||
        String(item.description || "").toLowerCase().includes(value)
      );
    });
  }, [properties, searchTerm]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا العقار؟");
    if (!confirmed) return;

    setDeleteLoadingId(id);
    setProperties((prev) => prev.filter((item) => item.id !== id));

    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) {
      console.error("Error deleting property:", error);
    }

    setMenuOpenId(null);
    setDeleteLoadingId(null);
  };

  return (
    <section className="bg-[#F7F8FA] p-4" dir="rtl">
      <div className="mx-auto max-w-[1400px]">
        <div className="rounded-2xl border border-[#ECEEF2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-2 border-b border-[#EEF1F5] px-3 py-3 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="text-right text-[14px] font-semibold text-[#1F2937]">
              العقارات
            </h3>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-[12px] text-[#9CA3AF]">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-right outline-none placeholder:text-[#9CA3AF]"
                />
              </div>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] font-medium text-[#4B5563] hover:bg-[#f9fafb]">
                <Download size={14} />
                تصدير
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] font-medium text-[#4B5563] hover:bg-[#f9fafb]">
                <Printer size={14} />
                طباعة
              </button>

              {renderAddButton}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[2050px] w-full">
              <thead>
                <tr className="border-b border-[#EEF1F5] bg-[#FCFCFD] text-right">
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">#</th>
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">المالك</th>
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">الصورة</th>
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">الفيديو</th>
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">العقار</th>
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">النوع</th>
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">العملية</th>
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">المدينة</th>
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">الوصف</th>
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">السعر</th>
                  <th className="px-3 py-2 text-[10px] text-[#9CA3AF]">الحالة</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>

              <tbody className="text-[12px]">
                {filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="group border-b border-[#F3F4F6] hover:bg-[#18346F]"
                  >
                    <td className="px-3 py-2 group-hover:text-white">{index + 1}</td>

                    <td className="px-3 py-2 group-hover:text-white">
                      {item.owners?.full_name || "—"}
                    </td>

                    <td className="px-3 py-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title || "property"}
                          loading="lazy"
                          className="h-10 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-[#9CA3AF]">—</span>
                      )}
                    </td>

                    <td className="px-3 py-2">
                      <VideoBadge hasVideo={!!item.video_url} />
                    </td>

                    <td className="px-3 py-2 group-hover:text-white">{item.title}</td>
                    <td className="px-3 py-2 group-hover:text-white">{item.property_type}</td>
                    <td className="px-3 py-2 group-hover:text-white">{item.operation_type}</td>
                    <td className="px-3 py-2 group-hover:text-white">{item.city}</td>
                    <td className="px-3 py-2 group-hover:text-white">{item.description}</td>
                    <td className="px-3 py-2 group-hover:text-white">
                      {item.price} {currencyMap[item.currency] || item.currency || "₪"}
                    </td>

                    <td className="px-3 py-2">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="relative px-3 py-2">
                      <button
                        onClick={() =>
                          setMenuOpenId(menuOpenId === item.id ? null : item.id)
                        }
                      >
                        <MoreHorizontal size={14} />
                      </button>

                      {menuOpenId === item.id && (
                        <div
                          ref={menuRef}
                          className="absolute left-3 top-9 z-20 rounded-xl bg-white shadow"
                        >
                          <button
                            onClick={() => {
                              onEdit(item);
                              setMenuOpenId(null);
                            }}
                            className="flex gap-2 px-3 py-2 text-[12px]"
                          >
                            تعديل <Pencil size={12} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteLoadingId === item.id}
                            className="flex gap-2 px-3 py-2 text-[12px] text-red-600 disabled:opacity-50"
                          >
                            {deleteLoadingId === item.id
                              ? "جاري الحذف..."
                              : "حذف"}
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={12} className="py-6 text-center text-gray-400">
                      لا توجد بيانات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}