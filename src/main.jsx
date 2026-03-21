import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'

import App from "./App.jsx"

// Set dark mode as default unless theme is explicitly set to 'light'
if (localStorage.getItem('theme') === 'light') {
  document.documentElement.classList.remove('dark')
} else {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
