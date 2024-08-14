import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ path: string, element: React.ReactNode, isAuthenticated: boolean }> = ({ path, element, isAuthenticated }) => {
  return isAuthenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/pagina-login" replace />
  );
};

export default ProtectedRoute;
