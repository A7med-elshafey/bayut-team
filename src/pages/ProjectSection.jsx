import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getProject } from "../services/api";

// نفس الـ worker اللي عندك في public/pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

export default function ProjectSection() {
  const { id, section } = useParams();
  const [project, setProject] = useState(null);

  // -------- PDF state --------
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [fitToWidth, setFitToWidth] = useState(true);

  const pdfContainerRef = useRef(null);
  const widthRef = useRef(800);
  const [containerWidth, setContainerWidth] = useState(800);

  // -------- Video state --------
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoFrameRef = useRef(null);

  useEffect(() => {
    (async () => {
      const proj = await getProject(id);
      setProject(proj);
    })();
  }, [id]);

  // منع سكرول الصفحة أثناء فتح اللايت بوكس
  useEffect(() => {
    if (selectedPdf) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [selectedPdf]);

  // إغلاق بـ ESC
  const onKey = useCallback((e) => {
    if (e.key === "Escape") {
      setSelectedPdf(null);
      setSelectedVideo(null);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  // قياس عرض الكونتينر عشان "fit to width"
  useEffect(() => {
    if (!pdfContainerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.min(entries[0].contentRect.width, 1200); // سقف عرض
      widthRef.current = w;
      setContainerWidth(w);
    });
    ro.observe(pdfContainerRef.current);
    return () => ro.disconnect();
  }, [selectedPdf]);

  // تتبّع الصفحة الحالية أثناء السكروول
  useEffect(() => {
    if (!selectedPdf) return;
    const nodes = document.querySelectorAll("[data-pdf-page]");
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const p = Number(visible.target.getAttribute("data-pdf-page"));
          setCurrentPage(p);
        }
      },
      { root: pdfContainerRef.current, threshold: [0.25, 0.5, 0.75] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [selectedPdf, numPages]);

  if (!project) return <p className="p-8">جار التحميل...</p>;
  const sec = project.sections?.[section];
  if (!sec) return <p className="p-8">لا يوجد بيانات</p>;

  // أدوات الفيديو
  const openVideoFullScreen = () => {
    const el = videoFrameRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  return (
    <div className="p-6 md:p-8 mt-24">
      <h1 className="text-2xl font-bold text-green-700 mb-6 text-right">
        {project.name} — {sec.title}
      </h1>

      {/* -------------------- Videos -------------------- */}
      {section === "videos" && (
        <>
          {/* مشغل علوي يظهر عند اختيار فيديو */}
          {selectedVideo && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow bg-white border">
              <div className="p-3 flex items-center justify-between">
                <div className="text-green-700 font-bold truncate text-right">
                  {selectedVideo.label ||
                    selectedVideo.split?.("/").pop() ||
                    selectedVideo}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={openVideoFullScreen}
                    className="px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200"
                    title="ملء الشاشة"
                  >
                    ⛶
                  </button>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="px-3 py-1 rounded-xl bg-red-100 hover:bg-red-200"
                    title="إغلاق"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div ref={videoFrameRef} className="relative bg-black">
                <video
                  controls
                  className="w-full h-[56vh] object-contain bg-black"
                  src={selectedVideo.url || selectedVideo}
                  autoPlay
                />
              </div>
            </div>
          )}

          {/* شبكة كروت صغيرة */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sec.items.map((item, idx) => {
              const src = item.url || item;
              const label = item.label || src.split("/").pop();
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedVideo(item);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group text-left bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
                  title={label}
                >
                  <div className="relative h-36 bg-black">
                    <video
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                      src={src}
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 right-2 text-xs text-white font-semibold line-clamp-1">
                      {label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* -------------------- PDFs + Info -------------------- */}
      {(section === "pdfs" || section === "info") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar ثابتة */}
          <div className="space-y-3 md:sticky md:top-28 h-fit self-start">
            {sec.items.map((item, idx) => {
              const href = item.url || item;
              const label = item.label || href.split("/").pop();
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPdf(href);
                    setScale(1);
                    setFitToWidth(true);
                  }}
                  className={`block w-full text-right px-4 py-2 rounded-lg border transition ${
                    selectedPdf === href
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-700 hover:bg-green-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* مساحة خالية */}
          <div className="md:col-span-2" />
        </div>
      )}

      {/* ------------- PDF Lightbox (Full Screen) ------------- */}
      {selectedPdf && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm animate-[fadeIn_.2s_ease]"
          role="dialog"
          aria-modal="true"
        >
          {/* شريط أدوات */}
          <div className="m-4 rounded-2xl bg-white/10 border border-white/20 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFitToWidth(true)}
                className={`px-3 py-1 rounded-xl ${
                  fitToWidth ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
                }`}
                title="ملاءمة العرض"
              >
                ⇱ Fit
              </button>
              <button
                onClick={() => {
                  setFitToWidth(false);
                  setScale((s) => Math.min(s + 0.15, 3));
                }}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20"
                title="تكبير"
              >
                ＋
              </button>
              <button
                onClick={() => {
                  setFitToWidth(false);
                  setScale((s) => Math.max(s - 0.15, 0.5));
                }}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20"
                title="تصغير"
              >
                －
              </button>
            </div>

            <div className="text-sm opacity-90">
              صفحة <b>{currentPage}</b> من <b>{numPages || "?"}</b>
            </div>

            <button
              onClick={() => setSelectedPdf(null)}
              className="px-3 py-1 rounded-xl bg-red-500/80 hover:bg-red-500 text-white"
              title="إغلاق (Esc)"
            >
              ✕
            </button>
          </div>

          {/* مساحة العرض */}
          <div ref={pdfContainerRef} className="flex-1 overflow-auto px-4 pb-6">
            <div
              className="mx-auto transition-all duration-200"
              style={{
                width: fitToWidth
                  ? Math.round(containerWidth)
                  : Math.round(containerWidth * scale),
              }}
            >
              <Document
                file={selectedPdf}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={
                  <p className="text-white text-center mt-10">
                    جار تحميل الملف…
                  </p>
                }
                error={
                  <p className="text-red-300 text-center mt-10">
                    تعذر تحميل الملف
                  </p>
                }
              >
                {Array.from({ length: numPages || 0 }, (_, i) => (
                  <div
                    key={i}
                    data-pdf-page={i + 1}
                    className="mb-4 rounded-xl overflow-hidden shadow-lg bg-white"
                  >
                    <Page
                      pageNumber={i + 1}
                      width={
                        fitToWidth
                          ? Math.round(containerWidth)
                          : Math.round(containerWidth * scale)
                      }
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
