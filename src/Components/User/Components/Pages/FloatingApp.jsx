import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fab, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { styled } from '@mui/material/styles';

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 1000,
  padding: theme.spacing(2, 3),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const FloatingApp = () => {
  const navigate = useNavigate();

  const handleAppointmentClick = () => {
    navigate('/take-appointment');
  };

  return (
    <StyledFab
      variant="extended"
      color="primary"
      onClick={handleAppointmentClick}
      aria-label="Take Appointment"
    >
      <EventIcon sx={{ mr: 1 }} />
      <Typography variant="button">
        Take Appointment
      </Typography>
    </StyledFab>
  );
};

export default FloatingApp;
