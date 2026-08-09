import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import VideoCard from '../components/VideoCard';
import { MOTION_GRAPHICS_VIDEOS, CINEMATIC_VIDEOS } from '../data/motion-design-videos';

export default function MotionDesignPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="deepdive-page">
      <section className="deepdive-hero">
        <div className="container">
          <Link to="/#skills" className="back-link">← Back to Portfolio</Link>
          <Reveal as="p" className="section-label">Motion Design</Reveal>
          <Reveal as="h1" className="section-title" delay={0.06}>
            Motion graphics & cinematic work
          </Reveal>
          <Reveal as="p" className="section-body" delay={0.12}>
            The other track — 4+ years of video editing, motion graphics, and creative direction
            for institutional and enterprise clients. Same craft mindset as the code, different medium.
          </Reveal>
        </div>
      </section>

      <section className="video-section">
        <div className="container">
          <Reveal as="p" className="section-label">Motion Graphics & Video Editing</Reveal>
          <Reveal as="h2" className="section-title video-section-title" delay={0.06}>
            Motion & Editing
          </Reveal>
          <div className="video-grid">
            {MOTION_GRAPHICS_VIDEOS.map((video, i) => (
              <VideoCard key={video.title} {...video} delay={Math.min(0.06 * i, 0.18)} />
            ))}
          </div>
        </div>
      </section>

      <section className="video-section">
        <div className="container">
          <Reveal as="p" className="section-label">Cinematic Direction</Reveal>
          <Reveal as="h2" className="section-title video-section-title" delay={0.06}>
            Cinematic & Video Editing
          </Reveal>
          <div className="video-grid">
            {CINEMATIC_VIDEOS.map((video, i) => (
              <VideoCard key={video.title} {...video} delay={Math.min(0.06 * i, 0.18)} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
