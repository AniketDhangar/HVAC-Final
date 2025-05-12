// Logout.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Reduxwork/userSlice';
import { Typography, Box, CircularProgress } from '@mui/material';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clear all local storage items
        localStorage.clear();
        
        // Dispatch logout action
        dispatch(logout());
        
        // Navigate to login page
        navigate('/login', { replace: true });
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [dispatch, navigate]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography variant="h6">Logging out...</Typography>
    </Box>
  );
};

export default Logout;