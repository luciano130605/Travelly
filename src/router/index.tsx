import { createBrowserRouter } from 'react-router-dom'

import Login from '../page/loginPage'
import NotFound from '../page/NotFound'
import LandingPage from '../page/landingPage'
import Registro from '../page/registerPage'
import Contacto from '../page/contactoPage'
import Terminos from '../page/terminosPage'
import Privacidad from '../page/privacidadPage'
import Faqs from '../page/faqsPage'
import OnboardingPage from '../components/Auth/Onboarding'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/registro',
    element: <Registro />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/contacto',
    element: <Contacto />,
  },
  {
    path: '/terminos',
    element: <Terminos />,
  },
  {
    path: '/privacidad',
    element: <Privacidad />,
  },
  {
    path: '/faqs',
    element: <Faqs />,
  },

  {
    path: '*',
    element: <NotFound />,
  },
])