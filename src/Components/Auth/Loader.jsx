// SmoothLoader.jsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
`;

const Loader = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          animation: `${pulse} 1.5s ease-in-out infinite`,
        }}
      >
        <CircularProgress size={70} thickness={4.5} />
      </Box>
      <Typography
        variant="h6"
        mt={2}
        color="text.secondary"
        sx={{ letterSpacing: 1 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
