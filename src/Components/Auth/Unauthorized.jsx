import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Unauthorized() {
  return (
    <Container maxWidth="sm">
      <Box 
        textAlign="center" 
        mt={10} 
        p={4} 
        bgcolor="#ffe6e6" 
        borderRadius={2}
        boxShadow={3}
      >
        <Typography variant="h3" color="error" gutterBottom>
          403 - Unauthorized
        </Typography>
        <Typography variant="body1" color="textSecondary">
          You do not have permission to access this page.
        </Typography>
      </Box>
    </Container>
  );
}

export default Unauthorized;
