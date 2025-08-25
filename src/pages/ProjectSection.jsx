import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProject } from "../services/api";

// label من أي URL
function labelFromUrl(u) {
  try {
    const raw = typeof u === "string" ? u : (u?.url || "");
    const last = raw.split("/").pop().split("?")[0];
    const noExt = last.includes(".")
      ? last.substring(0, last.lastIndexOf("."))
      : last;
    return noExt
      .replace(/[-_]/g, " ")
      .replace(/(\d+)(bed)/i, "$1 Bed")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return String(u);
  }
}

function iconFor(section) {
  switch (section) {
    case "videos":
      return "🎬";
    case "pdfs":
      return "📄";
    case "info":
      return "ℹ️";
    case "location":
      return "📍";
    case "prices":
      return "💰";
    default:
      return "🔗";
  }
}

function toItems(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((x) =>
      typeof x === "string"
        ? { url: x, label: labelFromUrl(x) }
        : { url: x?.url, label: x?.label || labelFromUrl(x?.url || "") }
    )
    .filter((it) => !!it.url);
}

export default function ProjectSection() {
  const { category, id, section } = useParams();
  const activeSection = section || "videos";

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const p = await getProject(id);
        setProject(p || null);
      } catch (e) {
        setProject(undefined);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, id]);

  if (loading)
    return <div className="max-w-6xl mx-auto px-4 pt-24">جارِ التحميل…</div>;
  if (project === undefined)
    return (
      <div className="max-w-6xl mx-auto px-4 pt-24">تعذر تحميل المشروع</div>
    );
  if (!project)
    return <div className="max-w-6xl mx-auto px-4 pt-24">المشروع غير موجود</div>;

  const S = project.sections || {};
  const sectionData = {
    title: S[activeSection]?.title || "",
    items: toItems(S[activeSection]?.items || []),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24">
      {project.cover && (
        <img
          src={project.cover}
          alt={project.name || project.id}
          className="w-full max-h-80 object-cover rounded-2xl mb-4"
        />
      )}

      {/* أزرار التنقل */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["videos", "pdfs", "info", "location", "prices"].map((key) => (
          <Link
            key={key}
            to={`/projects/${category}/${project.id}/${key}`}
            className={`px-3 py-2 rounded-xl border transition text-sm
              ${
                activeSection === key
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-700 border-green-200 hover:bg-green-50"
              }`}
          >
            {iconFor(key)}{" "}
            {key === "videos"
              ? "الفيديوهات"
              : key === "pdfs"
              ? "ملفات PDF"
              : key === "info"
              ? "معلومات إضافية"
              : key === "location"
              ? "الموقع"
              : "قائمة الأسعار"}
          </Link>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>

      {/* VIDEOS */}
      {activeSection === "videos" && (
        <div className="mt-2">
          {isVideoOpen && selectedVideo && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
              onClick={() => {
                setIsVideoOpen(false);
                setSelectedVideo(null);
              }}
            >
              <div
                className="relative w-full h-full md:w-5/6 md:h-[80vh] lg:w-3/4 lg:h-[80vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  src={selectedVideo}
                  className="w-full h-full object-contain bg-black rounded-xl shadow-2xl"
                  controls
                  autoPlay
                  playsInline
                />
                <button
                  onClick={() => {
                    setIsVideoOpen(false);
                    setSelectedVideo(null);
                  }}
                  className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  إغلاق ✖
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sectionData.items.length ? (
              sectionData.items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedVideo(item.url);
                    setIsVideoOpen(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group text-right bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
                  title={item.label}
                >
                  <div className="relative h-36 bg-black">
                    <video
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                      src={item.url}
                      muted
                      preload="metadata"
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 right-2 text-xs text-white font-semibold line-clamp-1">
                      {item.label}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-3 rounded-xl bg-gray-100 text-gray-500 text-center">
                لا يوجد فيديوهات
              </div>
            )}
          </div>
        </div>
      )}

      {/* باقي السيكشنات */}
      {activeSection !== "videos" && (
        <div className="mt-2">
          <div className="grid gap-3 md:grid-cols-2">
            {sectionData.items.length ? (
              sectionData.items.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800"
                >
                  <span className="text-base">
                    {activeSection === "location"
                      ? "موقع المشروع"
                      : activeSection === "prices"
                      ? "عرض الأسعار"
                      : item.label}
                  </span>
                  <span className="text-xl" aria-hidden>
                    {iconFor(activeSection)}
                  </span>
                </a>
              ))
            ) : (
              <div className="py-3 rounded-xl bg-gray-100 text-gray-500 text-center">
                {activeSection === "pdfs"
                  ? "لا توجد ملفات"
                  : activeSection === "info"
                  ? "لا يوجد محتوى"
                  : activeSection === "location"
                  ? "لا يوجد روابط موقع"
                  : activeSection === "prices"
                  ? "لا توجد أسعار"
                  : "لا يوجد محتوى"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
