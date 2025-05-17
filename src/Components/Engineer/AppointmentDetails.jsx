import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Edit as EditIcon } from '@mui/icons-material';
import Loader from '../Auth/Loader'


const REACT_BASE_URL = "http://localhost:3000" 

const AppointmentDetails = () => {
  const { id } = useParams(); // Get appointment ID from route
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const engineerId = localStorage.getItem('userId');

      if (!token || !engineerId) {
        toast.error('Session expired. Please log in again.');
        localStorage.clear();
        navigate('/login');
        return;
      }

      console.log('Fetching appointment with ID:', id);
      console.log('Using token:', token);
      console.log('Engineer ID:', engineerId);

      const response = await axios.get(`${REACT_BASE_URL}/engineer/appointment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('API response:', response.data);

      if (!response.data.success || !response.data.appointment) {
        throw new Error('No appointment data returned');
      }

      const fetchedAppointment = response.data.appointment;
      setAppointment(fetchedAppointment);
      setStatus(fetchedAppointment.appointmentStatus || 'Pending');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointment:', err.response?.data || err.message);
      setError(`Failed to fetch appointment details: ${err.response?.data?.message || err.message}`);
      toast.error('Failed to fetch appointment details. Please try again later.');
      setLoading(false);
    }
  };

  const openUpdate = () => {
    setOpenDialog(true);
  };

  const closeUpdate = () => {
    setOpenDialog(false);
    setStatus(appointment?.appointmentStatus || 'Pending');
  };

  const handleStatusChange = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');

      console.log('Updating status for appointment ID:', id, 'to:', status);

      await axios.put(
        `${REACT_BASE_URL}/updateappointment`,
        {
          _id: id,
          appointmentStatus: status,
          userId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAppointment(prev => ({ ...prev, appointmentStatus: status }));
      toast.success('Appointment status updated successfully!');
      closeUpdate();
    } catch (err) {
      console.error('Error updating status:', err.response?.data || err.message);
      setError('Failed to update appointment status');
      toast.error('Failed to update appointment status. Please try again later.');
    }
  };

  if (loading) {
    return (
      <><Loader /></>
    );
  }

  if (!appointment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Appointment Not Found
        </Typography>
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error || 'The requested appointment could not be found.'}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/engineer/appointments')}>
          Back to Appointments
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Toaster position="top-right" />
      <Typography variant="h4" gutterBottom>
        Appointment Details
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Appointment ID: {appointment._id}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography><strong>Customer Name:</strong> {appointment.userId?.name || 'N/A'}</Typography>
          <Typography><strong>Email:</strong> {appointment.userId?.email || 'N/A'}</Typography>
          <Typography><strong>Contact:</strong> {appointment.userId?.mobile || 'N/A'}</Typography>
          <Typography><strong>Address:</strong> {appointment.userId?.address || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography><strong>Service Type:</strong> {appointment.serviceType || appointment.serviceId?.serviceName || 'N/A'}</Typography>
          <Typography><strong>Device Brand:</strong> {appointment.deviceBrand || 'N/A'}</Typography>
          <Typography><strong>Problem Description:</strong> {appointment.problemDescription || 'N/A'}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography><strong>Date:</strong> {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</Typography>
          <Typography><strong>Status:</strong> {appointment.appointmentStatus}</Typography>
          <Typography><strong>Assigned Engineer:</strong> {appointment.assignedEngineer?.name || 'N/A'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={openUpdate}
          >
            Update Status
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/engineer/appointments')}
          >
            Back to Appointments
          </Button>
        </Box>
      </Paper>

      {/* Update Status Dialog */}
      <Dialog open={openDialog} onClose={closeUpdate}>
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>

            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdate}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentDetails;