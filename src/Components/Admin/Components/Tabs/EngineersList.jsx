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
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Toaster, toast } from 'react-hot-toast';
import { EditNotificationsOutlined } from '@mui/icons-material';
import EditSharpIcon from '@mui/icons-material/EditSharp';


const REACT_BASE_URL = "http://localhost:3000" 


const EngineersList = () => {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openTasksDialog, setOpenTasksDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [updatedPassword, setUpdatedPassword] = useState(0)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [engineerToDelete, setEngineerToDelete] = useState(null);
  const [engineerToView, setEngineerToView] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const [selectedEngineerId, setSelectedEngineerId] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [engineerForPasswordUpdate, setEngineerForPasswordUpdate] = useState(null);

  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Fetching engineers with token:', token ? 'Present' : 'Missing');
      const response = await axios.get(`${REACT_BASE_URL}/getengineers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Engineers Response:', response.data);
      const fetchedEngineers = Array.isArray(response.data.engineers) ? response.data.engineers : [];
      setEngineers(fetchedEngineers);
      setLoading(false);
      toast.success("All Engineers are fetched")
    } catch (err) {
      console.error('Fetch engineers error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to fetch engineers');
      setEngineers([]);
      setLoading(false);
      toast.error("All Engineers are fetched")
    }
  };

  const fetchAllEngineerTasks = async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Fetching all engineer tasks with token:', token ? 'Present' : 'Missing');
      const response = await axios.get(`${REACT_BASE_URL}/getEngineerTasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Tasks Response:', response.data);
      setTasks(Array.isArray(response.data.tasks) ? response.data.tasks : []);
      setTasksLoading(false);
      toast.success("All Engineers are fetched")
    } catch (err) {
      console.log('Fetch tasks error:', err.response?.data);
      const errorMessage =
        err.response?.status === 403
          ? 'Admin access required to view tasks'
          : err.response?.data?.message || 'Failed to fetch tasks';
      setTasksError(errorMessage);
      setTasks([]);
      setTasksLoading(false);
      toast.error("Can't fetched Engineers")
    }
  };

  const handleViewTasks = () => {
    setOpenTasksDialog(true);
    fetchAllEngineerTasks();
  };

  const handleDeleteEngineer = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token missing. Please log in again.');
        setOpenDeleteDialog(false);
        setEngineerToDelete(null);
        return;
      }

      console.log('Deleting engineer with ID:', engineerToDelete._id);
      const response = await axios.delete(`${REACT_BASE_URL}/deleteuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          _id: engineerToDelete._id,
        },
      });

      toast.success(response.data.message || 'Engineer deleted successfully');
      fetchEngineers();
      setOpenDeleteDialog(false);
      setEngineerToDelete(null);
    } catch (err) {
      console.log('Delete engineer error:', err, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      let errorMessage = 'Error deleting engineer';
      if (err.response?.status === 404) {
        errorMessage = 'Engineer not found';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid request: Email or ID required';
      } else if (err.response?.status === 401) {
        errorMessage = 'Unauthorized: Invalid or expired token';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage);
      setOpenDeleteDialog(false);
      setEngineerToDelete(null);
    }
  };

  const handleOpenDeleteDialog = (engineer) => {
    console.log('Selected engineer for deletion:', engineer);
    setEngineerToDelete(engineer);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEngineerToDelete(null);
  };

  const handleOpenDetailsDialog = (engineer) => {
    console.log('Selected engineer for viewing details:', engineer);
    setEngineerToView(engineer);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setEngineerToView(null);
  };

  const handleSort = (field) => {
    if (orderBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  };

  const handleAddEngineer = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password || !formData.mobile || !formData.address) {
        toast.error('Please fill in all required fields');
        return;
      }
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${REACT_BASE_URL}/register`,
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

      fetchEngineers();
      setOpenForm(false);
      setFormData({ name: '', email: '', password: '', mobile: '', address: '' });
      toast.success('Engineer added successfully');
    } catch (err) {
      console.log('Add engineer error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Error adding engineer');
    }
  };

  const handleOpenUpdate = () => {
    setOpenUpdate(true)
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  };


  const updatePasswordReq = async () => {

    const loggedInUserId = (localStorage.getItem("userId"))
    if (!selectedEngineerId || !selectedEngineerId._id) {
      toast.error("No engineer selected");
      return;
    }

    try {
      const reqBody = {
        _id: selectedEngineerId._id,
        newPassword: updatedPassword,
        userId: loggedInUserId, // <-- Add this!
      };

      const response = await axios.put(`${REACT_BASE_URL}/users`, reqBody);
      toast.success("Password updated");
      handleCloseUpdate();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };


  const filteredAndSortedEngineers = engineers
    .filter((eng) =>
      [eng.name, eng.email, eng.mobile, eng.address].some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      let valA = a[orderBy]?.toString().toLowerCase() || '';
      let valB = b[orderBy]?.toString().toLowerCase() || '';
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

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
    <Box sx={{ width: '100%', mx: 'auto', p: 2 }}>
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

                {['sr.no','name', 'email', 'mobile'].map((col, index) => (
                  
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
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedEngineers.length > 0 ? (
                filteredAndSortedEngineers.map((engineer,index) => (

                  <TableRow
                    key={engineer._id}
                    sx={{ '&:hover': { backgroundColor: 'gray' }, transition: '0.3s' }}
                  >                    
                  <TableCell>{index +1}</TableCell>

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
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDetailsDialog(engineer)}
                        title="View Engineer Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(engineer)}
                        title="Delete Engineer"
                      >
                        <DeleteIcon />
                      </IconButton>

                      <IconButton
                        color="success"
                        onClick={() => {
                          setSelectedEngineerId(engineer)
                          handleOpenUpdate(engineer)

                        }}
                        title="Update Engineer"
                      >
                        <EditSharpIcon />
                      </IconButton>
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
            {['name', 'email', 'password', 'mobile', 'address'].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  fullWidth
                  type={field === 'password' ? 'password' : 'text'}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  required={['name', 'email', 'password', 'mobile', 'address'].includes(field)}
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

      {/* Delete Engineer Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{engineerToDelete?.name} ({engineerToDelete?.email})</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteEngineer}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdate}
        onChange={(e) => setUpdatedPassword(e.target.value)}
        onClose={handleCloseUpdate} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogTitle>Want to update Password?</DialogTitle>
          <TextField fullWidth type='text' variant='outlined' label="Enter your new Password ..." />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate}>Cancel</Button>
          <Button variant="contained" color="success" onClick={updatePasswordReq}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Engineer Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Engineer Details</DialogTitle>
        <DialogContent>
          {engineerToView ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">ID:</Typography>
                <Typography>{engineerToView._id}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Name:</Typography>
                <Typography>{engineerToView.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Email:</Typography>
                <Typography>{engineerToView.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Mobile:</Typography>
                <Typography>{engineerToView.mobile}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Address:</Typography>
                <Typography>{engineerToView.address || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">Status:</Typography>
                <Chip
                  label={engineerToView.isBlock ? 'Blocked' : 'Available'}
                  color={engineerToView.isBlock ? 'error' : 'success'}
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Grid>
              {/* Add more fields dynamically if available */}
              {Object.keys(engineerToView).map((key) => {
                if (!['_id', 'name', 'email', 'mobile', 'address', 'isBlock', '__v'].includes(key)) {
                  return (
                    <Grid item xs={12} key={key}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                      </Typography>
                      <Typography>{String(engineerToView[key])}</Typography>
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>
          ) : (
            <Typography>No engineer selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Close</Button>
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