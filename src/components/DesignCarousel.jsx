import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, animate } from 'framer-motion';
import { spring, ease, project } from '../motion/springs';

/* The full fluid-gesture stack (DESIGN.md §7):
   - 1:1 tracking with pointer capture while dragging (§2)
   - rubber-band past the first and last slide (§9)
   - on release, momentum is PROJECTED forward and the nearest slide to
     the projected endpoint wins — not the nearest to the release point (§6)
   - release velocity is handed to the settling spring, so there is no
     seam between the drag and the animation (§5)
   - a drag can grab the track mid-settle and redirect it (§3)
   - the arrows are clicks: no momentum, so no bounce (§4) */

export default function DesignCarousel({ items, label = 'Designs' }) {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const reduced = useReducedMotion();
  const count = items.length;

  /* Slide step = slide width + flex gap, measured from the DOM so CSS
     stays the single source of layout truth. */
  useEffect(() => {
    const measure = () => {
      const slides = trackRef.current?.children;
      if (!slides?.length) return;
      setStep(
        slides.length > 1
          ? slides[1].offsetLeft - slides[0].offsetLeft
          : slides[0].offsetWidth
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  // Keep the current slide in place across resizes — no animation, just truth.
  useEffect(() => {
    if (step) x.set(-index * step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const settle = (target, velocity = 0) => {
    const clamped = Math.max(0, Math.min(count - 1, target));
    setIndex(clamped);
    animate(x, -clamped * step, reduced
      ? { duration: 0.2, ease: ease.out }
      : velocity
        ? { ...spring.flick, velocity }   // a throw earned its bounce
        : spring.move);                   // a click did not
  };

  const handleDragEnd = (_event, info) => {
    const projected = x.get() + project(info.velocity.x);
    settle(Math.round(-projected / step), info.velocity.x);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); settle(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); settle(index + 1); }
  };

  return (
    <div
      className="design-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="design-viewport" ref={viewportRef}>
        <motion.div
          className="design-track"
          ref={trackRef}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -(count - 1) * step, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {items.map((item, i) => (
            <div
              className="design-slide"
              key={item.image}
              aria-hidden={i !== index}
            >
              <div className="design-frame">
                <img
                  src={item.image}
                  alt={item.alt}
                  /* NOT loading="lazy". These slides live inside a
                     sticky chapter that pins at a negative offset,
                     and the browser's lazy heuristic measures an
                     image against its LAYOUT position, not the
                     position it is painted at. Inside the stack it
                     decides the image is far off-screen and never
                     requests it — slides 3, 4 and 5 stayed blank
                     even when fully visible. Priority still tells
                     the browser these are not urgent. */
                  loading="eager"
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding="async"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </motion.div>

        <button
          className="design-arrow design-arrow-prev"
          aria-label="Previous design"
          disabled={index === 0}
          onClick={() => settle(index - 1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          className="design-arrow design-arrow-next"
          aria-label="Next design"
          disabled={index === count - 1}
          onClick={() => settle(index + 1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>

      <div className="design-dots" role="tablist" aria-label="Choose design">
        {items.map((item, i) => (
          <button
            key={item.image}
            className={`design-dot${i === index ? ' is-active' : ''}`}
            role="tab"
            aria-selected={i === index}
            aria-label={`Design ${i + 1} of ${count}`}
            onClick={() => settle(i)}
          />
        ))}
      </div>
    </div>
  );
}
