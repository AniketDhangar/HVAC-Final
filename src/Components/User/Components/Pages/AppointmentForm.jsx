import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from '@mui/material';
import toast, { Toaster } from "react-hot-toast";
import { Helmet } from 'react-helmet-async'; // Added for SEO

const REACT_BASE_URL = "https://hvac-final.onrender.com"

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    serviceId: '',
    deviceBrand: '',
    problemDescription: '',
  });

  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${REACT_BASE_URL}/services`);
        console.log("all services", res.data.allServices);
        setServices(res.data.allServices || []);
      } catch (err) {
        toast.error("Failed to fetch services.");
        console.log(err);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login first.");
      return;
    }

    try {
      await axios.post(`${REACT_BASE_URL}/takeappoinment`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        name: '',
        email: '',
        mobile: '',
        address: '',
        serviceId: '',
        deviceBrand: '',
        problemDescription: '',
      });

      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to book appointment.");
    }
  };

  return (
    <Container component="main" maxWidth="md">
      {/* SEO Metadata */}
      <Helmet>
        <title>Book AC Service Appointment - HVAC Experts</title>
        <meta
          name="description"
          content="Schedule your AC repair or maintenance appointment with HVAC Experts. Fast, reliable 24/7 service with certified technicians. Book now for expert solutions."
        />
        <meta
          name="keywords"
          content="book AC service, HVAC appointment, AC repair booking, HVAC Experts, 24/7 AC service, certified technicians"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Book AC Service Appointment - HVAC Experts" />
        <meta
          property="og:description"
          content="Schedule your AC repair or maintenance appointment with HVAC Experts. Fast, reliable 24/7 service with certified technicians. Book now for expert solutions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hvacexperts.com/book-appointment" />
        <meta property="og:image" content="https://hvacexperts.com/assets/hvac-appointment-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book AC Service Appointment - HVAC Experts" />
        <meta
          name="twitter:description"
          content="Schedule your AC repair or maintenance appointment with HVAC Experts. Fast, reliable 24/7 service with certified technicians. Book now for expert solutions."
        />
        <meta name="twitter:image" content="https://hvacexperts.com/assets/hvac-appointment-image.jpg" />
        <link rel="canonical" href="https://hvacexperts.com/book-appointment" />
      </Helmet>

      <Toaster position="top-right" />
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Book AC Service
        </Typography>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Device Brand"
                name="deviceBrand"
                value={formData.deviceBrand}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Service</InputLabel>
                <Select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  label="Service"
                >
                  {services.map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.serviceName}
                    </MenuItem>
                  ))}
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Service Address"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Problem Description"
                name="problemDescription"
                multiline
                rows={4}
                value={formData.problemDescription}
                onChange={handleChange}
                placeholder="Please describe the issue you're experiencing with your AC..."
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button fullWidth type="submit" variant="contained" sx={{ py: 1.5 }}>
              Book Service
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default AppointmentForm;