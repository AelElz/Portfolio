import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

/* Import order is the cascade (§9). Four tiers, and the last two have
   to stay last — an override that loads before the rules it overrides
   only reaches half the site. */

// ── tier 1: foundation
import './css/tokens.css';
import './css/reset.css';

// ── tier 2: layers
import './css/cursor.css';
import './css/nav.css';
import './css/chatbot.css';
import './css/page-transition.css';

// ── tier 3: content sections
import './css/sections.css';
import './css/hero.css';
import './css/about.css';
import './css/skills.css';
import './css/projects.css';
import './css/experience.css';
import './css/contact.css';
import './css/project-detail.css';
import './css/motion-design.css';

// ── tier 4: overrides, always last
import './css/animations.css';
import './css/responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
