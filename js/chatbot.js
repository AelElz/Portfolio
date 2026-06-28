/* ============================================================
   chatbot.js — Portfolio chatbot, no backend required
   Keyword-matched responses about Ayoub + graceful fallback
   ============================================================ */

/* ── Response map ── */
const RESPONSES = [
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
    keys: ['internship', 'intern','Intern', 'hire', 'hiring', 'available', 'opportunity'],
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
    reply: "Based in Morocco, currently at Casablanca.",
  },
  {
    keys: ['who', 'about', 'yourself', 'tell me', 'ayoub'],
    reply: "Ayoub Elazhari, software engineering student at 1337 (42 Network) and freelance creative director. He builds OS-level systems in C/C++ by day and motion graphics for enterprise clients by night. Two tracks, one mindset.",
  },
];

const FALLBACK = "I'm not sure about that one, for anything specific, reach Ayoub directly at ayoub2elazhari@gmail.com. He's quick to reply.";

const GREETING = "Hey, I'm Ayoub's bot. What do you want to know? 👇";

const CHIPS = [
  { label: 'Projects', query: 'projects' },
  { label: 'Skills', query: 'skills' },
  { label: 'Experience', query: 'experience' },
  { label: 'Internship', query: 'internship' },
  { label: 'Contact', query: 'contact' },
];

/* ── State ── */
let isOpen     = false;
let hasGreeted = false;

/* ── DOM ── */
const chatbot  = document.getElementById('chatbot');
const trigger  = document.getElementById('chat-trigger');
const msgs     = document.getElementById('chat-messages');
const input    = document.getElementById('chat-input');
const sendBtn  = document.getElementById('chat-send');
const chipsEl  = document.getElementById('chat-chips');

/* ── Toggle panel ── */
trigger.addEventListener('click', () => {
  isOpen = !isOpen;
  chatbot.classList.toggle('open', isOpen);
  chatbot.classList.add('seen'); // hide notification dot

  if (isOpen && !hasGreeted) {
    hasGreeted = true;
    setTimeout(() => addBotMessage(GREETING), 200);
    setTimeout(() => renderChips(), 900);
  }

  if (isOpen) {
    setTimeout(() => input.focus(), 300);
  }
});

/* ── Send message ── */
function send() {
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = '';
  clearChips();

  const reply = getReply(text);
  showTyping(reply);
}

sendBtn.addEventListener('click', send);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

/* ── Keyword matching ── */
function getReply(text) {
  const lower = text.toLowerCase();
  
  for (const entry of RESPONSES) {
    // Use \b to ensure it only matches whole words
    const isMatch = entry.keys.some((k) => {
      const regex = new RegExp(`\\b${k}\\b`, 'i');
      return regex.test(lower);
    });

    if (isMatch) {
      return entry.reply;
    }
  }
  return FALLBACK;
}

/* ── Typing simulation ── */
function showTyping(reply) {
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  msgs.appendChild(indicator);
  scrollToBottom();

  const delay = 600 + Math.min(reply.length * 14, 1000);

  setTimeout(() => {
    indicator.remove();
    addBotMessage(reply);
    renderChips();
  }, delay);
}

/* ── Message builders ── */
function addBotMessage(html) {
  const el = document.createElement('div');
  el.className = 'msg bot';
  el.innerHTML = html;
  msgs.appendChild(el);
  scrollToBottom();
}

function addUserMessage(text) {
  const el = document.createElement('div');
  el.className = 'msg user';
  el.textContent = text;
  msgs.appendChild(el);
  scrollToBottom();
}

/* ── Quick-reply chips ── */
function renderChips() {
  chipsEl.innerHTML = '';
  CHIPS.forEach(({ label, query }) => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      addUserMessage(label);
      clearChips();
      const reply = getReply(query);
      showTyping(reply);
    });
    chipsEl.appendChild(btn);
  });
}

function clearChips() {
  chipsEl.innerHTML = '';
}

/* ── Scroll ── */
function scrollToBottom() {
  msgs.scrollTop = msgs.scrollHeight;
}

/* ── Register cursor hover on dynamic elements ── */
// Extend the cursor system to include chatbot elements
function registerCursorTarget(el) {
  if (!el) return;
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
}

registerCursorTarget(trigger);
registerCursorTarget(sendBtn);

// Delegate chip cursor hover
chipsEl.addEventListener('mouseover', (e) => {
  if (e.target.classList.contains('chip')) document.body.classList.add('cursor-hover');
});
chipsEl.addEventListener('mouseout', (e) => {
  if (e.target.classList.contains('chip')) document.body.classList.remove('cursor-hover');
});
