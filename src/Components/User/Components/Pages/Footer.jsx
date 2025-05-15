  import React from 'react';
  import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
  import { styled } from '@mui/material/styles';
  import LocationOnIcon from '@mui/icons-material/LocationOn';
  import PhoneIcon from '@mui/icons-material/Phone';
  import EmailIcon from '@mui/icons-material/Email';
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
  });

  const Footer = () => {
    return (
      <StyledFooter>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Logo and Company Info */}
            <Grid item xs={12} sm={6} md={3}>
              <Box mb={2} sx={{display:'flex ', alignItems:'center',justifyContent:'space-around'}}>
                <img src={logo} alt="Company Logo" style={{ height: '50px' }} />
              
              <Typography variant='h4'> HVAC Company</Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Your company description goes here. Make it brief but meaningful.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              <QuickLinksList>
                <li><Link href="home">Home</Link></li>
                <li><Link href="about">About Us</Link></li>
                <li><Link href="services">Our Services</Link></li>
                <li><Link href="contact">Contact Us</Link></li>
                <li><Link href="blogs">Our Blogs</Link></li>
              </QuickLinksList>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  123 Business Street, City, Country
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <Link href="tel:+1234567890" color="inherit">
                    +1 (234) 567-890
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <Link href="mailto:info@company.com" color="inherit">
                    info@company.com
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
    title="Location Map"
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
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
