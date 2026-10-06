import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { SplashGate } from './page/SplashGate'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SplashGate>
      <RouterProvider router={router} />
    </SplashGate>
  </StrictMode>,
)