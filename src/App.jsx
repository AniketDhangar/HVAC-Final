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

// Create ReloadContext
export const ReloadContext = createContext();

const App = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false);

  // Function to trigger reload
  const triggerReload = () => {
    console.log('Triggering project-wide reload');
    setReloadTrigger(true);
  };

  // Effect to handle reload
  useEffect(() => {
    if (reloadTrigger) {
      window.location.reload();
    }
  }, [reloadTrigger]);

  return (
    <ReloadContext.Provider value={{ triggerReload }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/not-found" element={<NotFound />} />

        {/* Protected Admin Routes */}
        <Route
          path="/main/*"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminRoutes />
            </PrivateRoute>
          }
        />

        {/* Protected Engineer Routes */}
        <Route
          path="/engineer/*"
          element={
            <PrivateRoute allowedRoles={['engineer']}>
              <EngineerRoutes />
            </PrivateRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/user/*"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <UserRoutes />
            </PrivateRoute>
          }
        />

        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all route - redirect to not found */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </ReloadContext.Provider>
  );
};

export default App;