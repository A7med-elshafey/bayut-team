export const API_BASE = "https://bayut-projects.s3.eu-north-1.amazonaws.com";

// يجلب قائمة المشاريع من الجذر /index.json
export async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/index.json?ts=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("فشل تحميل المشاريع");
    return res.json();
  } catch (err) {
    console.error("خطأ أثناء تحميل المشاريع:", err);
    return [];
  }
}

// محاولة جلب مع إرجاع null بدل رمي خطأ
async function tryFetchJson(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// يجلب بيانات مشروع مفرد من /projects-data/<id>.json (كما في هيكلة ملفاتك)
export async function getProject(id) {
  try {
    const raw = String(id ?? "").trim();
    const slug = encodeURIComponent(raw.toLowerCase());

    const urls = [
      `${API_BASE}/projects-data/${slug}.json?ts=${Date.now()}`,
      `${API_BASE}/projects-data/${encodeURIComponent(
        raw
      )}.json?ts=${Date.now()}`,
    ];

    for (const url of urls) {
      const data = await tryFetchJson(url);
      if (data) return data;
    }

    throw new Error("فشل تحميل المشروع");
  } catch (err) {
    console.error("خطأ أثناء تحميل المشروع:", err);
    return null;
  }
}

// توحيد عناوين الملفات إن احتجت
export function resolveUrl(url) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url}`;
}
