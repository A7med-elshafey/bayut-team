import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProjects } from "../services/api";

export default function ProjectList() {
  const { category, status } = useParams();
  const [items, setItems] = useState(null);

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        const filtered = data.filter(
          (p) => p.category?.key === category && p.status === status
        );
        setItems(filtered);
      })
      .catch((e) => {
        console.error(e);
        setItems([]);
      });
  }, [category, status]);

  if (!items) return <p className="p-8">جار التحميل...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 pt-24 p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-green-800 mb-6 text-right">
        {status === "ready" ? "المشاريع الجاهزة" : "المشاريع تحت الإنشاء"}
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-600 text-right">لا توجد مشاريع مطابقة.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((p) => (
            <Link
              to={`/projects/${p.id}`}
              key={p.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={p.cover}
                alt={p.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4 text-right">
                <div className="text-sm text-green-700">{p.category?.label}</div>
                <div className="font-bold text-lg text-gray-900">{p.name}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

