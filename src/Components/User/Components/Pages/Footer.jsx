import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../../../../assets/images/logo.png';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: '#fff',
  padding: theme.spacing(6, 0),
  marginTop: '200px',
}));

const QuickLinksList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  '& li': {
    marginBottom: '8px',
  },
  '& a': {
    color: '#fff',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}); // Fixed: Removed extra parenthesis and added semicolon

const Footer = () => {
  // Structured data for Organization
  const footerStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Freshair Technical Systems LLC",
    "url": "https://hvacexperts.com",
    "logo": "https://hvacexperts.com/assets/logo.png",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "(555) 123-4567",
        "contactType": "Customer Service",
        "email": "service@hvacexperts.com",
        "areaServed": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain"]
      }
    ],
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
  };

  return (
    <StyledFooter aria-label="Footer with company information, navigation links, and contact details">
      {/* Structured Data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(footerStructuredData)}
        </script>
      </Helmet>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Box mb={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <img src={logo} alt="Freshair Technical Systems LLC Logo" style={{ height: '50px' }} />
              <Typography variant="h4">Freshair Technical</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your trusted HVAC contractor providing expert AC repair and maintenance in Dubai, Abu Dhabi, Sharjah, and Al Ain.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Box role="navigation" aria-label="Quick navigation links">
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              <QuickLinksList>
                <li><RouterLink to="/" aria-label="Go to Home page" style={{ color: '#fff', textDecoration: 'none' }}>Home</RouterLink></li>
                <li><RouterLink to="/about" aria-label="Go to About Us page" style={{ color: '#fff', textDecoration: 'none' }}>About Us</RouterLink></li>
                <li><RouterLink to="/services" aria-label="Go to Our Services page" style={{ color: '#fff', textDecoration: 'none' }}>Our Services</RouterLink></li>
                <li><RouterLink to="/contact" aria-label="Go to Contact Us page" style={{ color: '#fff', textDecoration: 'none' }}>Contact Us</RouterLink></li>
                <li><RouterLink to="/blogs" aria-label="Go to Our Blogs page" style={{ color: '#fff', textDecoration: 'none' }}>Our Blogs</RouterLink></li>
              </QuickLinksList>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} aria-hidden="true" />
              <Typography variant="body2">
                123 Cooling Street, AC City, State 12345
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 1 }} aria-hidden="true" />
              <Typography variant="body2">
                <Link href="tel:+5551234567" color="inherit" aria-label="Call us at (555) 123-4567">
                  (555) 123-4567
                </Link>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 1 }} aria-hidden="true" />
              <Typography variant="body2">
                <Link href="mailto:service@hvacexperts.com" color="inherit" aria-label="Email us at service@hvacexperts.com">
                  service@hvacexperts.com
                </Link>
              </Typography>
            </Box>
          </Grid>

          {/* Map */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Find Us
            </Typography>
            <Box sx={{ height: '200px', width: '100%' }}>
              <iframe
                title="Freshair Technical Systems LLC Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7462.0219285616!2d55.27835011053917!3d25.19760910515125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5f8d61ec939d%3A0x5a815b0f95eec05f!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1609377225229!5m2!1sen!2sae"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ borderTop: '1px solid #333', mt: 4, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Freshair Technical Systems LLC. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;