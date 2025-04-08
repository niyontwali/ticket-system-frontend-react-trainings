import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const AuthGuard = () => {
  const { token, user, isLoading } = useAuth();

  // Show a loading state while we're checking authentication
  if (token && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // If we have both token and user data, render the protected route
  // Otherwise, redirect to login
  return token && user ? <Outlet /> : <Navigate to="/" replace />;
};

export default AuthGuard;