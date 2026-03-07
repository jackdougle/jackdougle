import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'

import App from "./App.jsx"

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
