/* ============================================================
   ProjectDiagrams.jsx — Small CSS/SVG visual explainers used on
   the C/C++ project deep-dive page. Pure presentation, no logic.
   ============================================================ */

const PHILOSOPHERS = 5;

export function ConcurrencyDiagram() {
  const radius = 92;
  const center = 120;

  return (
    <div className="diagram concurrency-diagram">
      <svg viewBox="0 0 240 240" className="diagram-svg">
        {Array.from({ length: PHILOSOPHERS }).map((_, i) => {
          const angle = (i / PHILOSOPHERS) * Math.PI * 2 - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const forkAngle = angle + Math.PI / PHILOSOPHERS;
          const fx = center + radius * 0.72 * Math.cos(forkAngle);
          const fy = center + radius * 0.72 * Math.sin(forkAngle);

          return (
            <g key={i}>
              <line x1={center} y1={center} x2={x} y2={y} className="diagram-spoke" />
              <circle cx={fx} cy={fy} r="4" className="diagram-fork" />
              <circle cx={x} cy={y} r="18" className="diagram-node" />
              <text x={x} y={y + 5} textAnchor="middle" className="diagram-node-label">
                P{i + 1}
              </text>
            </g>
          );
        })}
        <circle cx={center} cy={center} r="26" className="diagram-hub" />
        <text x={center} y={center + 5} textAnchor="middle" className="diagram-hub-label">
          MUTEX
        </text>
      </svg>
      <div className="diagram-legend">
        <span className="diagram-legend-item">Thinking</span>
        <span className="diagram-legend-arrow">→</span>
        <span className="diagram-legend-item">Hungry</span>
        <span className="diagram-legend-arrow">→</span>
        <span className="diagram-legend-item">Eating</span>
      </div>
    </div>
  );
}

export function RaycastDiagram() {
  const rays = [-32, -18, -6, 6, 18, 32];
  const heights = [46, 68, 92, 88, 60, 40];

  return (
    <div className="diagram raycast-diagram">
      <svg viewBox="0 0 160 140" className="diagram-svg raycast-map">
        <rect x="4" y="4" width="152" height="132" className="diagram-frame" />
        <line x1="10" y1="10" x2="150" y2="10" className="diagram-wall" />
        {rays.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const originX = 80;
          const originY = 128;
          const length = 118;
          const x2 = originX + length * Math.sin(rad);
          const y2 = originY - length * Math.cos(rad);
          return <line key={i} x1={originX} y1={originY} x2={x2} y2={y2} className="diagram-ray" />;
        })}
        <circle cx="80" cy="128" r="5" className="diagram-player" />
      </svg>
      <div className="raycast-columns">
        {heights.map((h, i) => (
          <div key={i} className="raycast-column" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function ShellPipelineDiagram() {
  const stages = ['cmd1', 'cmd2', 'cmd3'];

  return (
    <div className="diagram shell-diagram">
      {stages.map((stage, i) => (
        <div className="shell-stage" key={stage}>
          <div className="shell-box">
            <div className="shell-box-title">{stage}</div>
            <div className="shell-box-sub">fork() + execve()</div>
          </div>
          {i < stages.length - 1 && (
            <div className="shell-pipe">
              <span>dup2</span>
              <div className="shell-pipe-arrow">→</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
