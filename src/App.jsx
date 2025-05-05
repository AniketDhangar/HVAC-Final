import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import AdminRoutes from './Routing/AdminRoutes';
import UserRoutes from './Routing/UserRoutes';
import EngineerRoutes from './Routing/EngineerRoutes';
import { useSelector } from 'react-redux';
import Home from './Components/User/Components/Pages/Home';
import About from './Components/User/Components/Pages/About';
import Contact from './Components/User/Components/Pages/Contact';
import Blog from './Components/User/Components/Pages/Blog';
import Services from './Components/User/Components/Pages/Services';
import ResponsiveDrawer from './Components/Engineer/EngineerNavbar';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userData } = useSelector((state) => state.user || {});
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log("userData", userData)
  if (!allowedRoles.includes(userData?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
  console.log("userData", userData)
};

const App = () => {
  return (
    <Routes>
    
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/user/home" element={<Home />} />
      <Route path="/user/about" element={<About />} />
      <Route path="/user/contact" element={<Contact />} />
      <Route path="/user/blogs" element={<Blog />} />
      <Route path="/user/services" element={<Services />} /> */}

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
