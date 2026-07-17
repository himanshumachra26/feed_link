import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Reset preferences to default values
localStorage.setItem('darkMode', 'false');
localStorage.setItem('language', 'en');
localStorage.setItem('hideHamburger', 'false');
document.documentElement.classList.remove('dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
