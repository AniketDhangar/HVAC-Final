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
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';

const EngineersList = () => {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openTasksDialog, setOpenTasksDialog] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const [selectedEngineerId, setSelectedEngineerId] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
   
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Fetching engineers with token:', token ? 'Present' : 'Missing');
      const response = await axios.get('http://localhost:3000/getengineers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Engineers Response:', response.data);
      const fetchedEngineers = Array.isArray(response.data.engineers) ? response.data.engineers : [];
      setEngineers(fetchedEngineers);
      setLoading(false);
    } catch (err) {
      console.error('Fetch engineers error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to fetch engineers');
      setEngineers([]);
      setLoading(false);
    }
  };

  const fetchAllEngineerTasks = async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Fetching all engineer tasks with token:', token ? 'Present' : 'Missing');
      const response = await axios.get('http://localhost:3000/getEngineerTasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Tasks Response:', response.data);
      setTasks(Array.isArray(response.data.tasks) ? response.data.tasks : []);
      setTasksLoading(false);
    } catch (err) {
      console.log('Fetch tasks error:', err.response?.data);
      const errorMessage =
        err.response?.status === 403
          ? 'Admin access required to view tasks'
          : err.response?.data?.message || 'Failed to fetch tasks';
      setTasksError(errorMessage);
      setTasks([]);
      setTasksLoading(false);
    }
  };

  const handleViewTasks = () => {
    setOpenTasksDialog(true);
    fetchAllEngineerTasks();
  };

  const handleSort = (field) => {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  };

  const filteredAndSortedEngineers = engineers
    .filter((eng) =>
      [eng.name, eng.email, eng.mobile, eng.phone, eng.specialization].some((val) =>
        val?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      let valA = a[orderBy]?.toString().toLowerCase() || '';
      let valB = b[orderBy]?.toString().toLowerCase() || '';
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

  const handleAddEngineer = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password || !formData.mobile) {
        toast.error('Please fill in all required fields');
        return;
      }
      const token = localStorage.getItem('accessToken');
      await axios.post(
        'http://localhost:3000/register',
        {
          ...formData,
          role: 'engineer',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Engineer added successfully');
      fetchEngineers();
      setOpenForm(false);
      setFormData({ name: '', email: '', password: '', mobile: '', phone: '', specialization: '' });
    } catch (err) {
      console.log('Add engineer error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Error adding engineer');
    }
  };

  const filteredTasks = selectedEngineerId === 'all'
    ? tasks
    : tasks.filter((t) => t.engineer._id === selectedEngineerId);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width:"100%", mx: 'auto', p: 2 }}>
      <Toaster position="top-right" />
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight={700}>
            Engineers Directory
          </Typography>
          <Box>
            <Button variant="contained" onClick={() => setOpenForm(true)} sx={{ mr: 1 }}>
              Add Engineer
            </Button>
            <Button variant="contained" onClick={handleViewTasks}>
              View All Tasks
            </Button>
          </Box>
        </Box>

        <TextField
          label="Search Engineers"
          variant="outlined"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Divider sx={{ mb: 3 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['name', 'email', 'mobile'].map((col) => (
                  <TableCell
                    key={col}
                    onClick={() => handleSort(col)}
                    sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    {orderBy === col ? (order === 'asc' ? ' 🔼' : ' 🔽') : ''}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedEngineers.length > 0 ? (
                filteredAndSortedEngineers.map((engineer) => (
                  <TableRow
                    key={engineer._id}
                    sx={{ '&:hover': { backgroundColor: 'grey' }, transition: '0.3s' }}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="textSecondary">No engineers found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Engineer Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Engineer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {['name', 'email', 'password', 'mobile'].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  fullWidth
                  type={field === 'password' ? 'password' : 'text'}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  required={['name', 'email', 'password', 'mobile'].includes(field)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddEngineer}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tasks Dialog */}
      <Dialog open={openTasksDialog} onClose={() => setOpenTasksDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>All Engineer Tasks</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel>Filter by Engineer</InputLabel>
            <Select 
              value={selectedEngineerId}
              onChange={(e) => setSelectedEngineerId(e.target.value)}
              label="Filter by Engineer"
            >
              <MenuItem value="all">All Engineers</MenuItem>
              {engineers.map((engineer) => (
                <MenuItem key={engineer._id} value={engineer._id}>
                  {engineer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {tasksLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress size={40} />
            </Box>
          ) : tasksError ? (
            <Box>
              <Alert severity="error">{tasksError}</Alert>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="outlined" onClick={fetchEngineers}>
                  Refresh Engineers List
                </Button>
              </Box>
            </Box>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((engineerTasks) => (
              <Box key={engineerTasks.engineer._id} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {engineerTasks.engineer.name}
                </Typography>
                {engineerTasks.tasks.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {engineerTasks.tasks.map((task) => (
                          <TableRow key={task._id}>
                            <TableCell>{task.serviceId?.serviceName || 'N/A'}</TableCell>
                            <TableCell>{task.userId?.name || 'N/A'}</TableCell>
                            <TableCell>
                              <Chip
                                label={task.appointmentStatus}
                                color={
                                  task.appointmentStatus === 'Completed' ? 'success' :
                                  task.appointmentStatus === 'Assigned' ? 'warning' :
                                  task.appointmentStatus === 'Pending' ? 'info' : 'error'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(task.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="textSecondary">
                    No tasks assigned to {engineerTasks.engineer.name}
                  </Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography color="textSecondary" align="center">
              No tasks assigned to any engineer
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTasksDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EngineersList;