export const RESPONSES = [
  {
    keys: ['hello', 'hi', 'hey', 'sup', 'salut', 'bonjour'],
    reply: "Hey 👋 I'm a bot version of Ayoub's portfolio. Ask me about his projects, skills, experience, or how to get in touch.",
  },
  {
    keys: ['projects', 'built', 'work', 'inception', 'docker', 'container'],
    reply: "Ayoub's featured project is <strong>Inception</strong>, a full Docker Compose infrastructure with NGINX reverse proxy and persistent databases, built from scratch at 1337. He also built a raycasting engine (Wolfenstein-style), a custom Unix shell, and a thread-safe concurrency system in C.",
  },
  {
    keys: ['skills', 'stack', 'language', 'tech', 'use', 'know'],
    reply: "Core stack: <strong>C, C++, Docker, Bash, Nginx</strong>. On the creative side: After Effects, Premiere Pro, Figma, DaVinci Resolve. He's most fluent in low-level systems and DevOps, the stuff most devs avoid.",
  },
  {
    keys: ['experience', 'job', 'work', 'freelance', 'client', 'ocp', 'hilton', 'cleverlytics', 'um6p'],
    reply: "Ayoub does freelance creative direction for <strong>OCP Group, Hilton Hotels,</strong> and <strong>Cleverlytics</strong>, motion graphics and full-production video. He also produced institutional media for <strong>UM6P</strong> (Mohammed VI Polytechnic University).",
  },
  {
    keys: ['school', '1337', '42', 'student', 'cursus', 'curriculum'],
    reply: "<strong>1337 Coding School</strong> (42 Network), a peer-learning, project-based school with no teachers and no hand-holding. Projects completed: Minishell, Philosophers, Cub3D, Push_swap, Minitalk, Inception, and more.",
  },
  {
    keys: ['internship', 'intern', 'Intern', 'hire', 'hiring', 'available', 'opportunity'],
    reply: "Ayoub is actively looking for a <strong>software engineering internship</strong>, Fullstack, backend or systems work. Reach him directly at ayoub2elazhari@gmail.com or via LinkedIn.",
  },
  {
    keys: ['contact', 'email', 'reach', 'linkedin', 'github', 'touch', 'connect'],
    reply: "Best ways to reach Ayoub:<br>📧 ayoub2elazhari@gmail.com<br>💼 <a href='https://www.linkedin.com/in/ayoub-elazhari-958bb1233' target='_blank' style='color:var(--c-gold-1)'>LinkedIn</a><br>🐙 <a href='https://github.com/AelElz' target='_blank' style='color:var(--c-gold-1)'>GitHub</a>",
  },
  {
    keys: ['creative', 'video', 'motion', 'design', 'edit', 'director', 'film', 'art direction', 'editing'],
    reply: "5+ years in creative production, video editing, motion graphics, sound design. Check his creative reel via the <strong>Creative Work ↗</strong> link at the top of the page.",
  },
  {
    keys: ['morocco', 'casablanca', 'location', 'based', 'where'],
    reply: 'Based in Morocco, currently at Casablanca.',
  },
  {
    keys: ['who', 'about', 'yourself', 'tell me', 'ayoub'],
    reply: 'Ayoub Elazhari, software engineering student at 1337 (42 Network) and freelance creative director. He builds OS-level systems in C/C++ by day and motion graphics for enterprise clients by night. Two tracks, one mindset.',
  },
];

export const FALLBACK = "I'm not sure about that one, for anything specific, reach Ayoub directly at ayoub2elazhari@gmail.com. He's quick to reply.";

export const GREETING = "Hey, I'm Ayoub's bot. What do you want to know? 👇";

export const CHIPS = [
  { label: 'Projects', query: 'projects' },
  { label: 'Skills', query: 'skills' },
  { label: 'Experience', query: 'experience' },
  { label: 'Internship', query: 'internship' },
  { label: 'Contact', query: 'contact' },
];

export function getReply(text) {
  const lower = text.toLowerCase();

  for (const entry of RESPONSES) {
    const isMatch = entry.keys.some((k) => {
      const regex = new RegExp(`\\b${k}\\b`, 'i');
      return regex.test(lower);
    });

    if (isMatch) return entry.reply;
  }
  return FALLBACK;
}
