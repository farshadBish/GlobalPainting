import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { PaintingProvider } from './context/PaintingContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PaintingProvider>
    <App />
    </PaintingProvider>
  </React.StrictMode>,
)
