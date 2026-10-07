import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { SplashGate } from './page/SplashGate'
import { initTheme } from './lib/theme'
import './index.css'

// Aplica el tema guardado en cualquier ruta (no solo en la landing).
initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SplashGate>
      <RouterProvider router={router} />
    </SplashGate>
  </StrictMode>,
)