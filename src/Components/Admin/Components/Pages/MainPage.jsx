
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { extendTheme, useTheme } from '@mui/material/styles';
import { Button, Box, Typography, IconButton, Tooltip } from '@mui/material';
import {
  Dashboard,
  Build,
  Event,
  People,
  Article,
  Engineering,
  Contacts,
  Person,
  Logout,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import React, { Suspense, useEffect, useState } from 'react';
import Loader from '../../../Auth/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logout } from '../../../../Components/Reduxwork/userslice';
import {  useDemoRouter } from '@toolpad/core/internal';
export default function DashboardLayoutBasic({ window }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const theme = useTheme();
  const [colorScheme, setColorScheme] = useState('light');


  const router = useDemoRouter('/home');

  // Ensure user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  // Sync color scheme with document class
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(colorScheme);
  }, [colorScheme]);

  const handleToggleTheme = () => {
    setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    navigate('/login', { replace: true });
  };

  const NAVIGATION = [
    { kind: 'header', title: 'Menus' },
    { segment: 'main/dashboard', title: 'Dashboard', icon: <Dashboard /> },
    { segment: 'main/my-services', title: 'Services', icon: <Build /> },
    { segment: 'main/my-appointments', title: 'Appointments', icon: <Event /> },
    { segment: 'main/my-clients', title: 'Clients', icon: <People /> },
    { segment: 'main/my-blogs', title: 'Blogs', icon: <Article /> },
    { segment: 'main/my-engineers', title: 'Engineers', icon: <Engineering /> },
    { segment: 'main/my-contacts', title: 'Contacted Users', icon: <Contacts /> },
    { segment: 'main/my-profile', title: 'Profile', icon: <Person /> },
  ];

  const demoTheme = extendTheme({
    title: 'Admin Dashboard',
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: 'class',
    breakpoints: { values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1536 } },
    palette: {
      primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
      background: {
        default: theme.palette.mode === 'light' ? '#f5f5f5' : '#121212',
        paper: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: theme.palette.mode === 'light' ? '#212121' : '#ffffff',
        secondary: theme.palette.mode === 'light' ? '#757575' : '#b0bec5',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h6: { fontWeight: 600 },
      body2: { fontWeight: 500 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(66, 165, 245, 0.2)',
            },
          },
        },
      },
    },
  });

  return (
    <AppProvider
    linkComponent={Link}
      navigation={NAVIGATION}
      theme={demoTheme}
      branding={{
        title: 'HVAC Admin Panel',
        homeUrl: '/main/dashboard',
      }}
      window={window}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                p: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  display: { xs: 'none', sm: 'inline' },
                  fontWeight: 500,
                }}
              >
                {user?.name || 'Admin'}
              </Typography>
              <Tooltip title={`Switch to ${colorScheme === 'light' ? 'Dark' : 'Light'} Mode`}>
                <IconButton
                  onClick={handleToggleTheme}
                  color="inherit"
                  sx={{
                    bgcolor: colorScheme === 'light' ? 'grey.200' : 'grey.800',
                    '&:hover': {
                      bgcolor: colorScheme === 'light' ? 'grey.300' : 'grey.700',
                      transform: 'scale(1.1)',
                    },
                  }}
                  aria-label={`Switch to ${colorScheme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {colorScheme === 'light' ? <Brightness4 /> : <Brightness7 />}
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{
                  background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                  color: 'common.white',
                  py: { xs: 0.5, sm: 1 },
                  px: { xs: 1.5, sm: 2 },
                  boxShadow: 2,
                  transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                    boxShadow: 4,
                    transform: 'scale(1.03)',
                  },
                  '&:active': {
                    transform: 'scale(0.97)',
                  },
                  '&:focus': {
                    outline: '2px solid #1565c0',
                    outlineOffset: '2px',
                  },
                }}
                aria-label="Log out"
              >
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Logout
                </Typography>
              </Button>
            </Box>
          ),
        }}
      >
        <Suspense fallback={<Loader />}>
        <Outlet />
        </Suspense>
      </DashboardLayout>
    </AppProvider>
  );
}