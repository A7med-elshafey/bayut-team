import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProjects } from "../services/api";

export default function CategoryProjects() {
  const { category, status } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // تقويم ميلادي بالعربي (ar-EG) وأرقام لاتينية
  const fmtHandover = (v) => {
    if (!v) return "—";
    const locale = "ar-EG";
    const base = { calendar: "gregory", numberingSystem: "latn" };

    // سنة فقط
    if (/^\d{4}$/.test(v)) {
      const y = Number(v);
      const d = new Date(Date.UTC(y, 0, 1));
      return new Intl.DateTimeFormat(locale, { ...base, year: "numeric" }).format(d);
    }

    // سنة-شهر
    if (/^\d{4}-\d{2}$/.test(v)) {
      const [y, m] = v.split("-").map(Number);
      const d = new Date(Date.UTC(y, m - 1, 1));
      return new Intl.DateTimeFormat(locale, { ...base, month: "long", year: "numeric" }).format(d);
    }

    // تاريخ كامل
    const d = new Date(v);
    if (!isNaN(d)) {
      return new Intl.DateTimeFormat(locale, { ...base, day: "numeric", month: "long", year: "numeric" }).format(d);
    }

    return String(v);
  };

  useEffect(() => {
    let mounted = true;
    fetchProjects()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter(
          (x) => x?.category?.key === category && x?.status === status
        );
        setProjects(filtered);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setProjects([]);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [category, status]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-24">
        <div className="p-6 bg-gray-50 rounded-xl text-gray-500 text-right">
          جارِ التحميل…
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24">
      <h1 className="text-2xl font-bold mb-6 text-right">المشاريع</h1>

      {projects.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-xl text-gray-500 text-right">
          لا توجد مشاريع مطابقة
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow p-4">
              {project.cover && (
                <img
                  src={project.cover}
                  alt={project.name || project.id}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                  loading="lazy"
                />
              )}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{project.name}</h2>

                {/* نفس اللون الأخضر */}
                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 whitespace-nowrap">
                  {project.status === "under-construction"
                    ? `موعد التسليم: ${fmtHandover(project.handoverDate)}`
                    : project.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/projects/${category}/${project.id}/videos`}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 rounded-lg text-blue-700 text-sm hover:bg-blue-100"
                  title="الفيديوهات"
                >
                  <span role="img" aria-label="video">🎬</span> الفيديوهات
                </Link>
                <Link
                  to={`/projects/${category}/${project.id}/pdfs`}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 rounded-lg text-blue-700 text-sm hover:bg-blue-100"
                  title="ملفات PDF"
                >
                  <span role="img" aria-label="pdf">📄</span> ملفات PDF
                </Link>
                <Link
                  to={`/projects/${category}/${project.id}/info`}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 rounded-lg text-blue-700 text-sm hover:bg-blue-100"
                  title="معلومات إضافية"
                >
                  <span role="img" aria-label="info">ℹ️</span> معلومات إضافية
                </Link>
                <Link
                  to={`/projects/${category}/${project.id}/location`}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 rounded-lg text-blue-700 text-sm hover:bg-blue-100"
                  title="الموقع"
                >
                  <span role="img" aria-label="location">📍</span> الموقع
                </Link>
                <Link
                  to={`/projects/${category}/${project.id}/prices`}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 rounded-lg text-blue-700 text-sm hover:bg-blue-100"
                  title="قائمة الأسعار"
                >
                  <span role="img" aria-label="prices">💰</span> قائمة الأسعار
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
