import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import CProjectsPage from './pages/CProjectsPage';
import DockerDevOpsPage from './pages/DockerDevOpsPage';
import MotionDesignPage from './pages/MotionDesignPage';
import VisualDesignPage from './pages/VisualDesignPage';

export default function App() {
  const location = useLocation();

  return (
    <>
      <Cursor />
      <Nav />
      {/* Keyed on pathname (not full location) so hash-only changes don't retrigger */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/projects/c-cpp" element={<PageTransition><CProjectsPage /></PageTransition>} />
          <Route path="/projects/docker-devops" element={<PageTransition><DockerDevOpsPage /></PageTransition>} />
          <Route path="/projects/motion-design" element={<PageTransition><MotionDesignPage /></PageTransition>} />
          <Route path="/projects/visual-design" element={<PageTransition><VisualDesignPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <Chatbot />
    </>
  );
}
