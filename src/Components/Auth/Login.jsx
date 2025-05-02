import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Alert, Paper, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Routes/AuthContext';

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });  // Corrected
    const [authStatus, setAuthStatus] = useState({ loading: false, errorMsg: '' });

    const { login, loggedUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedUser) {
            if (loggedUser.role === 'admin') {
                navigate('/main/dashboard');
            } else if (loggedUser.role === 'user') {
                navigate('/profile');
            }
        }
    }, [loggedUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setAuthStatus({ loading: true, errorMsg: '' });  // Reset error message before submitting

        try {
            const res = await axios.post("http://localhost:3000/login", formData);
            const { loggedUser, token } = res.data;
            console.log("Login response:", res.data);

            login(loggedUser, token);  // Set user in context

            if (loggedUser.role === 'admin') {
                navigate('/main/dashboard');
            } else {
                navigate('/profile');
            }
        } catch (error) {
            console.log(error);
            setAuthStatus({ loading: false, errorMsg: 'Login failed. Please check your credentials.' });
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
                <Typography variant="h4" color="primary" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
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
                    <Box sx={{ mt: 2 }}>
                        <Typography>What you don't have an account ?...
                            <Button variant="text" onClick={() => { navigate('/signup') }} > Sign Up now</Button>
                        </Typography>
                    </Box>


                </form>

            </Paper>
        </Container>
    );
};

export default LoginForm;
