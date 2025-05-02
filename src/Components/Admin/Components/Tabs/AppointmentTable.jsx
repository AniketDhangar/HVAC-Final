import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  TextField,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Sort as SortIcon } from "@mui/icons-material";

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("userName");
  const [sortDirection, setSortDirection] = useState("asc");

  // Fetch Appointments
  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/getappoinment", {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
            
  //         },
  //       });
  //       setAppointments(response.data.appointments || []);
  //       setFilteredAppointments(response.data.appointments || []);
  //     } catch (error) {
  //       toast.error("Failed to fetch appointments");
  //       setAppointments([]);
  //       setFilteredAppointments([]);
  //     }
  //   };

  //   fetchAppointments();
  //   const intervalId = setInterval(fetchAppointments, 5000);

  //   return () => clearInterval(intervalId);
  // }, []);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No token found. Please log in.");
          return;
        }
  
        const response = await axios.get("http://localhost:3000/getappoinments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        setAppointments(response.data.appointments || []);
        setFilteredAppointments(response.data.appointments || []);
        toast.success("Appointments fetched successfully!");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          toast.error("Failed to fetch appointments");
        }
        setAppointments([]);
        setFilteredAppointments([]);
      }
    };
  
    fetchAppointments();
  }, []); 
  
  // Handle Search
  useEffect(() => {
    let filtered = [...appointments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userMobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.deviceBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.appointmentStatus === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase() || "";
      const bValue = b[sortField]?.toLowerCase() || "";
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Open Update Dialog
  const handleOpenDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setStatus(appointment?.appointmentStatus || "Pending");
    setOpenDialog(true);
  };

  // Close Update Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setStatus("");
  };

  // Open Delete Confirmation Dialog
  const handleOpenDeleteDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setDeleteDialog(true);
  };

  // Close Delete Dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
    setSelectedAppointment(null);
  };

  // Update Appointment Status
  const handleUpdateStatus = async () => {
    if (!selectedAppointment) return;
    try {
      await axios.put(`http://localhost:3000/updateappointment`, {
        _id: selectedAppointment._id,
        appointmentStatus: status,
      });
      toast.success("Appointment status updated!");
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === selectedAppointment._id ? { ...app, appointmentStatus: status } : app
        )
      );
      handleCloseDialog();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Delete Appointment
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    try {
      await axios.delete(`http://localhost:3000/deleteappointment?_id=${selectedAppointment._id}`);
      toast.success("Appointment deleted!");
      setAppointments(prev => prev.filter(app => app._id !== selectedAppointment._id));
      handleCloseDeleteDialog();
    } catch (error) {
      toast.error("Failed to delete appointment");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Toaster position="top-right" />
      <Typography variant="h5" gutterBottom>
        Appointment Requests
      </Typography>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "inherit" }}>
              <TableCell><b>Sr. No</b></TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("userName")}>
                  <b>Customer Name</b>
                  <SortIcon sx={{ ml: 1 }} />
                </Box>
              </TableCell>
              <TableCell><b>Contact</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Device Brand</b></TableCell>
              <TableCell><b>Service Type</b></TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("appointmentStatus")}>
                  <b>Status</b>
                  <SortIcon sx={{ ml: 1 }} />
                </Box>
              </TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>Message</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment, index) => (
                <TableRow key={appointment._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{appointment.userName || "N/A"}</TableCell>
                  <TableCell>{appointment.userMobile || "N/A"}</TableCell>
                  <TableCell>{appointment.userEmail || "N/A"}</TableCell>
                  <TableCell>{appointment.deviceBrand || "N/A"}</TableCell>
                  <TableCell>{appointment.serviceType || "N/A"}</TableCell>
                  <TableCell>{appointment.appointmentStatus || "Pending"}</TableCell>
                  <TableCell>{appointment.userAddress || "N/A"}</TableCell>
                  <TableCell>{appointment.problemDescription || "N/A"}</TableCell>
                  <TableCell sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }} align="center">
                    <IconButton color="primary" onClick={() => handleOpenDialog(appointment)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleOpenDeleteDialog(appointment)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Status Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <TextField select fullWidth required margin="normal" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
          <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={handleCloseDialog}  sx={{ width:100 }}   color="error" variant="contained">Cancel</Button>
          <Button onClick={handleUpdateStatus}  sx={{ width:100 }}  variant="contained" color="info">
            Update
          </Button>
        </DialogActions>
        </DialogContent>
       
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Appointment?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this appointment?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="error">Cancel</Button>
          <Button onClick={handleDeleteAppointment} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentTable;
