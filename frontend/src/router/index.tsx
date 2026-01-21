import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import NewCasePage from '@/pages/NewCasePage';
import EditCasePage from '@/pages/EditCasePage';
import CaseDetailPage from '@/pages/CaseDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'cases/new',
            element: <NewCasePage />,
          },
          {
            path: 'cases/:id',
            element: <CaseDetailPage />,
          },
          {
            path: 'cases/:id/edit',
            element: <EditCasePage />,
          },
        ],
      },
    ],
  },
]);
