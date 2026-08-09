/* ============================================================
   DevOpsDiagrams.jsx — Small CSS/SVG visual explainers used on
   the Docker & DevOps deep-dive page. Pure presentation, no logic.
   ============================================================ */

export function ComposeDiagram() {
  return (
    <div className="diagram compose-diagram">
      <div className="compose-client">
        <span>Client</span>
        <div className="compose-client-arrow">→</div>
      </div>
      <div className="compose-network">
        <span className="compose-network-label">docker network</span>
        <div className="compose-node compose-node-nginx">
          <span className="compose-node-title">nginx</span>
          <span className="compose-node-sub">:443 exposed</span>
        </div>
        <div className="compose-edge" />
        <div className="compose-node">
          <span className="compose-node-title">app</span>
          <span className="compose-node-sub">internal only</span>
        </div>
        <div className="compose-edge" />
        <div className="compose-node compose-node-db">
          <span className="compose-node-title">mariadb</span>
          <span className="compose-node-sub">internal only</span>
        </div>
        <div className="compose-volume">
          <span>volume</span>
        </div>
      </div>
    </div>
  );
}

const LAYERS = [
  { label: 'Firewall (ufw)', sub: 'default-deny inbound' },
  { label: 'SSH: keys only', sub: 'root login disabled' },
  { label: 'Fail2ban', sub: 'auto-bans repeat failures' },
  { label: 'Least-privilege users', sub: 'sudo, not root' },
];

export function HardeningLayersDiagram() {
  return (
    <div className="diagram hardening-diagram">
      {LAYERS.map((layer, i) => (
        <div className="hardening-layer" key={layer.label} style={{ opacity: 1 - i * 0.12 }}>
          <span className="hardening-layer-index">0{i + 1}</span>
          <div>
            <div className="hardening-layer-label">{layer.label}</div>
            <div className="hardening-layer-sub">{layer.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
