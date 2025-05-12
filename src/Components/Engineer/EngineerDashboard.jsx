import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Edit as EditIcon } from '@mui/icons-material';

const EngineerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    Approved: 0
  });
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (location.pathname.includes('/appointments')) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [location]);

  const openUpdate = (app) => {
    setSelected(app);
    setStatus(app.appointmentStatus || 'Pending');
    setOpenDialog(true);
  };

  const closeUpdate = () => {
    setOpenDialog(false);
    setSelected(null);
    setStatus('');
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const engineerId = localStorage.getItem('userId');

      if (!token || !engineerId) {
        toast.error('Session expired. Please log in again.');
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(`http://localhost:3000/engineer/appointments/${engineerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Fetched appointments:', response.data.appointments);
      setAppointments(response.data.appointments || []);
      calculateStats(response.data.appointments || []);
    } catch (err) {
      console.log('Error fetching appointments:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error('Unauthorized. Please log in again.');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        setError('Failed to fetch appointments');
        toast.error('Failed to fetch appointments. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointments) => {
    const stats = {
      total: appointments.length,
      pending: appointments.filter(a => a.appointmentStatus === 'Pending').length,
      completed: appointments.filter(a => a.appointmentStatus === 'Completed').length,
      Approved: appointments.filter(a => a.appointmentStatus === 'Approved').length
    };
    setStats(stats);
  };

  const handleStatusChange = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');

      await axios.put(
        `http://localhost:3000/updateappointment`,
        {
          _id: selected._id,
          appointmentStatus: status,
          userId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local state for immediate feedback before reload
      setAppointments(prev =>
        prev.map(app =>
          app._id === selected._id ? { ...app, appointmentStatus: status } : app
        )
      );

      toast.success('Appointment status updated successfully!');
      closeUpdate();

      // Trigger full page reload to refresh data
      window.location.reload();
    } catch (err) {
      console.error('Error updating status:', err.response?.data || err.message);
      setError('Failed to update appointment status');
      toast.error('Failed to update appointment status. Please try again later.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (newValue === 0) {
      navigate('/engineer/dashboard');
    } else {
      navigate('/engineer/appointments');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Engineer Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="All Appointments" />
      </Tabs>

      {currentTab === 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Appointments</Typography>
                <Typography variant="h4">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Pending</Typography>
                <Typography variant="h4">{stats.pending}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Approved</Typography>
                <Typography variant="h4">{stats.Approved}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Completed</Typography>
                <Typography variant="h4">{stats.completed}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Appointment ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Device Brand</TableCell>
              <TableCell>Problem Description</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment._id}</TableCell>
                  <TableCell>{appointment.userId?.name || 'N/A'}</TableCell>
                  <TableCell>{appointment.serviceId?.serviceName || appointment.serviceType || 'N/A'}</TableCell>
                  <TableCell>{appointment.deviceBrand || 'N/A'}</TableCell>
                  <TableCell>{appointment.problemDescription || 'N/A'}</TableCell>
                  <TableCell>{appointment.userId?.address || 'N/A'}</TableCell>
                  <TableCell>{appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => openUpdate(appointment)}>
                      <EditIcon />
                    </IconButton>
                    {appointment.appointmentStatus}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/engineer/appointments/${appointment._id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
              <MenuItem value="In Progress">In Progress</MenuItem>
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

export default EngineerDashboard;