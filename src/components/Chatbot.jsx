import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CHIPS, GREETING, getReply } from '../data/chatbot-responses';

let uid = 0;
const nextId = () => uid++;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showChips, setShowChips] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');

  const msgsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, isTyping]);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    setHasSeen(true);

    if (next && !hasGreeted) {
      setHasGreeted(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: nextId(), from: 'bot', html: GREETING }]);
      }, 200);
      setTimeout(() => setShowChips(true), 900);
    }

    if (next) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const respond = (queryText) => {
    const reply = getReply(queryText);
    setIsTyping(true);
    const delay = 600 + Math.min(reply.length * 14, 1000);
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

  return (
    <div id="chatbot" className={`${isOpen ? 'open' : ''} ${hasSeen ? 'seen' : ''}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-label="Chat with Ayoub's portfolio bot"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: 'bottom right' }}
          >
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
                  transition={{ duration: 0.22, ease: 'easeOut' }}
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
                  transition={{ duration: 0.22, ease: 'easeOut' }}
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
                  <button
                    key={label}
                    className="chip"
                    onClick={() => sendChip(label, query)}
                  >
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

      <button id="chat-trigger" aria-label="Open chat" onClick={toggle}>
        <div className="chat-orbit" />
        <div className="chat-pulse" />
        <div className="chat-notify" />
        <span className="chat-trigger-icon">&gt;_</span>
        <span className="chat-close-icon">×</span>
      </button>
    </div>
  );
}
