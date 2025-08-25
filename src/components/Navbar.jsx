import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { logout, session } = useAuth(); // 👈 ناخد session والـ logout من الكونتكست
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout(); // 👈 هيعمل clear للـ session
    navigate("/login", { replace: true });
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition 
      ${scrolled ? "bg-white/90 backdrop-blur shadow" : "bg-white/70 backdrop-blur"}`}
    >
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/assets/logo/logo.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-extrabold text-lg text-green-700">
            بيوت السعودية
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname === "/"
                ? "bg-green-600 text-white"
                : "text-green-700 hover:bg-green-100"
            }`}
          >
            الرئيسية
          </Link>
          <Link
            to="/projects"
            className={`px-3 py-1.5 rounded-xl transition ${
              pathname.startsWith("/projects")
                ? "bg-green-600 text-white"
                : "text-green-700 hover:bg-green-100"
            }`}
          >
            المشاريع
          </Link>

          {/* ✅ الزرار يظهر لو فيه session */}
          {session && (
            <button
              onClick={handleLogout}
              className="ml-3 px-3 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600"
            >
              تسجيل خروج
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
