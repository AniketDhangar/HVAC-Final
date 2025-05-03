import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import AdminRoutes from './Routing/AdminRoutes';
import UserRoutes from './Routing/UserRoutes';
import EngineerRoutes from './Routing/EngineerRoutes';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userData } = useSelector((state) => state.user || {});
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userData?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/*"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminRoutes />
          </PrivateRoute>
        }
      />

      <Route
        path="/engineer/*"
        element={
          <PrivateRoute allowedRoles={['engineer']}>
            <EngineerRoutes />
          </PrivateRoute>
        }
      />

      <Route
        path="/user/*"
        element={
          // <PrivateRoute allowedRoles={['user']}>
            <UserRoutes />
          // </PrivateRoute>
        }
      />

      <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
};

export default App;
