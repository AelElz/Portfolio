import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './css/tokens.css';
import './css/reset.css';
import './css/cursor.css';
import './css/nav.css';
import './css/hero.css';
import './css/sections.css';
import './css/about.css';
import './css/skills.css';
import './css/projects.css';
import './css/experience.css';
import './css/contact.css';
import './css/chatbot.css';
import './css/animations.css';
import './css/responsive.css';
import './css/project-detail.css';
import './css/motion-design.css';
import './css/page-transition.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
