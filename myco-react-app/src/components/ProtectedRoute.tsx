'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'editor' | 'admin';
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole = 'user',
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        // User is not authenticated
        router.push(redirectTo);
        return;
      }

      if (requiredRole && userProfile) {
        const roleHierarchy = { user: 1, editor: 2, admin: 3 };
        const userRoleLevel = roleHierarchy[userProfile.role] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

        if (userRoleLevel < requiredRoleLevel) {
          // User doesn't have required role
          router.push('/'); // Redirect to home or access denied page
          return;
        }
      }
    }
  }, [currentUser, userProfile, loading, requiredRole, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Don't render children if user is not authenticated or doesn't have required role
  if (!currentUser) {
    return null;
  }

  if (requiredRole && userProfile) {
    const roleHierarchy = { user: 1, editor: 2, admin: 3 };
    const userRoleLevel = roleHierarchy[userProfile.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return null;
    }
  }

  return <>{children}</>;
}