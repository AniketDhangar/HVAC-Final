import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    role: "user",

  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault(); // Prevents page reload

  //   try {
  //     const result = await axios.post("http://localhost:3000/addusers", formData, {
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     alert("You are registered");
  //     console.log(result.data);
  //     navigate('/login')

  //   } catch (error) {
  //     console.error(error);
  //     alert("Error happened");
  //   }
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:3000/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (result.data.exists) {
        alert("User already registered. Please log in.");
        navigate('/login');
      } else {
        alert("You are registered successfully!");
        console.log(result.data);
        navigate('/login');
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };


  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "inherit" }}>
        <Typography variant="h4" color="primary" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
          Create an Account
        </Typography>

        <form onSubmit={handleFormSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile"
            type="number"
            value={formData.mobile}
            onChange={handleChange}
            margin="normal"
            required

          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
            required
          />
          {/* <Select
            fullWidth
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            required
            displayEmpty
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select Role</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="engineer">Engineer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select> */}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register Now
          </Button>
        </form>
        <Box
          sx={{ mt: 2 }}>
          <Typography>already have an account ?...
            <Button variant="text" onClick={() => { navigate('/login') }} >Login now</Button>
          </Typography>

        </Box>

      </Box>

    </Container>
  );
};

export default SignUp;
