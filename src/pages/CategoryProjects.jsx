
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProjects } from "../services/api";

export default function CategoryProjects() {
  const { category, status } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchProjects().then((data) => {
      if (!mounted) return;
      const filtered = (Array.isArray(data) ? data : []).filter(
        (x) => x?.category?.key === category && x?.status === status
      );
      setProjects(filtered);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [category, status]);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24">
      <h1 className="text-2xl font-bold mb-6">المشاريع</h1>

      {loading ? (
        <div className="p-6 bg-gray-50 rounded-xl text-gray-500">جارِ التحميل…</div>
      ) : projects.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-xl text-gray-500">لا توجد مشاريع مطابقة</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow p-4">
              {project.cover && (
                <img
                  src={project.cover}
                  alt={project.name || project.id}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              )}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{project.name}</h2>
                {project.status && (
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                    {project.status}
                  </span>
                )}
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
