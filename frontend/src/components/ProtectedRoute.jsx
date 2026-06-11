import { Navigate, Outlet } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, booting } = useAuth();

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center bg-stone-50 text-slate-700 dark:bg-zinc-950 dark:text-zinc-100">
        <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
