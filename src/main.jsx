import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { CatalogProvider } from './lib/catalog.jsx'
import './styles.css'
import { captureRef } from './lib/referral.js'

captureRef()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CatalogProvider>
          <App />
        </CatalogProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
