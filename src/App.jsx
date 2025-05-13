import React, { createContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import AdminRoutes from './Routing/AdminRoutes';
import UserRoutes from './Routing/UserRoutes';
import EngineerRoutes from './Routing/EngineerRoutes';
import Unauthorized from './Components/Auth/Unauthorized';
import PrivateRoute from './Routing/PrivateRoute';
import NotFound from './Components/Auth/NotFound';
import Loader from './Components/Auth/Loader';

export const ReloadContext = createContext();

const App = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [loading, setLoading] = useState(true); // Initially true

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (reloadTrigger) {
      window.location.reload();
    }
  }, [reloadTrigger]);

  const triggerReload = () => {
    console.log('Triggering project-wide reload');
    setReloadTrigger(true);
  };

  if (loading) {
    return <Loader message="Please wait while the app loads..." />;
  }

  return (
    <ReloadContext.Provider value={{ triggerReload }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/not-found" element={<NotFound />} />

        <Route
          path="/main/*"
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
            <PrivateRoute allowedRoles={['user']}>
              <UserRoutes />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </ReloadContext.Provider>
  );
};

export default App;
