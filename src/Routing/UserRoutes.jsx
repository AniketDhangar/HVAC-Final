import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ResponsiveDrawer from '../Components/User/Components/ResponsiveDrawer';
import Home from '../Components/User/Components/Pages/Home';
import About from '../Components/User/Components/Pages/About';
import Contact from '../Components/User/Components/Pages/Contact';
import Blog from '../Components/User/Components/Pages/Blog';
import Services from '../Components/User/Components/Pages/Services';
import Cart from '../Components/User/Components/Pages/Cart';
import AppointmentForm from '../Components/User/Components/Pages/AppointmentForm';
import Profile from '../../src/Components/Auth/Profile';
import ProtectedRoute from './ProtectedRoute';

const UserRoutes = () => {
  return (
    <>
      <ResponsiveDrawer />
      <Routes>
        {/* Public Routes */}
        <Route index path="home" element={<Home />} />
        <Route index path="about" element={<About />} />
        <Route index path="contact" element={<Contact />} />
        <Route index path="blogs" element={<Blog />} />
        <Route index path="services" element={<Services />} />

        {/* Protected Routes */}
        <Route
          path="cart"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route index
          path="take-appointment"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <AppointmentForm />
            </ProtectedRoute>
          }
        />
        {/* Optional: Protect profile route */}
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/user/home" />} />
      </Routes>
    </>
  );
};

export default UserRoutes;
