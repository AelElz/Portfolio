import Reveal from './Reveal';

export default function VideoCard({ title, description, youtubeId, delay = 0 }) {
  return (
    <Reveal as="div" className="video-card" delay={delay}>
      <div className="video-embed">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <h3 className="video-title">{title}</h3>
      {description && <p className="video-desc">{description}</p>}
    </Reveal>
  );
}
