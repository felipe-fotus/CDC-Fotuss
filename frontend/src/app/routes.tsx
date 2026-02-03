import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './AppShell';
import InadimplenciaListPage from '../modules/inadimplencia/pages/InadimplenciaListPage';
import ContractDetailPage from '../modules/contratos/pages/ContractDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/inadimplencia" replace />,
      },
      {
        path: 'inadimplencia',
        element: <InadimplenciaListPage />,
      },
      {
        path: 'contratos/:id',
        element: <ContractDetailPage />,
      },
    ],
  },
]);
