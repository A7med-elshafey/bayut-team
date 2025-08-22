// src/services/api.js
export const API_BASE = "https://bayut-projects.s3.eu-north-1.amazonaws.com";

// بنجيب قائمة المشاريع المختصرة من index.json
export async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/index.json?ts=${Date.now()}`);
    if (!res.ok) throw new Error("فشل تحميل المشاريع");
    return res.json();
  } catch (err) {
    console.error("خطأ أثناء تحميل المشاريع:", err);
    return [];
  }
}

// بنجيب تفاصيل مشروع محدد من ملف منفصل داخل projects-data
export async function getProject(id) {
  try {
    const res = await fetch(
      `${API_BASE}/projects-data/${id}.json?ts=${Date.now()}`
    );
    if (!res.ok) throw new Error("فشل تحميل المشروع");
    return res.json();
  } catch (err) {
    console.error("خطأ أثناء تحميل المشروع:", err);
    return null;
  }
}

export function resolveUrl(url) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url}`;
}
