import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Typography, Alert, Paper,
  CircularProgress, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from "../Reduxwork/userslice";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [authStatus, setAuthStatus] = useState({ loading: false, errorMsg: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setAuthStatus({ loading: true, errorMsg: '' });

    try {
      const { data } = await axios.post("http://localhost:3000/login", formData);
      const { loggedUser } = data;
      const token = loggedUser?.token;
      console.log("this is login data",data)
      console.log("this is loggedUser ",loggedUser)

      if (!token) throw new Error("Token not found");

      localStorage.setItem("token", token);
      localStorage.setItem("userId", loggedUser._id);

      dispatch(setUser({ loggedUser, token }));

      switch (loggedUser.role) {
        case "admin":
          navigate("/main/dashboard", { replace: true });
          break;
        case "user":
          navigate("/user/*", { replace: true });
          break;
        default:
          navigate("/engineer/profile", { replace: true });
      }

    } catch (err) {
      console.log("Login error:", err);
      setAuthStatus({
        loading: false,
        errorMsg: "Login failed. Please check your credentials.",
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
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={authStatus.loading}
              sx={{ mt: 2 }}
            >
              {authStatus.loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Box>

          <Box mt={2}>
            <Typography>
              Don't have an account?
              <Button variant="text" onClick={() => navigate('/signup')}>
                Sign Up now
              </Button>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginForm;
