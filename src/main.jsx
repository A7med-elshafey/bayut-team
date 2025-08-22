import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n.js' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


// # تهيئة المشروع كـ git repo
// git init

// # ربط المشروع بالـ repository بتاعك على GitHub
// git remote add origin https://github.com/YOUR_USERNAME/bayut-team.git

// # إضافة كل الملفات
// git add .

// # حفظ نسخة أولى
// git commit -m "Initial commit - Bayut Team project"

// # رفع الملفات على فرع main
// git branch -M main
// git push -u origin main

//  A7med-elshafey/bayut-team