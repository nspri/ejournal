import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CombinedProvider from './providers/CombinedProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CombinedProvider>
      <App />
      </CombinedProvider>
  </StrictMode>,
)
