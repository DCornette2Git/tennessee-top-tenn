import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'   // <- imports Tailwind and your global CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="tennessee-top-tenn">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
