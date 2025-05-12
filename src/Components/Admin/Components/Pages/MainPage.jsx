import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { extendTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import Person2Icon from '@mui/icons-material/Person2';
import ArticleIcon from '@mui/icons-material/Article';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Suspense } from 'react';
import Loader from '../../../Auth/Loader';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../Components/Reduxwork/userslice';

export default function DashboardLayoutBasic({ window }) {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  // Ensure user is admin
  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  const NAVIGATION = [
    { kind: 'header', title: 'Menus' },
    { segment: 'main/dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
    { segment: 'main/my-services', title: 'Services', icon: <DesignServicesIcon /> },
    { segment: 'main/my-appointments', title: 'Appointments', icon: <EventNoteIcon /> },
    { segment: 'main/my-clients', title: 'Clients', icon: <Person2Icon /> },
    { segment: 'main/my-blogs', title: 'Blogs', icon: <ArticleIcon /> },
    { segment: 'main/my-engineers', title: 'Engineers', icon: <ArticleIcon /> },
    { segment: 'main/my-contacts', title: 'Contacted Users', icon: <ContactMailIcon /> },
    { segment: 'main/my-profile', title: 'Profile', icon: <ContactMailIcon /> },

  ];

  const demoTheme = extendTheme({
    title: 'Admin Dashboard',
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: 'class',
    breakpoints: { values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1536 } },
  });

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
      branding={{ title: 'HVAC Admin Panel', homeUrl: 'dashboard' }}
      window={window}
    >
      <DashboardLayout>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    </AppProvider>
  );
}