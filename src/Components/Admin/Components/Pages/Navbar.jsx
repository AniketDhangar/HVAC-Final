import React, { useState } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarToday as AppointmentIcon,
  People as UserIcon,
  Home as HomeIcon,
  Star as ReviewIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Book as BookIcon,
  CleaningServices as CleaningServicesIcon,
  ContactMail as ContactMailIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Navbar({ onTabChange }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const tabs = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Appointments', icon: <UserIcon />, path: '/appointments' },
    { text: 'Clients', icon: <UserIcon />, path: '/clients' },
    { text: 'Services', icon: <CleaningServicesIcon />, path: '/services' },
    { text: 'Blogs', icon: <ContactMailIcon />, path: '/blogs' },
  ];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#333' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Menu Icon for Mobile */}
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              HVAC ADMIN
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                {tabs.map((tab) => (
                  <Box
                    key={tab.text}
                    sx={{
                      mx: 2,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': { color: 'primary.main' },
                    }}
                    onClick={() => onTabChange(tab.text)}
                  >
                    {tab.icon}
                    <Typography sx={{ ml: 1 }}>{tab.text}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Profile Menu */}
            <Box sx={{ flexGrow: isMobile ? 1 : 0, display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 2 }}>
                  <Avatar alt="Admin User" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
                <MenuItem onClick={() => console.log('User logged out')}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer for Mobile */}
      {isMobile && (
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
          <Box sx={{ width: 250 }} role="presentation">
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                HVAC ADMIN
              </Typography>
            </Box>
            <Divider />
            <List>
              {tabs.map((tab) => (
                <ListItem key={tab.text} component="button" onClick={() => onTabChange(tab.text)}>
                  <ListItemIcon>{tab.icon}</ListItemIcon>
                  <ListItemText primary={tab.text} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              <ListItem component="button" onClick={() => navigate('/settings')}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
              <ListItem component="button" onClick={() => console.log('User logged out')}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}
    </>
  );
}

export default Navbar;
