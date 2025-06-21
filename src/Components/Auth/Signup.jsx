import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Fade,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";


const REACT_BASE_URL = "http://localhost:3000" 

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${REACT_BASE_URL}/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      if (result.data.exists) {
        alert("User already registered. Please log in.");
        navigate('/login');
      } else {
        toast.success('You are registered successfully!')
      
        console.log(result.data);
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 2, sm: 3 },
      }}
    >
      <Toaster position="top-right"/>
      <Fade in timeout={500}>
        <Card
          sx={{
            maxWidth: 600,
            width: '100%',
            borderRadius: 3,
            boxShadow: 6,
            bgcolor: 'background.paper',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 10,
            },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 3,
                letterSpacing: '-0.5px',
              }}
              aria-label="Create an Account"
            >
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
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                InputLabelProps={{ sx: { fontWeight: 500 } }}
                aria-required="true"
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
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                InputLabelProps={{ sx: { fontWeight: 500 } }}
                aria-required="true"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                InputLabelProps={{ sx: { fontWeight: 500 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                aria-required="true"
              />
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                InputLabelProps={{ sx: { fontWeight: 500 } }}
                aria-required="true"
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                InputLabelProps={{ sx: { fontWeight: 500 } }}
                aria-required="true"
              />
              {/* <Select
                fullWidth
                name="role"
                value={formData.role}
                onChange={handleChange}
                margin="normal"
                required
                displayEmpty
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
                aria-label="Select Role"
              >
                <MenuItem value="" disabled>
                  Select Role
                </MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="engineer">Engineer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select> */}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                  color: 'common.white',
                  boxShadow: 3,
                  transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                    boxShadow: 6,
                    transform: 'scale(1.03)',
                  },
                  '&:active': {
                    transform: 'scale(0.97)',
                  },
                  '&:focus': {
                    outline: '2px solid #1565c0',
                    outlineOffset: '2px',
                  },
                }}
                aria-label="Register Now"
              >
                Register Now
              </Button>
            </form>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', display: 'inline' }}
              >
                Already have an account?{' '}
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  color: 'primary.main',
                  background: 'linear-gradient(45deg, #42a5f520, #1976d220)',
                  borderRadius: 10,
                  px: 2,
                  py: 0.5,
                  m: 2,
                  transition: 'background 0.3s ease, transform 0.2s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #42a5f540, #1976d240)',
                    transform: 'scale(1.03)',
                  },
                  '&:active': {
                    transform: 'scale(0.97)',
                  },
                  '&:focus': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                  },
                }}
                aria-label="Login now"
              >
                Login now
              </Button>
              <Box><b>Note: </b>You can't change Email, once it saved.</Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default Signup;