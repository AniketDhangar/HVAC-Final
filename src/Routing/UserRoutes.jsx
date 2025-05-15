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
import Profile from '../Components/Auth/Profile';
import ProtectedRoute from './ProtectedRoute';
import MyAppointments from '../Components/User/Components/Pages/MyAppointments';
import { CssBaseline } from '@mui/material';
import Footer from '../Components/User/Components/Pages/Footer';

const UserRoutes = () => {
  return (
    <> 
    <CssBaseline/>
      <ResponsiveDrawer />
      <Routes>
        {/* Public Routes */}
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blogs" element={<Blog />} />
        <Route path="services" element={<Services />} />

        {/* Protected Routes - Only accessible to logged-in users */}
        <Route
          path="cart"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="take-appointment"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <AppointmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-appointments"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        {/* Default route */}
        <Route path="/" element={<Navigate to="home" replace />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="home" replace />} />
       
      </Routes>
       <Footer/>
    </>
  );
};

export default UserRoutes;
