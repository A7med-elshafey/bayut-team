import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProjects } from "../services/api";

export default function UnderConstructionProjects() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // === helpers ===
  const fmtHandover = (v) => {
    if (!v) return null;
    // سنة فقط
    if (/^\d{4}$/.test(v)) return v;
    // سنة-شهر
    if (/^\d{4}-\d{2}$/.test(v)) {
      const [y, m] = v.split("-").map(Number);
      const d = new Date(Date.UTC(y, m - 1, 1));
      try {
        return new Intl.DateTimeFormat("ar-SA", { month: "long", year: "numeric" }).format(d);
      } catch {
        return `${y}-${String(m).padStart(2, "0")}`;
      }
    }
    // تاريخ كامل
    const d = new Date(v);
    if (!isNaN(d)) {
      try {
        return new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long", year: "numeric" }).format(d);
      } catch {
        return d.toLocaleDateString("ar-SA");
      }
    }
    return String(v);
  };

  const sortKey = (p) => {
    const v = p?.handoverDate;
    if (!v) return 99999999; // ا最後
    if (/^\d{4}$/.test(v)) return Number(v) * 100 + 12; // ديسمبر من نفس السنة
    if (/^\d{4}-\d{2}$/.test(v)) return Number(v.replace("-", ""));
    const d = new Date(v);
    if (!isNaN(d)) return d.getFullYear() * 100 + (d.getMonth() + 1);
    return 99999999;
  };

  useEffect(() => {
    setLoading(true);
    fetchProjects()
      .then((list) => {
        const filtered = list.filter(
          (p) =>
            p.category?.label === category && p.status === "under-construction"
        );
        // رتب حسب أقرب موعد تسليم لو موجود
        filtered.sort((a, b) => sortKey(a) - sortKey(b));
        setItems(filtered);
      })
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <p className="p-8">جار التحميل...</p>;

  return (
    <div className="pt-24 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-green-700 mb-6 text-right">
        {category} — تحت الإنشاء
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.category.key}/${p.id}/pdfs`} // ✅ صححنا المسار
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-3"
          >
            <img
              src={p.cover}
              alt={p.name}
              className="w-full h-48 object-cover rounded-lg"
              loading="lazy"
            />
            <div className="mt-3 text-right">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-green-800">{p.name}</div>

                {p.handoverDate && (
                  <span className="text-[11px] md:text-xs px-2 py-1 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-200 whitespace-nowrap">
                    موعد التسليم: {fmtHandover(p.handoverDate)}
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-500">{p.category?.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
