import { useEffect, useRef } from 'react';

const HOVER_SELECTOR = [
  'a', 'button',
  '.skill-card', '.project-card', '.contact-link',
  '.btn-primary', '.btn-ghost',
  '.nav-logo-img', '.nav-btn',
  '.about-avatar-wrap', '.exp-item',
  '.contact-title',
].join(', ');

export default function Cursor() {
  const dotRef = useRef(null);
  const auraRef = useRef(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let auraX = 0;
    let auraY = 0;
    let frameId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      const dot = dotRef.current;
      const aura = auraRef.current;
      if (dot && aura) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;

        auraX += (mouseX - auraX) * 0.14;
        auraY += (mouseY - auraY) * 0.14;

        aura.style.left = `${auraX}px`;
        aura.style.top = `${auraY}px`;
      }
      frameId = requestAnimationFrame(animate);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest(HOVER_SELECTOR)) {
        document.body.classList.add('cursor-hover');
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest(HOVER_SELECTOR)) {
        document.body.classList.remove('cursor-hover');
      }
    };

    const handleMouseDown = () => document.body.classList.add('cursor-click');
    const handleMouseUp = () => document.body.classList.remove('cursor-click');

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    frameId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-aura" ref={auraRef} />
    </>
  );
}
