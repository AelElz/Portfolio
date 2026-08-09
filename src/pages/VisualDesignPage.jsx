import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import DesignCarousel from '../components/DesignCarousel';
import { DESIGN_CLIENTS } from '../data/visual-design';

export default function VisualDesignPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="deepdive-page">
      {/* Bold, centered hero — the work is the pitch, so the headline
          states the claim and the sections below prove it. */}
      <section className="deepdive-hero">
        <div className="container">
          <Link to="/#skills" className="back-link">← Back to Portfolio</Link>
          <Reveal as="p" className="section-label">Visual Design</Reveal>
          <Reveal as="h1" className="section-title" delay={0.06}>
            Design that ships,<br />brands that stick.
          </Reveal>
          <Reveal as="p" className="section-body" delay={0.12}>
            Brand systems, campaign visuals, and full UI/UX — designed end to end and
            shipped for real clients. Here's the client work, straight from production.
          </Reveal>
        </div>
      </section>

      {DESIGN_CLIENTS.map((client, ci) => (
        <section className="deepdive-section design-client" key={client.name}>
          <div className="container">
            {/* Client header — name is the social proof, the live site is the CTA */}
            <Reveal as="div" className="deepdive-header design-client-header">
              <span className="deepdive-index">{client.index}</span>
              <div className="design-client-info">
                <h2 className="deepdive-name">{client.name}</h2>
                <p className="deepdive-tagline">{client.tagline}</p>
              </div>
              <a
                href={client.website}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost design-site-btn"
              >
                Visit website ↗
              </a>
            </Reveal>

            {/* UI/UX — the live product's landing page, full bleed */}
            {client.uiux && (
              <div className="design-group">
                <Reveal as="p" className="section-label" delay={0.06}>{client.uiux.label}</Reveal>
                <Reveal as="div" className="design-frame design-frame-featured" delay={0.1}>
                  <img
                    src={client.uiux.image}
                    alt={client.uiux.alt}
                    loading={ci === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </Reveal>
              </div>
            )}

            {/* Designs — a drag-to-swipe rail: grab a slide with the cursor
                and throw it left or right; arrows and dots step it too */}
            <div className="design-group">
              <Reveal as="p" className="section-label">Brand & Campaign Designs</Reveal>
              <Reveal as="div" delay={0.06}>
                <DesignCarousel
                  items={client.designs}
                  label={`${client.name} designs`}
                />
              </Reveal>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
