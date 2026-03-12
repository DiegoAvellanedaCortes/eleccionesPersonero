import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    // replace: true evita que el usuario pueda volver con la flecha del navegador
    return <Navigate to="/" replace />;
  } 

  return children;
};