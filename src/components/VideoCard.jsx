import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';

/* ============================================================
   VideoCard — a YouTube embed that mounts when it comes near.

   Deliberately NOT loading="lazy" on the iframe. The browser's
   native lazy heuristic measures an element against its LAYOUT
   position, and every chapter here is a sticky panel pinned at a
   negative offset — inside that stack it concludes the embed is
   far off-screen and never fetches it. The same bug left four
   images blank on the Visual Design page while they were fully
   visible.

   An IntersectionObserver uses the real intersection rectangle,
   so it is correct wherever the element is painted. The 400px
   margin means the player is already loading by the time the
   card is actually reached.
   ============================================================ */

export default function VideoCard({ title, description, youtubeId, delay = 0 }) {
  const wellRef = useRef(null);
  const [inRange, setInRange] = useState(false);

  useEffect(() => {
    if (inRange) return;
    const el = wellRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInRange(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInRange(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [inRange]);

  return (
    <Reveal as="div" className="video-card" delay={delay}>
      <div className="video-embed" ref={wellRef}>
        {inRange ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <span className="video-placeholder" aria-hidden="true" />
        )}
      </div>
      <h3 className="video-title">{title}</h3>
      {description && <p className="video-desc">{description}</p>}
    </Reveal>
  );
}
