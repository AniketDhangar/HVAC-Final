import React from 'react';
import { Box, Typography, Container, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';
import Files from '../Files';
import FloatingApp from './FloatingApp';
import About from './About';
import Services from './Services';
import Blog from './Blog';
import Contact from './Contact';

// Remove local image imports and use online URLs
// const brandLogos = {
//   carrier: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Carrier_logo.svg",
//   goodman: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Goodman_logo.png",
//   daikin: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Daikin_logo.svg",
//   rheem: "https://upload.wikimedia.org/wikipedia/commons/8/89/Rheem_logo.svg",
//   mekar: "https://www.mekar.eu/wp-content/uploads/2019/02/logo-mekar.png"
// };

// Background image URL
const backgroundImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '10px 24px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  borderRadius: '4px',
  textTransform: 'none',
}));

const BrandLogo = styled('img')({
  height: '40px',
  margin: '0 20px',
  objectFit: 'contain',
  filter: 'brightness(0) invert(1)', // Makes logos white
});


const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(rgba(65, 111, 160, 0.40), rgba(27, 47, 69, 0.20)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          color: 'white',
          // p: 8,
          m: 0,
        }}
      >
        <FloatingApp />
        <Container maxWidth="lg">
          {/* Blue accent element */}
          <Box
            sx={{
              width: '100px',
              height: '4px',
              backgroundColor: '#1976d2',
              mb: 2,
            }}
          />

          {/* Decades text */}
          <Typography
            variant="subtitle1"
            sx={{
              mb: 3,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            DECADES OF EXPERTISE YOU CAN TRUST
          </Typography>

          {/* Main heading */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              mb: 4,
              fontSize: { xs: '2.5rem', md: '4rem' },
              maxWidth: '800px',
            }}
          >
            Your Trusted HVAC Partner in Excellence
          </Typography>

          {/* Description */}
          <Typography
            variant="h6"
            sx={{
              mb: 6,
              maxWidth: '800px',
              fontWeight: 'normal',
              lineHeight: 1.6,
            }}
          >
            Freshair Technical Systems LLC, your preferred HVAC contractor in Dubai, Abu Dhabi, Sharjah, and Al Ain.
            With over three decades of excellence, we offer turnkey HVAC solutions, maintenance, and tailored services.
          </Typography>

          {/* CTA Button */}
          <StyledButton
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ mb: 8 }}
            onClick={() => navigate('/services')}
          >
            VIEW SERVICES
          </StyledButton>

        </Container>

      </Box>

      {/* all files are called here in hero section */}
      <About />
      <Services />
      <Blog />
      <Contact />
    </>

  );
};

export default Home;
