import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EngineerNavbar from '../Components/Engineer/EngineerNavbar';
import EngineerDashboard from '../Components/Engineer/EngineerDashboard';
import AppointmentDetails from '../Components/Engineer/AppointmentDetails';
import Profile from '../Components/Auth/Profile';
import { Box } from '@mui/material';

function EngineerRoutes() {
  return (
    <>
      <EngineerNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Routes>
          <Route index element={<EngineerDashboard />} />
          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="appointments" element={<EngineerDashboard />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Box>
    </>
  );
}

export default EngineerRoutes;