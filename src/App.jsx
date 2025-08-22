import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import CategoryProjects from "./pages/CategoryProjects";
import ProjectSection from "./pages/ProjectSection";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:category/:status" element={<CategoryProjects />} />
        <Route path="/projects/:category/:id/:section" element={<ProjectSection />} />
      </Routes>
    </Router>
  );
}

export default App;
