export const DOCKER_DEVOPS_PROJECTS = [
  {
    id: 'compose-stack',
    index: '01',
    name: 'Containerized Infrastructure Stack',
    tagline: 'A full stack, in isolated containers, with no pre-built images.',
    what:
      "A multi-service web infrastructure orchestrated entirely with Docker Compose — an NGINX reverse proxy, an application server, and a MariaDB database, each running in its own container built from a custom Dockerfile instead of a public one.",
    how: [
      'Every image is built from a minimal base (Debian) with its own Dockerfile — no `FROM wordpress` or `FROM nginx` shortcuts, so every install and config step is explicit and reproducible instead of hidden inside someone else\'s image.',
      'Containers only talk to each other over an internal Docker bridge network; the only port exposed to the host is NGINX\'s, so the app and database stay unreachable from outside even though they\'re running on the same machine.',
      'NGINX terminates TLS and reverse-proxies requests to the app container by service name, using Docker\'s internal DNS — which is why the compose file\'s service names double as hostnames.',
      'The database\'s data directory is mounted as a named volume, so recreating or rebuilding the container doesn\'t wipe the data — only deleting the volume itself would.',
    ],
    concepts: ['Docker Compose', 'Custom Dockerfiles', 'NGINX reverse proxy', 'Service isolation', 'Named volumes'],
    diagram: 'compose',
    href: 'https://github.com/AelElz/containerized-infrastructure-stack',
  },
  {
    id: 'server-hardening',
    index: '02',
    name: 'Debian Server Hardening',
    tagline: "Locking a server down the way you'd actually deploy one.",
    what:
      "A production-style hardening pass on a Debian VM — moving it from a default install to something you could put on the open internet without immediately regretting it.",
    how: [
      'SSH is restricted to key-based auth only, root login is disabled, and the listening port is changed — closing off the most common brute-force vector before anything else is configured.',
      'A firewall (ufw) default-denies inbound traffic and only opens the ports the server actually needs, instead of trusting whatever happens to be listening.',
      'Fail2ban watches auth logs and temporarily bans IPs after repeated failed logins, turning "someone is trying" into an automatic response instead of a 3am page.',
      'Day-to-day tasks run under least-privilege users with sudo, not root, so a compromised process or a bad command doesn\'t hand over the whole machine.',
    ],
    concepts: ['SSH hardening', 'Firewall rules', 'Intrusion detection', 'Least privilege', 'Log monitoring'],
    diagram: 'hardening',
    href: 'https://github.com/AelElz/debian-server-hardening',
  },
];
