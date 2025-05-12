import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsLoggedIn, selectUser, selectToken } from '../Components/Reduxwork/userslice';

const PrivateRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userData = useSelector(selectUser);
  const token = useSelector(selectToken);
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');

  console.log('PrivateRoute check:', {
    isLoggedIn,
    userRole: userData?.role,
    allowedRoles,
    hasToken: !!accessToken,
    hasReduxToken: !!token,
    currentPath: location.pathname
  });

  // If no token in localStorage or Redux, redirect to login
  if (!accessToken || !token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    console.log('User not logged in, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user doesn't have required role, redirect to unauthorized
  if (!allowedRoles.includes(userData?.role)) {
    console.log('Role check failed:', { userRole: userData?.role, allowedRoles });
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is blocked, redirect to unauthorized
  if (userData?.isBlock) {
    console.log('User is blocked, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the protected component
  console.log('All checks passed, rendering protected component');
  return children;
};

export default PrivateRoute; 