import { Routes, Route } from 'react-router-dom';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import CProjectsPage from './pages/CProjectsPage';
import DockerDevOpsPage from './pages/DockerDevOpsPage';
import MotionDesignPage from './pages/MotionDesignPage';

export default function App() {
  return (
    <>
      <Cursor />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/c-cpp" element={<CProjectsPage />} />
        <Route path="/projects/docker-devops" element={<DockerDevOpsPage />} />
        <Route path="/projects/motion-design" element={<MotionDesignPage />} />
      </Routes>
      <Footer />
      <Chatbot />
    </>
  );
}
