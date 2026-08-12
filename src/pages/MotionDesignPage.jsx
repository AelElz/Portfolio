import { useEffect } from 'react';
import { Panel, PanelStack } from '../components/Panel';
import { DeepDiveHero, DeepDiveClosing } from '../components/DeepDivePage';
import Reveal from '../components/Reveal';
import VideoCard from '../components/VideoCard';
import { scrollToTarget } from '../motion/smooth-scroll';
import { MOTION_GRAPHICS_VIDEOS, CINEMATIC_VIDEOS } from '../data/motion-design-videos';

const SECTIONS = [
  {
    id: 'motion-graphics',
    theme: 'light',
    label: 'Motion Graphics & Video Editing',
    title: 'Motion & Editing',
    videos: MOTION_GRAPHICS_VIDEOS,
  },
  {
    id: 'cinematic',
    theme: 'dark',
    label: 'Cinematic Direction',
    title: 'Cinematic & Video Editing',
    videos: CINEMATIC_VIDEOS,
  },
];

export default function MotionDesignPage() {
  useEffect(() => {
    scrollToTarget(0, { immediate: true });
  }, []);

  return (
    <PanelStack>
      <DeepDiveHero
        eyebrow="Motion Design"
        title="Motion graphics & cinematic work"
        intro="The other track: 4+ years of video editing, motion graphics, and creative direction for institutional and enterprise clients. Same craft mindset as the code, different medium."
      />

      {SECTIONS.map((section) => (
        <Panel theme={section.theme} id={section.id} key={section.id} wide>
          <Reveal as="p" className="section-label">{section.label}</Reveal>
          <Reveal as="h2" className="section-title video-section-title" delay={0.06}>
            {section.title}
          </Reveal>
          <div className="video-grid">
            {section.videos.map((video, i) => (
              <VideoCard key={video.title} {...video} delay={Math.min(0.06 * i, 0.18)} />
            ))}
          </div>
        </Panel>
      ))}

      <DeepDiveClosing theme="light" />
    </PanelStack>
  );
}
