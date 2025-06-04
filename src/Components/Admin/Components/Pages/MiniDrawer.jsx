import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BoltIcon from '@mui/icons-material/Bolt';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import MessageIcon from '@mui/icons-material/Message';
import BuildIcon from '@mui/icons-material/Build';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectUser, logout } from '../../../../Components/Reduxwork/userslice';

import Dashboard from '../Tabs/Dashboard';
import AppointmentTable from '../Tabs/AppointmentTable';
import BlogsManagement from '../Tabs/BlogsManagement';
import EngineersList from '../Tabs/EngineersList';
import UserTable from '../Tabs/UserTable';
import ServiceManagement from '../Tabs/ServiceManagement';
import ContactIssues from '../Tabs/ContactIssues';
import Profile from '../../../Auth/Profile';

const drawerWidth = 240;

const DrawerHeader = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px',
  minHeight: '64px',
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ open }) => ({
  zIndex: 1201,
  backgroundColor: '#1976d2',
  color: '#ffffff',
  transition: 'margin 0.2s, width 0.2s',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: 'margin 0.2s, width 0.2s',
  }),
}));

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      backgroundColor: '#ffffff',
      color: '#212121',
      transition: 'width 0.2s',
      overflowX: 'hidden',
    },
  }),
  ...(!open && {
    '& .MuiDrawer-paper': {
      width: '57px',
      backgroundColor: '#ffffff',
      color: '#212121',
      transition: 'width 0.2s',
      overflowX: 'hidden',
    },
  }),
}));

export default function MiniDrawer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [selectedView, setSelectedView] = useState({
    type: 'parent',
    text: 'Dashboard',
    childIndex: null,
  });
  const [hoverText, setHoverText] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Fullscreen error:', err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error('Exit fullscreen error:', err));
    }
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleToggle = (text) => () =>
    setExpanded((prev) => ({ ...prev, [text]: !prev[text] }));

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    navigate('/login', { replace: true });
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      component: Dashboard,
      children: [],
    },
    {
      text: 'Services Data',
      icon: <BuildIcon />,
      component: ServiceManagement,
      children: [],
    },
    {
      text: 'My Blogs',
      icon: <ArticleIcon />,
      component: BlogsManagement,
      children: [],
    },
    {
      text: 'Team',
      icon: <GroupIcon />,
      component: EngineersList,
      children: [],
    },
    {
      text: 'Appointments Data',
      icon: <EventIcon />,
      component: AppointmentTable,
      children: [
        { text: 'My Appointments', icon: <BusinessIcon />, component: AppointmentTable },
        { text: 'Clients', icon: <PeopleIcon />, component: UserTable },
      ],
    },
    {
      text: 'Contact',
      icon: <ContactMailIcon />,
      component: ServiceManagement,
      children: [
        { text: 'Messages', icon: <MessageIcon />, component: ContactIssues },
      ],
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      component: Profile,
      children: [],
    },
  ];

  const matched = menuItems.find((item) => item.text === selectedView.text) || menuItems[0];
  const SelectedComponent =
    selectedView.type === 'parent'
      ? matched.component
      : matched.children?.[selectedView.childIndex]?.component ||
        (() => <Typography color="#212121">No content available</Typography>);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBarStyled position="fixed" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ color: '#ffffff' }}>
              {hoverText ||
                `${selectedView.text}${
                  selectedView.type === 'child' ? ` - ${matched.children?.[selectedView.childIndex]?.text}` : ''
                }`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BoltIcon sx={{ mr: 1, color: '#ffffff' }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#ffffff' }}>
              HVAC- Technical
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={toggleFullscreen} aria-label="toggle fullscreen">
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBarStyled>

      <DrawerStyled variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} aria-label="close drawer">
            <ChevronLeftIcon sx={{ color: '#212121' }} />
          </IconButton>
        </DrawerHeader>
        <List sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
          {menuItems.map(({ text, icon, children }) => (
            <div key={text}>
              <Tooltip
                title={
                  !open && (
                    <Box sx={{  bgcolor: '#ffffff', borderRadius: 1, color: '#212121' }}>
                      <Typography sx={{ fontWeight: 'bold', color: '#212121' }}>{text}</Typography>
                      {children?.map((child, index) => (
                        <ListItemButton
                          key={index}
                          sx={{ p: 1, borderRadius: 1, color: '#212121' }}
                          onClick={() => {
                            setOpen(true);
                            setSelectedView({ type: 'child', text, childIndex: index });
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 0, mr: 1, '& .MuiSvgIcon-root': { fontSize: '1.25rem', color: '#1976d2' } }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText primary={child.text} />
                        </ListItemButton>
                      ))}
                    </Box>
                  )
                }
                placement="right"
                onOpen={() => !open && setHoverText(text)}
                onClose={() => setHoverText(null)}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedView.text === text && selectedView.type === 'parent'}
                    onClick={() => {
                      if (!open) setOpen(true);
                      setSelectedView({ type: 'parent', text, childIndex: null });
                      if (open && children?.length > 0) handleToggle(text)();
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      color: '#212121',
                      '&.Mui-selected': {
                        bgcolor: '#e3f2fd',
                        '&:hover': { bgcolor: '#bbdefb' },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        '& .MuiSvgIcon-root': { fontSize: open ? '1.5rem' : '1.75rem', color: '#1976d2' },
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                    {open && children?.length > 0 && (
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(text)();
                        }}
                        sx={{ color: '#1976d2' }}
                      >
                        {expanded[text] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              {open && children?.length > 0 && (
                <Collapse in={expanded[text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {children.map((child, index) => (
                      <ListItem key={index} disablePadding sx={{ pl: 4 }}>
                        <ListItemButton
                          selected={selectedView.text === text && selectedView.type === 'child' && selectedView.childIndex === index}
                          onClick={() => setSelectedView({ type: 'child', text, childIndex: index })}
                          sx={{
                            color: '#212121',
                            '&.Mui-selected': {
                              bgcolor: '#e3f2fd',
                              '&:hover': { bgcolor: '#bbdefb' },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 0, mr: 2, '& .MuiSvgIcon-root': { fontSize: '1.25rem', color: '#1976d2' } }}>
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
          <ListItem disablePadding sx={{ mt: 'auto' }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{ justifyContent: open ? 'initial' : 'center', px: 2.5, color: '#212121' }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  '& .MuiSvgIcon-root': { fontSize: open ? '1.5rem' : '1.75rem', color: '#1976d2' },
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </DrawerStyled>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          transition: 'margin 0.2s',
          bgcolor: '#f5f5f5',
        }}
      >
        <DrawerHeader />
        <SelectedComponent />
      </Box>
    </Box>
  );
}