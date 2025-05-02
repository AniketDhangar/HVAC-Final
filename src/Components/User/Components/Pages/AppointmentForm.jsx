import React, { useState } from 'react';
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
import { useAuth } from '../../../Routes/AuthContext';
import { useNavigate } from 'react-router-dom';


const serviceTypes = ["Repair", "Installation", "Service", "Other", "Maintenance"];

const AppointmentForm = () => {
  const navigate = useNavigate()
  const { user } = useAuth();
  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    serviceType: '',
    deviceBrand: '',
    // appointmentDate:'',
    problemDescription: '',
  });

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3000/takeappoinment",
  //       formData
  //     );
  //     setFormData({
  //       userName: '',
  //       userEmail: '',
  //       userMobile: '',
  //       userAddress: '',
  //       serviceType: '',
  //       deviceBrand: '',
  //       problemDescription: '',
  //     });
  //     toast.success("you request is sent successfully");

  //     // alert("Service request submitted successfully!");
  //     // console.log(response.data);
  //   } catch (error) {
  //     toast.error("An error occurred while submitting the request.");
  //     console.error(error); 
  //   }
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.name || !formData.email || !formData.mobile || !formData.address || !formData.serviceType) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      // Get authentication token
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in first.");
        return;
      }

      // Send appointment request
      const response = await axios.post(
        "http://localhost:3000/takeappoinment",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        mobile: "",
        address: "",
        serviceType: "",
        deviceBrand: "",
        problemDescription: "",
      });

      toast.success("Your request has been sent successfully!");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          toast.error(error.response.data.message || "An error occurred.");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
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
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{ mt: 2 }}
        >
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

            {/* <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label=""
                name="appointmentDate"
                type="date"
                value={formData.appointmentDate}
                onChange={handleChange}
              />
            </Grid> */}

            {/* 
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
            </LocalizationProvider> */}




            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Service Type</InputLabel>
                <Select
                  name="serviceType"
                  value={formData.serviceType || ""}
                  onChange={handleChange}
                  label="Service Type"
                >
                  {serviceTypes.map((service) => (
                    <MenuItem key={service} value={service}>
                      {service}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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