import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, userData } = useSelector((state) => state.user || {});

  if (!isLoggedIn || !userData) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
