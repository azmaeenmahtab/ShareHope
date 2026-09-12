import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import Login from './pages/Auth/LoginPage'
import Signup from './pages/Auth/SignupPage'
 import Requests from './pages/Requests'
import DonationRequestPage from './pages/DonationRequestPage'
import TransactionPage from './pages/profile/transaction'
import MyProfile from './pages/profile/myProfile'
import MyRequests from './pages/profile/myRequests'
import ZakatCalculator from './pages/ZakatCalculator'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/requests',
        element: <Requests />,
      },
      {
        path: '/donation-request',
        element: <DonationRequestPage />,
      },
      {
        path: '/transaction',
        element: <TransactionPage />,
      },
      {
        path: '/profile',
        element: <MyProfile />,
      },
      {
        path: '/my-requests',
        element: <MyRequests />,
      },
      {
        path: '/zakat-calculator',
        element: <ZakatCalculator />,
      },
     
    ],
  },
])
