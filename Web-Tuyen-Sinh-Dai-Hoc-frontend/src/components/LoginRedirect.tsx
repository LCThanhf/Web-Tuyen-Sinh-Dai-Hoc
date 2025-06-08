import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginRedirectProps {
  userRole: string | null;
  children: React.ReactNode;
}

const LoginRedirect: React.FC<LoginRedirectProps> = ({ userRole, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole) {
      console.log('LoginRedirect: redirecting user with role:', userRole);
      const redirectPath = userRole === 'admin' ? '/admin' : '/student/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [userRole, navigate]);

  return <>{children}</>;
};

export default LoginRedirect;
