import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Home as HomeIcon, FolderKanban } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// 10 صور من الملف التعريفي
// const images = Array.from({ length: 10 }, (_, i) => `/assets/company/profile${i + 1}.jpg`);
const images = Array.from({ length: 10 }, (_, i) => `${import.meta.env.BASE_URL}assets/company/profile${i + 1}.jpg`);


function ProfileCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-3xl shadow-2xl">
      <AnimatePresence>
        <motion.img
          key={index}
          src={images[index]}
          alt="Company Profile"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    <Footer />
</div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-8 text-center pt-24">
      {/* الخلفية */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/office-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md"></div>
      </div>

      {/* Sidebar أيقونات النافيجيشن */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-8 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl z-50">
        <Link
          to="/"
          className="p-4 rounded-full bg-green-100 hover:bg-green-200 transition flex items-center justify-center"
        >
          <HomeIcon className="w-7 h-7 text-green-700" />
        </Link>
        <Link
          to="/projects"
          className="p-4 rounded-full bg-green-100 hover:bg-green-200 transition flex items-center justify-center"
        >
          <FolderKanban className="w-7 h-7 text-green-700" />
        </Link>
      </div>

      {/* المحتوى */}
      <div className="relative z-10 max-w-5xl w-full">
        {/* اسم الفريق */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-extrabold text-green-700 drop-shadow-lg mb-6"
        >
          <Typewriter
            words={["Nasef Monester's Team "]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </motion.h1>

        {/* خط ديكوري تحت العنوان */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mx-auto w-64 border-b-4 border-green-600 mb-12"
        />

        {/* Carousel للصور */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <ProfileCarousel />
        </motion.div>
      </div>
    </div>
  );
}

// git add .
// git commit -m "Add 2 new users to users.json"

// git commit -m "Update authentication system and welcome overlay"
// git push origin main
