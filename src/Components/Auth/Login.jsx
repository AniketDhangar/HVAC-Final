import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Typography, Alert, Paper,
  CircularProgress, Box, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from "../Reduxwork/userslice";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [authStatus, setAuthStatus] = useState({ loading: false, errorMsg: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setAuthStatus({ loading: true, errorMsg: '' });

    try {
      const { data } = await axios.post("http://localhost:3000/login", formData);

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      const { loggedUser } = data;
      const { accessToken, refreshToken } = loggedUser;

      if (!accessToken) {
        throw new Error("Authentication failed: No token received");
      }

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", loggedUser._id);

      // Update Redux store with complete user data
      dispatch(setUser({
        loggedUser: {
          ...loggedUser,
          token: accessToken,
          isLoggedIn: true
        },
        token: accessToken,
        isLoggedIn: true
      }));

      console.log('Login successful, user data:', loggedUser);

      // Navigate based on role
      switch (loggedUser.role) {
        case "admin":
          navigate("/main/dashboard", { replace: true });
          break;
        case "user":
          navigate("/user/home", { replace: true });
          break;
        case "engineer":
          navigate("/engineer/dashboard", { replace: true });
          break;
        default:
          navigate("/login", { replace: true });
      }

    } catch (err) {
      console.error("Login error:", err);
      setAuthStatus({
        loading: false,
        errorMsg: err.response?.data?.message || err.message || "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h4" color="primary" align="center" fontWeight="bold" mb={3}>
          Welcome Back
        </Typography>

        {authStatus.errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {authStatus.errorMsg}
          </Alert>
        )}

        <form onSubmit={handleFormSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={authStatus.loading}
          >
            {authStatus.loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
          <Box sx={{mt:3}}>
            <Typography sx={{mt:3}}>Wants to create an account ? <Button  onClick={() => navigate('/signup')}>Sign up</Button></Typography>
          </Box>

        </form>
      </Paper>
    </Container>
  );
};

export default LoginForm;
