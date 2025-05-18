import React from 'react';
import { Box, Typography, Container, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import FloatingApp from './FloatingApp';
import About from './About';
import Services from './Services';
import Blog from './Blog';
import Contact from './Contact';

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
  filter: 'brightness(0) invert(1)',
});

const Home = () => {
  const navigate = useNavigate();

  // Structured data for LocalBusiness and WebPage
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Freshair Technical Systems LLC - HVAC Services",
    "description": "Freshair Technical Systems LLC, your trusted HVAC contractor in Dubai, Abu Dhabi, Sharjah, and Al Ain, offering turnkey HVAC solutions, maintenance, and tailored services.",
    "url": "https://hvacexperts.com",
    "publisher": {
      "@type": "Organization",
      "name": "Freshair Technical Systems LLC",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hvacexperts.com/assets/logo.png"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "(555) 123-4567",
        "contactType": "Customer Service",
        "email": "service@hvacexperts.com",
        "areaServed": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain"]
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Cooling Street",
        "addressLocality": "AC City",
        "addressRegion": "State",
        "postalCode": "12345"
      },
      "sameAs": [
        "https://www.facebook.com/freshairtechnical",
        "https://www.twitter.com/freshairtechnical",
        "https://www.linkedin.com/company/freshairtechnical"
      ]
    },
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Freshair Technical Systems LLC",
      "url": "https://hvacexperts.com",
      "telephone": "(555) 123-4567",
      "email": "service@hvacexperts.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Cooling Street",
        "addressLocality": "AC City",
        "addressRegion": "State",
        "postalCode": "12345"
      },
      "areaServed": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain"]
    }
  };

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        
        <title>Freshair Technical Systems LLC - Trusted HVAC Contractor</title>
        <meta
          name="description"
          content="Freshair Technical Systems LLC, your trusted HVAC contractor in Dubai, Abu Dhabi, Sharjah, and Al Ain. Over 30 years of excellence in HVAC solutions and maintenance."
        />
        <meta
          name="keywords"
          content="HVAC contractor, AC repair Dubai, HVAC services Abu Dhabi, AC maintenance Sharjah, HVAC solutions Al Ain, Freshair Technical Systems"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Freshair Technical Systems LLC - Trusted HVAC Contractor" />
        <meta
          property="og:description"
          content="Freshair Technical Systems LLC, your trusted HVAC contractor in Dubai, Abu Dhabi, Sharjah, and Al Ain. Over 30 years of excellence in HVAC solutions and maintenance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hvacexperts.com" />
        <meta property="og:image" content="https://hvacexperts.com/assets/hvac-home-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content=" HVAC Experts - Trusted AC Repair Since 2005" />
         <meta name="twitter:title" content="Contact HVAC Experts - Get in Touch for AC Services" />
        {/* <meta name="twitter:title" content="Freshair Technical Systems LLC - Trusted HVAC Contractor" /> */}
        <meta
          name="twitter:description"
          content="Freshair Technical Systems LLC, your trusted HVAC contractor in Dubai, Abu Dhabi, Sharjah, and Al Ain. Over 30 years of excellence in HVAC solutions and maintenance."
        />
        <meta name="twitter:image" content="https://hvacexperts.com/assets/hvac-home-image.jpg" />
        <link rel="canonical" href="https://hvacexperts.com" />
        <script type="application/ld+json">
          {JSON.stringify(homeStructuredData)}
        </script>
      </Helmet>

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
          m: 0,
        }}
        aria-label="Home hero section"
      >
        <FloatingApp />
        <Container maxWidth="lg">
          <Box
            sx={{
              width: '100px',
              height: '4px',
              backgroundColor: '#1976d2',
              mb: 2,
            }}
          />
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
          <StyledButton
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ mb: 8 }}
            onClick={() => navigate('/user/services')}
            aria-label="View HVAC services"
          >
            VIEW SERVICES
          </StyledButton>
        </Container>
      </Box>

      <About />
      <Services />
      <Blog />
      <Contact />
    </>
  );
};

export default Home;