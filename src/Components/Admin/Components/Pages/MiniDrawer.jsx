import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline, Tooltip, Button, Collapse } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BuildIcon from '@mui/icons-material/Build';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BoltIcon from '@mui/icons-material/Bolt';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, logout } from '../../../../Components/Reduxwork/userslice';
import { Logout } from '@mui/icons-material';
import Dashboard from '../Tabs/Dashboard';
import AppointmentTable from '../Tabs/AppointmentTable';
import UserTable from '../Tabs/UserTable';
import BlogsManagement from '../Tabs/BlogsManagement';
import ContactIssues from '../Tabs/ContactIssues';
import ServiceManagement from '../Tabs/ServiceManagement';
import EngineersList from '../Tabs/EngineersList';
import Profile from '../../../Auth/Profile';

const drawerWidth = 240;

const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
//   alignItems: 'start',
//   justifyContent: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['margin', 'width'], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
  }),
}));

const DrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
      overflowX: 'hidden',
    },
  }),
  ...(!open && {
    '& .MuiDrawer-paper': {
      width: `calc(${theme.spacing(7)} + 1px)`,
      [theme.breakpoints.up('sm')]: { width: `calc(${theme.spacing(9)} + 1px)` },
      transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }),
      overflowX: 'hidden',
    },
  }),
}));

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Typography>Something went wrong. Please try again.</Typography>;
    }
    return this.props.children;
  }
}

export default function MiniDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [open, setOpen] = useState(true); // Open drawer by default for visibility
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [selectedView, setSelectedView] = useState({ type: 'parent', text: 'Dashboard', childIndex: null });
  const [expanded, setExpanded] = useState({ Appointments: true }); // Expand Appointments by default

  // Sync selectedView with URL
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const childPath = pathParts[pathParts.length - 1];
    const basePath = pathParts[pathParts.length - 2] || childPath || 'dashboard';

    const parentItem = menuItems.find(item => item.path === basePath);
    const childItem = menuItems
      .filter(item => item.children?.length)
      .flatMap(item => item.children.map((child, index) => ({ ...child, parentText: item.text, childIndex: index })))
      .find(child => child.path === childPath);

    console.log('useEffect Debug:', { path: location.pathname, basePath, childPath, parentItem, childItem });

    if (childItem) {
      setSelectedView({ type: 'child', text: childItem.parentText, childIndex: childItem.childIndex });
      setExpanded({ [childItem.parentText]: true });
    } else if (parentItem) {
      setSelectedView({ type: 'parent', text: parentItem.text, childIndex: null });
      setExpanded(parentItem.children.length ? { [parentItem.text]: true } : {});
    } else {
      setSelectedView({ type: 'parent', text: 'Dashboard', childIndex: null });
      setExpanded({ Appointments: true });
      navigate('dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleToggle = (text) => () => {
    setExpanded((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard', component: Dashboard, children: [] },
    {
      text: 'Appointments',
      icon: <HomeIcon />,
      path: 'my-appointments',
      component: AppointmentTable,
      children: [
        { text: 'Users', icon: <StarIcon />, path: 'users', component: UserTable },
      ],
    },
    { text: 'Blogs', icon: <InfoIcon />, path: 'my-blogs', component: BlogsManagement, children: [] },
    { text: 'Contacts', icon: <ContactMailIcon />, path: 'my-contacts', component: ContactIssues, children: [] },
    { text: 'Services', icon: <BuildIcon />, path: 'my-services', component: ServiceManagement, children: [] },
    { text: 'Engineers', icon: <GroupIcon />, path: 'my-engineers', component: EngineersList, children: [] },
    { text: 'Profile', icon: <PersonIcon />, path: 'my-profile', component: Profile, children: [] },
  ];

  const matched = menuItems.find(item => item.text === selectedView.text) || menuItems[0];

  // Debug rendering
  console.log('Rendering Debug:', { selectedView, matched, childComponent: matched.children?.[selectedView.childIndex]?.component });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: 'flex',  }}>
        <CssBaseline />
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 3.5, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              {selectedView.type === 'parent' ? selectedView.text : `${selectedView.text} - ${matched.children?.[selectedView.childIndex]?.text || 'Child'}`}
            </Typography>
            <Box sx={{ display: 'flex', px: 2, flexGrow: 1 }}>
              <BoltIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={700}>
                DevDash
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                color: 'common.white',
                py: { xs: 0.5, sm: 1 },
                px: { xs: 1.5, sm: 2 },
                mx: 1,
                boxShadow: 2,
                '&:hover': { background: 'linear-gradient(45deg, #1565c0, #1976d2)', boxShadow: 4, transform: 'scale(1.03)' },
                '&:active': { transform: 'scale(0.97)' },
                '&:focus': { outline: '2px solid #1565c0', outlineOffset: '2px' },
              }}
              aria-label="Log out"
            >
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Logout
              </Typography>
            </Button>
            <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton
                color="inherit"
                onClick={() => {
                  setDarkMode(!darkMode);
                  localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
                }}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                sx={{ ml: 'auto' }}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBarStyled>

        <DrawerStyled variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose} aria-label="close drawer">
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <List>
            {menuItems.map(({ text, icon, path, children }) => (
              <div key={text}>
                <Tooltip title={open ? '' : text} placement="right" disableInteractive>
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      onClick={() => {
                        setSelectedView({ type: 'parent', text, childIndex: null });
                        navigate(path);
                        if (!open) setOpen(true);
                        if (open && children.length > 0) handleToggle(text)();
                      }}
                      aria-label={`Navigate to ${text}`}
                      sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center' }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 2 : 'auto',
                          justifyContent: 'center',
                          alignItems: 'center',
                          '& .MuiSvgIcon-root': { fontSize: open ? '1.5rem' : '2rem' },
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                      {open && children.length > 0 && (
                        <IconButton edge="end" onClick={(e) => { e.stopPropagation(); handleToggle(text)(); }}>
                          {expanded[text] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      )}
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                {open && children.length > 0 && (
                  <Collapse in={expanded[text]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {children.map((child, index) => (
                        <ListItem key={child.text} disablePadding sx={{ pl: 4 }}>
                          <ListItemButton
                            onClick={() => {
                              setSelectedView({ type: 'child', text, childIndex: index });
                              navigate(`my-appointments/${child.path}`);
                              console.log('Navigating to child:', { text, childIndex: index, path: `my-appointments/${child.path}` });
                            }}
                            aria-label={`Navigate to ${child.text}`}
                          >
                            <ListItemIcon sx={{ minWidth: 0, mr: 2, '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}>
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText primary={child.text} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </div>
            ))}
          </List>
        </DrawerStyled>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${theme.spacing(7)} + 1px)`,
            height: { xs: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:0px)']?.minHeight}px)`, sm: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)` },
            marginTop: { xs: theme.mixins.toolbar['@media (min-width:0px)']?.minHeight, sm: theme.mixins.toolbar.minHeight },
            overflow: 'auto',
            bgcolor: 'background.default',
          }}
        >
          <ErrorBoundary>
            {selectedView.type === 'parent' ? (
              (() => {
                const Component = matched.component;
                return <Component 
                // sx={{ width: '100%', height: '100%' }}
                 />;
              })()
            ) : (
              <Box
            //    sx={{ width: '100%', height: '100%', p: 2 }}
               >
                {matched.children?.[selectedView.childIndex]?.component ? (
                  (() => {
                    const ChildComponent = matched.children[selectedView.childIndex].component;
                    return <ChildComponent
                    //  sx={{ width: '100%', height: '100%' }} 
                     />;
                  })()
                ) : (
                  <Typography color="error">No child content available for {selectedView.text} - Users</Typography>
                )}
              </Box>
            )}
          </ErrorBoundary>
        </Box>
      </Box>
    </ThemeProvider>
  );
}