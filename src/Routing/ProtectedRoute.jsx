import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, userData } = useSelector((state) => state.user || {});
  console.log('isLoggedIn:', isLoggedIn);
  console.log('userData:', userData);

  if (!isLoggedIn || !userData) {
    return <Navigate to="/login" />;
  }

  // if (!allowedRoles.includes(userData.role)) {
  //   return <Navigate to="/unauthorized" />;
  // }



  try {
    if (!isLoggedIn || !userData) {
      return <Navigate to="/login" />;
    }
    if (!allowedRoles.includes(userData.role)) {
      return <Navigate to="/unauthorized" />;
    }
  
  } catch (error) {
    console.log(error)
  }

  return <Outlet />;
};

export default ProtectedRoute;
