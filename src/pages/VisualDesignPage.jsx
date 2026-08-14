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

  /* One client can fill more than one chapter — the shipped builds
     and the campaign rail are different kinds of work and each
     wants a full ground. The theme index runs across the flattened
     list so the alternation never doubles up. */
  const chapters = [];
  DESIGN_CLIENTS.forEach((client) => {
    if (client.versions?.length) chapters.push({ kind: 'versions', client });
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
              </Reveal>
            )}

            {kind === 'versions' && (
              <div className="design-group">
                <Reveal as="p" className="section-label" delay={0.06}>
                  {client.versions.length > 1 ? 'Shipped builds' : 'Live site'}
                </Reveal>

                <div className="version-grid" data-count={client.versions.length}>
                  {client.versions.map((version, k) => (
                    <Reveal
                      as="a"
                      key={version.id}
                      href={version.website}
                      target="_blank"
                      rel="noreferrer"
                      className="version-card"
                      delay={0.1 + k * 0.06}
                    >
                      <span className="version-frame">
                        {/* The label sits behind the image, so a shot
                            that has not been added yet reads as a
                            titled placeholder rather than a broken
                            image icon. */}
                        <span className="version-fallback">{client.name}</span>
                        <img
                          src={version.image}
                          alt={version.alt}
                          /* See DesignCarousel: native lazy-loading
                             is unreliable inside the sticky chapter
                             stack, which left covers blank while
                             fully on screen. */
                          loading="eager"
                          fetchPriority={i === 0 && k === 0 ? 'high' : 'low'}
                          decoding="async"
                          onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                        />
                      </span>

                      <span className="version-bar">
                        <span className="version-label">{version.label}</span>
                        <span className="version-cta">Visit site ↗</span>
                      </span>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {kind === 'designs' && (
              <div className="design-group">
                <Reveal as="p" className="section-label">Brand &amp; Campaign Designs</Reveal>
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
