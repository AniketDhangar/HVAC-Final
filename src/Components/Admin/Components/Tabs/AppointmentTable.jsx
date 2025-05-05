import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, MenuItem,
  InputAdornment, FormControl, InputLabel, Select,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Sort as SortIcon,
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

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("No token found. Please log in.");
    return null;
  }

  // Fetch appointments once on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/getappoinments",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const list = data.appointments || [];
        setAppointments(list);
        setFiltered(list);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          toast.error("Failed to fetch appointments");
        }
      }
    };
    fetchAppointments();
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
      if (field === "userName") return app.userId?.name?.toLowerCase() || "";
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

  // const handleUpdateStatus = async () => {
  //   try {
  //     await axios.put(
  //       "http://localhost:3000/updateappointment",
  //       { _id: selected._id, appointmentStatus: status },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setAppointments(prev =>
  //       prev.map(app =>
  //         app._id === selected._id ? { ...app, appointmentStatus: status } : app
  //       )
  //     );
  //     toast.success("Status updated");
  //     closeUpdate();
  //   } catch {
  //     toast.error("Could not update status");
  //   }
  // };
  const handleUpdateStatus = async () => {
    try {
      const userId = localStorage.getItem("userId");  // Example, replace with actual method to get user ID
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
      console.error("Error updating status:", err);
      toast.error("Could not update status");
    }
  };

  // const handleDeleteAppointment = async () => {
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     const token = localStorage.getItem("token"); 
  //     const appointmentId = localStorage.getItem("appointmentId")
  //     console.log("appointmentId is",appointmentId)
  //     console.log("Deleting appointment with ID:", selected._id);
  //     const response = await axios.put(
  //       "http://localhost:3000/deleteappointment",
  //       {
  //         _id: selected._id,

  //         userId: userId
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setAppointments(prev => prev.filter(app => app._id !== selected._id));
  //     toast.success("Appointment deleted");
  //     closeDelete();
  //   } catch (error) {
  //     console.log("Error deleting appointment:", error);
  //     toast.error("Could not delete appointment");
  //   }
  // };

  // const handleDeleteAppointment = async () => {
  //   try {
  //     const token = localStorage.getItem("token"); 
  //     const appointmentId = selected._id;

  //     console.log("Deleting appointment with ID:", appointmentId);

  //     const response = await axios.delete(
  //       "http://localhost:3000/deleteappointment",
  //       { _id: appointmentId },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setAppointments(prev => prev.filter(app => app._id !== appointmentId));
  //     toast.success("Appointment deleted");
  //     closeDelete();
  //   } catch (error) {
  //     console.log("Error deleting appointment:", error);
  //     toast.error("Could not delete appointment");
  //   }
  // };

  const handleDeleteAppointment = async () => {
    if (!selected) return;
  
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Adjust the key if it's different
  
    try {
      await axios.delete(`http://localhost:3000/deleteappointment`, {
        params: {
          _id: selected._id,
          userId: userId,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Appointment deleted!");
      // setSelected(prev => prev.filter(app => app._id !== selected._id));
      closeDelete();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete appointment");
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
              <TableCell onClick={() => handleSort("userName")} sx={{ cursor: "pointer" }}>
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
                    <IconButton onClick={() => openUpdate(app)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => openDelete(app)}>
                      <DeleteIcon />
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
      <Dialog open={deleteDialog} onClose={closeDelete} fullWidth maxWidth="xs">
        <DialogTitle>Delete Appointment?</DialogTitle>
        <DialogActions>
          <Button onClick={closeDelete} color="error">No</Button>
          <Button onClick={handleDeleteAppointment} variant="contained" color="error">Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentTable;
