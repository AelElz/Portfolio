import { useEffect } from 'react';
import { Panel, PanelStack } from '../components/Panel';
import { DeepDiveHero, DeepDiveClosing, itemTheme, closingTheme } from '../components/DeepDivePage';
import Reveal from '../components/Reveal';
import DesignCarousel from '../components/DesignCarousel';
import { scrollToTarget } from '../motion/smooth-scroll';
import { DESIGN_CLIENTS } from '../data/visual-design';

export default function VisualDesignPage() {
  useEffect(() => {
    scrollToTarget(0, { immediate: true });
  }, []);

  /* One client can fill more than one chapter — the landing page and
     the campaign rail are different kinds of work and each wants a
     full ground. The theme index runs across the flattened list so
     the alternation never doubles. */
  const chapters = [];
  DESIGN_CLIENTS.forEach((client) => {
    if (client.uiux) chapters.push({ kind: 'uiux', client });
    if (client.designs?.length) chapters.push({ kind: 'designs', client });
  });

  return (
    <PanelStack>
      <DeepDiveHero
        eyebrow="Visual Design"
        title={<>Design that ships,<br />brands that stick.</>}
        intro="Brand systems, campaign visuals, and full UI/UX, designed end to end and shipped for real clients. Here's the client work, straight from production."
      />

      {chapters.map((chapter, i) => {
        const { client, kind } = chapter;
        const isFirstForClient = chapters.findIndex((c) => c.client === client) === i;

        return (
          <Panel theme={itemTheme(i)} key={`${client.name}-${kind}`} wide className="design-client">
            {isFirstForClient && (
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
            )}

            {kind === 'uiux' && (
              <div className="design-group">
                <Reveal as="p" className="section-label" delay={0.06}>{client.uiux.label}</Reveal>
                <Reveal as="div" className="design-frame design-frame-featured" delay={0.1}>
                  <img
                    src={client.uiux.image}
                    alt={client.uiux.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </Reveal>
              </div>
            )}

            {kind === 'designs' && (
              <div className="design-group">
                <Reveal as="p" className="section-label">Brand & Campaign Designs</Reveal>
                <Reveal as="div" delay={0.06}>
                  <DesignCarousel items={client.designs} label={`${client.name} designs`} />
                </Reveal>
              </div>
            )}
          </Panel>
        );
      })}

      <DeepDiveClosing theme={closingTheme(chapters.length)} />
    </PanelStack>
  );
}
