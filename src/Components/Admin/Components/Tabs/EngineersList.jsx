import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Button,
  Grid,
} from '@mui/material';

const EngineersList = () => {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    role: 'engineer',
  });
  const [error, setError] = useState(null);
  const [formMsg, setFormMsg] = useState('');

  const fetchEngineers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getengineers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setEngineers(response.data.engineers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch engineers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEngineer = async (e) => {
    e.preventDefault();
    setFormMsg('');
    try {
      await axios.post('http://localhost:3000/register', formData);
      setFormMsg('Engineer added successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        mobile: '',
        address: '',
        role: 'engineer',
      });
      fetchEngineers(); // refresh list
    } catch (err) {
      setFormMsg(err.response?.data?.message || 'Failed to add engineer');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Add Engineer
        </Typography>
        <form onSubmit={handleAddEngineer}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Add Engineer
              </Button>
            </Grid>
            {formMsg && (
              <Grid item xs={12}>
                <Alert severity={formMsg.includes('successfully') ? 'success' : 'error'}>
                  {formMsg}
                </Alert>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>

      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">
          Engineers Directory
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Mobile</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {engineers.map((engineer) => (
                <TableRow
                  key={engineer._id}
                  sx={{
                    '&:hover': { backgroundColor: 'gray' },
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <TableCell>{engineer.name}</TableCell>
                  <TableCell>{engineer.email}</TableCell>
                  <TableCell>{engineer.mobile}</TableCell>
                  <TableCell>
                    <Chip
                      label={engineer.isBlock ? 'Blocked' : 'Available'}
                      color={engineer.isBlock ? 'error' : 'success'}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EngineersList;
