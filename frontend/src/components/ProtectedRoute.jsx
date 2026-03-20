import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
