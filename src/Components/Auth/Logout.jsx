// Logout.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../ReduxWork/UserSlice';
import { Typography, Box } from '@mui/material';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    navigate('/login');
  }, [dispatch, navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">Logging out...</Typography>
    </Box>
  );
};

export default Logout;