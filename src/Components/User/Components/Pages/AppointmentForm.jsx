import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Container, TextField, Typography, Paper,
  Grid, Stack
} from '@mui/material';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    deviceBrand: '',
    problemDescription: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { name, email, mobile, address } = res.data.user;

        setFormData(prev => ({
          ...prev,
          name,
          email,
          mobile,
          address,
        }));
      } catch (error) {
        toast.error("Failed to fetch user data.");
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/takeappoinment",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Appointment created successfully!");
      setFormData(prev => ({
        ...prev,
        deviceBrand: '',
        problemDescription: '',
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container component="main" maxWidth="md">
      <Toaster position="top-right" />
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Book AC Service
        </Typography>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="mobile"
                value={formData.mobile}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Device Brand"
                name="deviceBrand"
                value={formData.deviceBrand}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Service Address"
                name="address"
                value={formData.address}
                fullWidth
                multiline
                rows={2}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Problem Description"
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button type="submit" variant="contained" fullWidth sx={{ py: 1.5 }}>
              Book Service
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default AppointmentForm;
