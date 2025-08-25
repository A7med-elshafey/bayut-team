import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import CategoryProjects from "./pages/CategoryProjects";
import ProjectSection from "./pages/ProjectSection";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AuthProvider from "./auth/AuthProvider";
import { useAuth } from "./auth/AuthContext";
import LoginModal from "./pages/LoginModal";
import WelcomeOverlay from "./components/WelcomeOverlay";

function Protected({ children }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/" replace />;
  return children;
}

function Layout({ children }) {
  const { session, loginOpen } = useAuth();
  return (
    <>
      <Navbar />
      <div className={(!session && loginOpen) ? "blur-sm" : ""}>
        {children}
      </div>
      <Footer />
      <LoginModal open={!session && loginOpen} />
      <WelcomeOverlay />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/projects"
              element={
                <Protected>
                  <Projects />
                </Protected>
              }
            />
            <Route
              path="/projects/:category/:status"
              element={
                <Protected>
                  <CategoryProjects />
                </Protected>
              }
            />
            <Route
              path="/projects/:category/:id/:section"
              element={
                <Protected>
                  <ProjectSection />
                </Protected>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
