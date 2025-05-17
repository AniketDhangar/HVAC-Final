import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
  Fade,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../Reduxwork/userslice';

const REACT_BASE_URL = "http://localhost:3000" 

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
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setAuthStatus({ loading: true, errorMsg: '' });

    try {
      const { data } = await axios.post(`${REACT_BASE_URL}/login`, formData);

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const { loggedUser } = data;
      const { accessToken, refreshToken } = loggedUser;

      if (!accessToken) {
        throw new Error('Authentication failed: No token received');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', loggedUser._id);

      dispatch(
        setUser({
          loggedUser: {
            ...loggedUser,
            token: accessToken,
            isLoggedIn: true,
          },
          token: accessToken,
          isLoggedIn: true,
        })
      );

      console.log('Login successful, user data:', loggedUser);

      switch (loggedUser.role) {
        case 'admin':
          navigate('/main/dashboard', { replace: true });
          break;
        case 'user':
          navigate('/user/home', { replace: true });
          break;
        case 'engineer':
          navigate('/engineer/dashboard', { replace: true });
          break;
        default:
          navigate('/login', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthStatus({
        loading: false,
        errorMsg: err.response?.data?.message || err.message || 'Login failed. Please check your credentials.',
      });
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
      <Fade in timeout={500}>
        <Paper
          elevation={6}
          sx={{
            maxWidth: 500,
            width: '100%',
            borderRadius: 3,
            bgcolor: 'background.paper',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 10,
            },
            p: 4,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 3,
              letterSpacing: '-0.5px',
            }}
            aria-label="Welcome Back"
          >
            Welcome Back
          </Typography>

          {authStatus.errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {authStatus.errorMsg}
            </Alert>
          )}

          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              margin="normal"
              variant="outlined"
              required
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
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              margin="normal"
              variant="outlined"
              required
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
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              aria-required="true"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={authStatus.loading}
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
                '&:disabled': {
                  background: 'grey.500',
                  color: 'grey.300',
                },
              }}
              aria-label="Login"
            >
              {authStatus.loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', display: 'inline' }}
              >
                Don't have an account?{' '}
              </Typography>
              <Button
                onClick={() => navigate('/signup')}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  color: 'primary.main',
                  background: 'linear-gradient(45deg, #42a5f520, #1976d220)',
                  borderRadius: 10,
                  px: 2,
                  py: 0.5,
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
                aria-label="Sign up"
              >
                Sign up
              </Button>
            </Box>
          </form>
        </Paper>
      </Fade>
    </Container>
  );
};

export default LoginForm;