import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, MenuItem,
  InputAdornment, FormControl, InputLabel, Select,
  CircularProgress
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Assignment as AssignmentIcon,
  Edit
} from "@mui/icons-material";

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("userName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [engineers, setEngineers] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [engineersLoading, setEngineersLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  if (!token) {
    toast.error("No token found. Please log in.");
    return null;
  }

  // Fetch appointments and engineers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const { data } = await axios.get(
          "http://localhost:3000/getappoinments",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const list = data.appointments || [];
        setAppointments(list);
        setFiltered(list);

        // Fetch engineers
        const engineersResponse = await axios.get(
          "http://localhost:3000/getengineers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Engineers API response:", engineersResponse.data); // Debugging log

        // Filter active engineers
        const activeEngineers = engineersResponse.data.engineers.filter(engineer => !engineer.isBlock);
        console.log("Active engineers:", activeEngineers); // Debugging log

        setEngineers(activeEngineers);
        setEngineersLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error); // Fixed syntax issue
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        } else {
          toast.error("Failed to fetch data");
        }
        setEngineersLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Search, filter, sort logic
  useEffect(() => {
    let list = [...appointments];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(app =>
        app.userId?.name.toLowerCase().includes(term) ||
        app.userId?.email.toLowerCase().includes(term) ||
        String(app.userId?.mobile).includes(term) ||
        (app.deviceBrand || "").toLowerCase().includes(term) ||
        (app.serviceType || "").toLowerCase().includes(term) ||
        app.userId?.address.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter(app => app.appointmentStatus === statusFilter);
    }

    const getField = (app, field) => {
      if (field === "name") return app.userId?.name?.toLowerCase() || "";
      if (field === "appointmentStatus") return (app.appointmentStatus || "").toLowerCase();
      return "";
    };

    list.sort((a, b) => {
      const aVal = getField(a, sortField);
      const bVal = getField(b, sortField);
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    setFiltered(list);
  }, [appointments, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = field => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openUpdate = app => {
    setSelected(app);
    setStatus(app.appointmentStatus || "Pending");
    setOpenDialog(true);
  };
  const closeUpdate = () => {
    setOpenDialog(false);
    setSelected(null);
    setStatus("");
  };

  const openDelete = app => {
    setSelected(app);
    setDeleteDialog(true);
  };
  const closeDelete = () => {
    setDeleteDialog(false);
    setSelected(null);
  };

  const handleUpdateStatus = async () => {
    try {
      // Example, replace with actual method to get user ID
      console.log("Updating status for appointment:", selected._id,
        "New status:", status);

      const response = await axios.put(
        "http://localhost:3000/updateappointment",
        {
          _id: selected._id,
          appointmentStatus: status,
          userId: userId   // Pass the user ID here
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(prev =>
        prev.map(app =>
          app._id === selected._id ? { ...app, appointmentStatus: status } : app
        )
      );
      toast.success("Status updated");
      closeUpdate();
    } catch (err) {
      console.log("Error updating status:", err);
      toast.error("Could not update status");
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selected) return;

    // Adjust the key if it's different

    try {
      await axios.delete(`http://localhost:3000/deleteappointment`, {
        data: { _id: selected._id },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Appointment deleted!");
      window.location.reload();
      closeDelete();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete appointment");
    }
  };

  const handleAssignClick = (appointment) => {
    setSelectedAppointment(appointment);
    setAssignDialogOpen(true);
  };

  // Update handleAssignSubmit to use the assignWorkToEngineer API
  const handleAssignSubmit = async () => {
    if (!selectedEngineer) {
      toast.error('Please select an engineer');
      return;
    }

    console.log("Assigning task:", {
      appointmentId: selectedAppointment?._id,
      userId: selectedEngineer // Updated key to match backend expectation
    }); // Debugging log

    try {
      // Call the assignWorkToEngineer API
      const response = await axios.post(
        'http://localhost:3000/assign',
        {
          appointmentId: selectedAppointment?._id,
          userId: selectedEngineer // Updated key to match backend expectation
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Task assigned successfully:", response.data);
      toast.success("Task assigned successfully!");
      setAssignDialogOpen(false);
    } catch (error) {
      console.error('Error assigning task:', error);
      toast.error('Failed to assign task');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Toaster position="top-right" />
      <Typography variant="h5" gutterBottom>
        Appointment Requests
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={e => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
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
            <TableRow>
              <TableCell>Sr. No</TableCell>
              <TableCell onClick={() => handleSort("name")} sx={{ cursor: "pointer" }}>
                Customer <SortIcon fontSize="small" />
              </TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Service</TableCell>
              <TableCell onClick={() => handleSort("appointmentStatus")} sx={{ cursor: "pointer" }}>
                Status <SortIcon fontSize="small" />
              </TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((app, i) => (
                <TableRow key={app._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{app.userId?.name || "N/A"}</TableCell>
                  <TableCell>{app.userId?.mobile}</TableCell>
                  <TableCell>{app.userId?.email}</TableCell>
                  <TableCell>{app.deviceBrand}</TableCell>
                  <TableCell>{app.serviceType}</TableCell>
                  <TableCell>{app.appointmentStatus}</TableCell>
                  <TableCell>{app.userId?.address}</TableCell>
                  <TableCell>{app.problemDescription}</TableCell>
                  <TableCell>
                    <IconButton title="Update Status"  color="primary"  onClick={() => openUpdate(app)}>
                      <Edit />
                    </IconButton>
                    <IconButton title="Delete"  color="error"  onClick={() => openDelete(app)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleAssignClick(app)} color="primary">
                      <AssignmentIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Dialog */}
      <Dialog open={openDialog} onClose={closeUpdate} fullWidth maxWidth="sm">
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={e => setStatus(e.target.value)}
            >
              {["Pending", "Approved", "Completed", "Cancelled"].map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdate} color="error">Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={closeDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this appointment?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteAppointment}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      {/* Assign Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Assign Task</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Appointment Details</Typography>
              <Typography><strong>Customer Name:</strong> {selectedAppointment.userId?.name}</Typography>
              <Typography><strong>Contact:</strong> {selectedAppointment.userId?.mobile}</Typography>
              <Typography><strong>Email:</strong> {selectedAppointment.userId?.email}</Typography>
              <Typography><strong>Service Type:</strong> {selectedAppointment.serviceType}</Typography>
              <Typography><strong>Device Brand:</strong> {selectedAppointment.deviceBrand}</Typography>
              <Typography><strong>Problem Description:</strong> {selectedAppointment.problemDescription}</Typography>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Select Engineer</InputLabel>
                <Select
                  value={selectedEngineer}
                  onChange={(e) => setSelectedEngineer(e.target.value)}
                  label="Select Engineer"
                  disabled={engineersLoading}
                >
                  {engineersLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : engineers.length > 0 ? (
                    engineers.map((engineer) => (
                      <MenuItem key={engineer._id} value={engineer._id}>
                        {engineer.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No engineers available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAssignSubmit}
            variant="contained"
            color="primary"
            disabled={!selectedEngineer}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentTable;