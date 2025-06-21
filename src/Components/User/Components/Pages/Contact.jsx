import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper
} from '@mui/material';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import { Helmet } from 'react-helmet-async'; // Added for SEO

const REACT_BASE_URL = "https://hvac-final.onrender.com" 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${REACT_BASE_URL}/addcontacts`, formData);
      console.log(response.data);
      toast.success("Your request was sent successfully");
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error("Failed to submit form");
      console.error(error);
    }
  };

  // Structured data for LocalBusiness
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "HVAC Experts",
    "telephone": "(555) 123-4567",
    "email": "service@hvacexperts.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Cooling Street",
      "addressLocality": "AC City",
      "addressRegion": "State",
      "postalCode": "12345"
    },
    "url": "https://hvacexperts.com/contact",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "(555) 123-4567",
      "email": "service@hvacexperts.com"
    }
  };

  return (
    <Container maxWidth="md">
      {/* SEO Metadata */}
      <Helmet>
        <title>Contact HVAC Experts - Get in Touch for AC Services</title>
        <meta
          name="description"
          content="Contact HVAC Experts for AC repair, maintenance, or inquiries. Reach us via phone, email, or our online form for fast, reliable service."
        />
        <meta
          name="keywords"
          content="contact HVAC, AC repair contact, HVAC Experts, AC service inquiry, customer service HVAC"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Contact HVAC Experts - Get in Touch for AC Services" />
        <meta
          property="og:description"
          content="Contact HVAC Experts for AC repair, maintenance, or inquiries. Reach us via phone, email, or our online form for fast, reliable service."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hvacexperts.com/contact" />
        <meta property="og:image" content="https://hvacexperts.com/assets/hvac-contact-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact HVAC Experts - Get in Touch for AC Services" />
        <meta
          name="twitter:description"
          content="Contact HVAC Experts for AC repair, maintenance, or inquiries. Reach us via phone, email, or our online form for fast, reliable service."
        />
        <meta name="twitter:image" content="https://hvacexperts.com/assets/hvac-contact-image.jpg" />
        <link rel="canonical" href="https://hvacexperts.com/contact" />
        <script type="application/ld+json">
          {JSON.stringify(contactStructuredData)}
        </script>
      </Helmet>

      <Box sx={{ my: 4 }}>
        <Toaster position="top-right" />
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Have questions? We'd love to hear from you.
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
              aria-label="Enter your full name"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              aria-label="Enter your email address"
            />

            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              variant="outlined"
              aria-label="Enter the subject of your message"
            />

            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              multiline
              rows={5}
              variant="outlined"
              aria-label="Enter your message or inquiry"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Send Message
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Contact;