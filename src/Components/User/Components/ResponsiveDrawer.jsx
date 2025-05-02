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

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

const drawerWidth = 280;

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'About Us', icon: <InfoIcon />, path: '/about' },
  { text: 'Our Services', icon: <CleaningServicesIcon />, path: '/services' },
  { text: 'Our Blogs', icon: <BookTwoToneIcon />, path: '/blogs' },
  { text: 'Contact Us ', icon: <ContactMailIcon />, path: '/contact' },
  { text: 'Profile', icon: <ContactMailIcon />, path: '/profile' },


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
    navigate('/');
  };

  const drawer = (
    <Box sx={{ mt: 2, position: 'sticky', width: drawerWidth }}>
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
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path
                    ? theme.palette.primary.contrastText
                    : theme.palette.primary.main,
                  transition: 'color 0.3s ease-in-out',
                }}
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
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar sx={{
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          height: 64,
        }}>
          <IconButton
            color="primary"
            aria-label="open drawer"
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
              alignSelf:'center',
              fontWeight: 'bold',
              fontSize: '2rem',
              height: '100%',
              // padding: '16px 250px',
              // width: '100%',
              // bgcolor:'red',
              color: theme.palette.primary.main,
              '&:hover': {
                color: theme.palette.primary.dark,
                // color:'white'
              },
            }}
          >
            AC Services
          </Button>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
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
                      // ? 'white' 
                      : 'white',
                      // : theme.palette.primary.main,
                  },
                  transition: 'all 0.3s ease-in-out',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                }}
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
          // mt: 8, // Add margin top to account for fixed AppBar
        }}
      >
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
