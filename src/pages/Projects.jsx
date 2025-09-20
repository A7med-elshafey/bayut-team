import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Home, Building, Layers } from "lucide-react";
import { fetchProjects } from "../services/api";

function ProjectCategory({ icon: Icon, title, path }) {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition w-full sm:w-[45%] lg:w-[22%]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-7 h-7 text-green-700" />
        <h2 className="text-xl font-bold text-green-800">{title}</h2>
      </div>

      <div className="space-y-3">
        <Link
          to={`/projects/${path}/ready`}
          className="block bg-green-100 rounded-xl p-3 shadow-sm hover:bg-green-300 transition text-center font-medium text-green-700"
        >
          جاهز
        </Link>
        <Link
          to={`/projects/${path}/under-construction`}
          className="block bg-green-100 rounded-xl p-3 shadow-sm hover:bg-green-400 transition text-center font-medium text-green-700"
        >
          تحت الإنشاء
        </Link>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  // ↓↓↓ البحث العام عبر كل المشاريع
  const [allProjects, setAllProjects] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(true);
  const [q, setQ] = useState("");

  // إزالة التشكيل/المدّ والمسافات الزايدة عشان يدعم عربي/English
  const normalize = (s) =>
    (s ?? "")
      .toString()
      .toLowerCase()
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "") // تشكيل
      .replace(/\u0640/g, "") // ـ
      .replace(/\s+/g, " ")
      .trim();

  useEffect(() => {
    let mounted = true;
    fetchProjects()
      .then((data) => mounted && setAllProjects(Array.isArray(data) ? data : []))
      .finally(() => mounted && setLoadingSearch(false));
    return () => {
      mounted = false;
    };
  }, []);

  const searchTerm = normalize(q);
  const results = useMemo(() => {
    if (!searchTerm) return [];
    return allProjects.filter((p) => {
      const name = normalize(p?.name);
      const id = normalize(p?.id);
      return name.includes(searchTerm) || id.includes(searchTerm);
    });
  }, [allProjects, searchTerm]);

  const isSearching = q.trim().length > 0;

  return (
    <div className="relative min-h-screen px-8 py-20 bg-gradient-to-b from-green-50 to-green-100">
      <motion.h1
        initial={{ opacity: 0, scale: 0.8, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl font-extrabold text-center text-green-800 mb-8 tracking-wide"
      >
        مشاريعنا
      </motion.h1>

      {/* 🔎 خانة البحث العامة */}
      <div className="mb-6 flex items-center justify-center gap-3">
        {q && (
          <button
            onClick={() => setQ("")}
            className="text-sm text-emerald-700 hover:underline"
          >
            مسح
          </button>
        )}
        <input
          type="search"
          placeholder="بحث"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full sm:w-96 rounded-xl border border-gray-200 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right bg-white"
          aria-label="بحث باسم المشروع"
        />
      </div>

      {/* نتائج البحث السريعة */}
      {isSearching ? (
        loadingSearch ? (
          <div className="mx-auto max-w-3xl p-4 bg-white/70 rounded-xl text-gray-600 text-center shadow">
            جارِ التحميل…
          </div>
        ) : results.length === 0 ? (
          <div className="mx-auto max-w-3xl p-4 bg-white/70 rounded-xl text-gray-600 text-center shadow">
            لا توجد نتائج مطابقة لبحث “{q}”
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3 mb-10">
            {results.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Link
                  to={`/projects/${p?.category?.key}/${p.id}/pdfs`}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white hover:shadow-md transition p-3"
                  title={p.name}
                >
                  {p.cover && (
                    <img
                      src={p.cover}
                      alt={p.name || p.id}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 text-right flex-1">
                    <div className="font-semibold text-gray-900 truncate">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p?.category?.label} • {p?.status}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )
      ) : null}

      {/* تقسيمة الأقسام (كما كانت) */}
      <div className="flex flex-wrap justify-center gap-6">
        <ProjectCategory icon={Home}     title="الشقق"   path="apartments" />
        <ProjectCategory icon={Building} title="الفلل"   path="villas" />
        <ProjectCategory icon={Layers}   title="الأدوار" path="floors" />
        <ProjectCategory icon={Building2} title="الأبراج" path="towers" />
      </div>
    </div>
  );
}
