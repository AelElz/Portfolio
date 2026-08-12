import { useRef } from 'react';

/* ============================================================
   RevealRow — a list row that fills from wherever
   the cursor entered.

   The circle has to reach the farthest corner of the surface
   from the entry point, or the fill lands as a visible disc
   instead of a wipe. That diameter is measured per enter, not
   assumed, because entry position changes it.
   ============================================================ */

export default function RevealRow({
  href,
  external = false,
  label,
  children,
  className = '',
}) {
  const surfaceRef = useRef(null);

  const place = (e) => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const rect = surface.getBoundingClientRect();
    /* The pointer can enter the row well outside the surface — the
       surface only hugs the label — so the origin is clamped onto
       it. Unclamped, the bloom starts off-element and the first
       frames of the fill are invisible. */
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);

    const far = Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y)
    );

    surface.style.setProperty('--mx', `${x}px`);
    surface.style.setProperty('--my', `${y}px`);
    surface.style.setProperty('--d', `${far * 2}px`);
  };

  const linkProps = external
    ? { target: '_blank', rel: 'noreferrer' }
    : {};

  return (
    <a
      href={href}
      className={`reveal-row ${className}`.trim()}
      onPointerEnter={place}
      onPointerLeave={place}
      {...linkProps}
    >
      <span className="reveal-row__surface" ref={surfaceRef}>
        <span className="reveal-row__fill" aria-hidden="true" />
        <span className="reveal-row__label">{label}</span>
      </span>
      {children}
    </a>
  );
}
