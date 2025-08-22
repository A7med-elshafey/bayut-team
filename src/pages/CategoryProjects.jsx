// src/pages/CategoryProjects.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProjects } from "../services/api";

export default function CategoryProjects() {
  const { category, status } = useParams();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects().then((data) => {
      const filtered = data.filter(
        (p) => p.category?.key === category && p.status === status
      );
      setProjects(filtered);
    });
  }, [category, status]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-right">
        {status === "ready" ? "مشاريع جاهزة" : "مشاريع تحت الإنشاء"}
      </h1>

      {projects.length === 0 ? (
        <p className="text-gray-600">لا يوجد مشاريع</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={project.cover} // اللينك كامل من index.json
                alt={project.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4 text-right">
                <h2 className="font-bold text-lg text-green-700">{project.name}</h2>
                <div className="mt-3 flex gap-2 flex-wrap justify-end">
                  <Link
                    to={`/projects/${project.category.key}/${project.id}/pdfs`}
                    className="px-3 py-1 bg-green-100 rounded-lg text-green-700 text-sm hover:bg-green-200"
                  >
                    ملفات PDF
                  </Link>
                  <Link
                    to={`/projects/${project.category.key}/${project.id}/videos`}
                    className="px-3 py-1 bg-green-100 rounded-lg text-green-700 text-sm hover:bg-green-200"
                  >
                    الفيديوهات
                  </Link>
                  <Link
                    to={`/projects/${project.category.key}/${project.id}/info`}
                    className="px-3 py-1 bg-green-100 rounded-lg text-green-700 text-sm hover:bg-green-200"
                  >
                    معلومات إضافية
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

