import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Fade, Card, CardContent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loader from '../../../Auth/Loader';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async'; // Added for SEO

const REACT_BASE_URL = "https://hvac-final.onrender.com"

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
  marginBottom: theme.spacing(2),
}));

const StyledEngineerButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: theme.palette.primary.main,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  background: `linear-gradient(45deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}20)`,
  transition: 'background 0.3s ease, transform 0.2s ease',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.light}40, ${theme.palette.primary.main}40)`,
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

const StyledCloseButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[2],
  transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    boxShadow: theme.shadows[4],
    transform: 'scale(1.03)',
  },
  '&:active': {
    transform: 'scale(0.97)',
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.dark}`,
    outlineOffset: '2px',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    minWidth: '300px',
    maxWidth: '500px',
  },
}));

function MyAppointments() {
  const user = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = user?.userData?.token || localStorage.getItem('accessToken');

      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${REACT_BASE_URL}/myappointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(Array.isArray(res.data.appointments) ? res.data.appointments : []);
        console.log('Response:', res.data.appointments);
      } catch (err) {
        console.log('Error fetching appointments:', err);
        setError('Failed to fetch appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userData) {
      fetchAppointments();
    } else {
      setError('User data not found. Please log in.');
      setLoading(false);
    }
  }, [user]);

  const handleOpenDialog = (engineer) => {
    setSelectedEngineer(engineer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEngineer(null);
  };

  // Structured data for WebPage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "My HVAC Appointments - Freshair Technical Systems LLC",
    "description": "View and manage your AC service appointments with Freshair Technical Systems LLC. Check appointment status, engineer details, and more.",
    "url": "https://hvacexperts.com/user/my-appointments",
    "publisher": {
      "@type": "Organization",
      "name": "Freshair Technical Systems LLC",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hvacexperts.com/assets/logo.png"
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }} aria-label="My Appointments page">
      {/* SEO Metadata */}
      <Helmet>
        <title>My HVAC Appointments - Freshair Technical Systems LLC</title>
        <meta
          name="description"
          content="View and manage your AC service appointments with Freshair Technical Systems LLC. Check appointment status, engineer details, and more."
        />
        <meta
          name="keywords"
          content="my HVAC appointments, AC service status, Freshair Technical Systems, appointment management, HVAC Dubai"
        />
        <meta name="robots" content="noindex, nofollow" /> {/* Restricted due to user-specific content */}
        <meta property="og:title" content="My HVAC Appointments - Freshair Technical Systems LLC" />
        <meta
          property="og:description"
          content="View and manage your AC service appointments with Freshair Technical Systems LLC. Check appointment status, engineer details, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hvacexperts.com/user/my-appointments" />
        <meta property="og:image" content="https://hvacexperts.com/assets/hvac-appointments-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My HVAC Appointments - Freshair Technical Systems LLC" />
        <meta
          name="twitter:description"
          content="View and manage your AC service appointments with Freshair Technical Systems LLC. Check appointment status, engineer details, and more."
        />
        <meta name="twitter:image" content="https://hvacexperts.com/assets/hvac-appointments-image.jpg" />
        <link rel="canonical" href="https://hvacexperts.com/user/my-appointments" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
        My Appointments
      </Typography>
      {error ? (
        <Typography variant="body1" color="error.main">
          {error}
        </Typography>
      ) : !user?.userData ? (
        <Typography variant="body1" color="text.secondary">
          Please log in to view your appointments.
        </Typography>
      ) : appointments.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No appointments found.
        </Typography>
      ) : (
        appointments.map((apt, index) => (
          <Fade in key={apt._id} timeout={300 + index * 100}>
            <StyledCard>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Created At:</strong> {new Date(apt.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong>{' '}
                  <Box component="span" sx={{ color: apt.appointmentStatus === 'Approved' ? 'success.main' : 'warning.main' }}>
                    {apt.appointmentStatus}
                  </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Engineer:</strong>{' '}
                  {apt.assignedEngineer ? (
                    <StyledEngineerButton
                      variant="text"
                      onClick={() => handleOpenDialog(apt.assignedEngineer)}
                      aria-label={`View details for engineer ${apt.assignedEngineer.name}`}
                    >
                      {apt.assignedEngineer.name}
                    </StyledEngineerButton>
                  ) : (
                    'Not assigned'
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Device Brand:</strong> {apt.deviceBrand}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Problem Description:</strong> {apt.problemDescription}
                </Typography>
              </CardContent>
            </StyledCard>
          </Fade>
        ))
      )}

      {/* Engineer Details Dialog */}
      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="engineer-dialog-title"
        aria-describedby="engineer-dialog-description"
      >
        <DialogTitle id="engineer-dialog-title" sx={{ fontWeight: 600 }}>
          Engineer Details
        </DialogTitle>
        <DialogContent id="engineer-dialog-description">
          {selectedEngineer ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedEngineer.name || 'Unknown'}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedEngineer.email || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Mobile:</strong> {selectedEngineer.mobile || 'N/A'}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No engineer details available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <StyledCloseButton
            onClick={handleCloseDialog}
            aria-label="Close engineer details dialog"
          >
            Close
          </StyledCloseButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
}

export default MyAppointments;