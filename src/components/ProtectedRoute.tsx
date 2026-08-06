import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { isJwtTokenValid } from '@/utils/auth';

const useAuthSession = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = Boolean(user && isJwtTokenValid(token));

  useEffect(() => {
    if (hasHydrated && !isAuthenticated && (user || token)) {
      logout();
    }
  }, [hasHydrated, isAuthenticated, logout, token, user]);

  return { hasHydrated, isAuthenticated };
};

export const ProtectedRoute = () => {
  const { hasHydrated, isAuthenticated } = useAuthSession();
  const location = useLocation();

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { hasHydrated, isAuthenticated } = useAuthSession();

  if (!hasHydrated) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
