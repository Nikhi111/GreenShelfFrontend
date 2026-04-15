import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NurseryProvider } from './context/NurseryContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NurseryProvider>
          <App />
        </NurseryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

