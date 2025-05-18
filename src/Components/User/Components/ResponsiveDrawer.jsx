import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Button,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import { Helmet } from 'react-helmet-async'; // Added for structured data
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

const drawerWidth = 280;

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/user/home' },
  { text: 'About Us', icon: <InfoIcon />, path: '/user/about' },
  { text: 'Our Services', icon: <CleaningServicesIcon />, path: '/user/services' },
  { text: 'Our Blogs', icon: <BookTwoToneIcon />, path: '/user/blogs' },
  { text: 'Contact Us', icon: <ContactMailIcon />, path: '/user/contact' },
  { text: 'Profile', icon: <ContactMailIcon />, path: '/user/profile' },
];

function ResponsiveDrawer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleClick = () => {
    navigate('/user/home');
  };

  // Structured data for SiteNavigationElement
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Main Navigation",
    "url": "https://hvacexperts.com",
    "potentialAction": menuItems.map(item => ({
      "@type": "NavigateAction",
      "name": item.text,
      "url": `https://hvacexperts.com${item.path}`
    }))
  };

  const drawer = (
    <Box sx={{ mt: 2, position: 'sticky', width: drawerWidth }} role="navigation" aria-label="Mobile navigation menu">
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  },
                },
                borderRadius: 2,
                m: 0.5,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  },
                },
              }}
              aria-label={`Navigate to ${item.text} page`}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path
                    ? theme.palette.primary.contrastText
                    : theme.palette.primary.main,
                  transition: 'color 0.3s ease-in-out',
                }}
                aria-hidden="true"
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Structured Data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          height: 64,
        }}>
          <IconButton
            color="primary"
            aria-label="Open mobile navigation drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Button
            variant="h1"
            onClick={handleClick}
            sx={{
              flexGrow: 1,
              alignSelf: 'center',
              fontWeight: 'bold',
              fontSize: '2rem',
              height: '100%',
              color: theme.palette.primary.main,
              '&:hover': {
                color: theme.palette.primary.dark,
              },
            }}
            aria-label="Navigate to Home page"
          >
            HVAC Technical
          </Button>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }} role="navigation" aria-label="Desktop navigation menu">
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="primary"
                startIcon={item.icon}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  padding: '8px 16px',
                  backgroundColor:
                    location.pathname === item.path
                      ? theme.palette.primary.main
                      : 'transparent',
                  color: location.pathname === item.path
                    ? theme.palette.primary.contrastText
                    : theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: location.pathname === item.path
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light,
                    color: location.pathname === item.path
                      ? theme.palette.primary.contrastText
                      : 'white',
                  },
                  transition: 'all 0.3s ease-in-out',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                }}
                aria-label={`Navigate to ${item.text} page`}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          zIndex:10000,
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
        }}
      >
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;