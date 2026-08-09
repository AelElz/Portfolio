import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { CHIPS, GREETING, getReply } from '../data/chatbot-responses';
import { spring, project } from '../motion/springs';

let uid = 0;
const nextId = () => uid++;

/* Past this projected endpoint the sheet is going away, so let it.
   The decision comes from where the gesture is HEADED, not from where
   the finger happened to lift (§6). */
const DISMISS_PROJECTION = 110;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showChips, setShowChips] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [isTouch, setIsTouch] = useState(false);

  const msgsRef = useRef(null);
  const inputRef = useRef(null);
  const controls = useAnimationControls();

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const sync = () => setIsTouch(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, isTyping]);

  /* The panel's `animate` is driven by controls so a drag release can
     re-target it mid-flight; the entrance therefore has to be started
     here rather than declared as a static target. */
  useEffect(() => {
    if (isOpen) controls.start({ opacity: 1, y: 0, scale: 1, transition: spring.move });
  }, [isOpen, controls]);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    setHasSeen(true);

    if (next && !hasGreeted) {
      setHasGreeted(true);
      /* Short enough to read as the panel settling, not as waiting.
         Every timer on the input path is a latency to justify (§1). */
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: nextId(), from: 'bot', html: GREETING }]);
      }, 120);
      setTimeout(() => setShowChips(true), 500);
    }

    if (next) setTimeout(() => inputRef.current?.focus(), 260);
  };

  const respond = (queryText) => {
    const reply = getReply(queryText);
    setIsTyping(true);
    const delay = 350 + Math.min(reply.length * 8, 650);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), from: 'bot', html: reply }]);
      setShowChips(true);
    }, delay);
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: nextId(), from: 'user', text }]);
    setInput('');
    setShowChips(false);
    respond(text);
  };

  const sendChip = (label, query) => {
    setMessages((prev) => [...prev, { id: nextId(), from: 'user', text: label }]);
    setShowChips(false);
    respond(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  /* ── Drag-to-dismiss (touch only) ──────────────────────────────
     Framer Motion tracks 1:1 from the grab point with pointer capture,
     stays interruptible mid-flight, and hands back release velocity.
     dragElastic is the rubber-band past the boundary (§2, §3, §9). */
  const handleDragEnd = (_event, info) => {
    const projected = info.offset.y + project(info.velocity.y);

    if (projected > DISMISS_PROJECTION) {
      setIsOpen(false);          // exit animation continues the gesture
      return;
    }

    // Snapping home after a throw — the one place bounce is earned (§4).
    controls.start({
      y: 0,
      transition: { ...spring.flick, velocity: info.velocity.y },
    });
  };

  const dragProps = isTouch
    ? {
        drag: 'y',
        dragConstraints: { top: 0, bottom: 0 },
        dragElastic: { top: 0.04, bottom: 0.55 },
        dragMomentum: false,
        onDragEnd: handleDragEnd,
      }
    : {};

  return (
    <div id="chatbot" className={`${isOpen ? 'open' : ''} ${hasSeen ? 'seen' : ''}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-label="Chat with Ayoub's portfolio bot"
            animate={controls}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            /* No overshoot: this opened from a tap, and a tap carries
               no momentum to spend on a bounce (§4). */
            transition={spring.move}
            style={{ transformOrigin: 'bottom right' }}
            {...dragProps}
          >
            <div className="chat-grabber" aria-hidden="true" />

            <div className="chat-header">
              <img
                className="chat-header-avatar"
                src="https://avatars.githubusercontent.com/u/155688529?v=4"
                alt="Ayoub"
              />
              <div className="chat-header-info">
                <div className="chat-header-name">Ayoub · Portfolio Bot</div>
                <div className="chat-header-status">
                  <span className="status-dot" />
                  <span>Usually responds instantly</span>
                </div>
              </div>
            </div>

            <div className="chat-messages" ref={msgsRef}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  className={`msg ${m.from}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring.move}
                  {...(m.from === 'bot' ? { dangerouslySetInnerHTML: { __html: m.html } } : {})}
                >
                  {m.from === 'user' ? m.text : null}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  className="typing-indicator"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring.move}
                >
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </motion.div>
              )}
            </div>

            {showChips && (
              <div className="chat-chips" id="chat-chips">
                {CHIPS.map(({ label, query }) => (
                  <button key={label} className="chip" onClick={() => sendChip(label, query)}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="chat-input-row">
              <input
                id="chat-input"
                ref={inputRef}
                type="text"
                placeholder="Ask something…"
                autoComplete="off"
                maxLength={200}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button id="chat-send" aria-label="Send message" onClick={send}>
                <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        id="chat-trigger"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <div className="chat-orbit" />
        <div className="chat-notify" />
        <span className="chat-trigger-icon">&gt;_</span>
        <span className="chat-close-icon">×</span>
      </button>
    </div>
  );
}
