/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#008060", // الأخضر الأساسي (بيوت السعودية)
        secondary: "#00A86B", // أخضر للتيم
        neutralText: "#4B5563", // رمادي للنصوص (Gray-700)
      },
    },
  },
  plugins: [],
};
