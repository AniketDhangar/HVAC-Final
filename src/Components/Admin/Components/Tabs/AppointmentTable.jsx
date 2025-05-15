import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, MenuItem,
  InputAdornment, FormControl, InputLabel, Select, CircularProgress
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import {
  Settings as SettingsIcon,
  Search as SearchIcon,
  Sort as SortIcon
} from "@mui/icons-material";

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("userName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [engineers, setEngineers] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [engineersLoading, setEngineersLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [engineerToView, setEngineerToView] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  if (!token) {
    toast.error("No token found. Please log in.");
    return null;
  }

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const { data } = await axios.get(
        "http://localhost:3000/getappoinments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Appointments data:", data.appointments);
      const list = (data.appointments || []).map(app => ({
        ...app,
        appointmentStatus: app.appointmentStatus === "Assigned" ? "Pending" : app.appointmentStatus
      }));
      setAppointments(list);
      setFiltered(list);
      setAppointmentsLoading(false);
      console.log("data object",data)
    } catch (error) {
      console.error("Error fetching appointments:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      } else {
        toast.error("Failed to fetch appointments");
      }
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAppointments();
        const engineersResponse = await axios.get(
          "http://localhost:3000/getengineers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Engineers API response:", engineersResponse.data);
        const activeEngineers = engineersResponse.data.engineers.filter(engineer => !engineer.isBlock);
        setEngineers(activeEngineers);
        setEngineersLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const handleOpenDetailsDialog = (engineer) => {
    console.log('Selected engineer for viewing details:', engineer);
    setEngineerToView(engineer);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setEngineerToView(null);
  };

  useEffect(() => {
    console.log("Appointments:", appointments);
    console.log("Engineers:", engineers);
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
      if (field === "engineerName") {
        const engineerId = typeof app.assignedEngineer === 'object' ? app.assignedEngineer?._id : app.assignedEngineer;
        return engineerId
          ? (engineers.find(eng => eng._id === engineerId)?.name || "").toLowerCase()
          : "";
      }
      return "";
    };

    list.sort((a, b) => {
      const aVal = getField(a, sortField);
      const bVal = getField(b, sortField);
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    setFiltered(list);
  }, [appointments, searchTerm, statusFilter, sortField, sortDirection, engineers]);

  const handleSort = field => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openActionDialog = app => {
    setSelected(app);
    setStatus(app.appointmentStatus === "Assigned" ? "Pending" : app.appointmentStatus || "Pending");
    setActionDialogOpen(true);
  };

  const closeActionDialog = () => {
    setActionDialogOpen(false);
    setSelected(null);
    setStatus("Pending");
  };

  const handleUpdateStatus = async () => {
    try {
      console.log("Updating status for appointment:", selected._id, "New status:", status);
      const response = await axios.put(
        "http://localhost:3000/updateappointment",
        {
          _id: selected._id,
          appointmentStatus: status,
          userId: userId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(prev =>
        prev.map(app =>
          app._id === selected._id ? { ...app, appointmentStatus: status } : app
        )
      );
      toast.success("Status updated");
      closeActionDialog();
    } catch (err) {
      console.log("Error updating status:", err);
      toast.error("Could not update status");
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selected) return;

    try {
      await axios.delete(`http://localhost:3000/deleteappointment`, {
        data: { _id: selected._id },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAppointments(prev => prev.filter(app => app._id !== selected._id));
      toast.success("Appointment deleted!");
      closeActionDialog();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete appointment");
    }
  };

  const handleAssignClick = () => {
    setSelectedAppointment(selected);
    setSelectedEngineer(typeof selected.assignedEngineer === 'object' ? selected.assignedEngineer?._id : selected.assignedEngineer || '');
    setActionDialogOpen(false);
    setAssignDialogOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedEngineer) {
      toast.error('Please select an engineer');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/assign',
        {
          appointmentId: selectedAppointment?._id,
          userId: selectedEngineer
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Assignment response:", response.data);
      setAppointments(prev =>
        prev.map(app =>
          app._id === selectedAppointment._id
            ? { ...app, assignedEngineer: selectedEngineer, appointmentStatus: "Pending" }
            : app
        )
      );
      toast.success("Task assigned successfully!");
      setAssignDialogOpen(false);
      setSelectedEngineer('');
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

      {appointmentsLoading || engineersLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                  <TableCell onClick={() => handleSort("engineerName")} sx={{ cursor: "pointer" }}>
                    Assigned Engineer <SortIcon fontSize="small" />
                  </TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((app, i) => {
                    const engineer = app.assignedEngineer
                      ? engineers.find(eng => eng._id === (typeof app.assignedEngineer === 'object' ? app.assignedEngineer._id : app.assignedEngineer))
                      : null;
                    return (
                      <TableRow key={app._id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{app.userId?.name || "N/A"}</TableCell>
                        <TableCell>{app.userId?.mobile}</TableCell>
                        <TableCell>{app.userId?.email}</TableCell>
                        <TableCell>{app.deviceBrand}</TableCell>
                        <TableCell>{app.serviceId.serviceType}</TableCell>
                        <TableCell>{app.appointmentStatus}</TableCell>
                        <TableCell>
                          {app.assignedEngineer ? (
                            <Typography
                              component="span"
                              sx={{
                                color: 'primary.main',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                '&:hover': { textDecoration: 'underline' }
                              }}
                              onClick={() => engineer && handleOpenDetailsDialog(engineer)}
                            >
                              {(typeof app.assignedEngineer === 'object'
                                ? app.assignedEngineer?.name
                                : engineers.find(eng => eng._id === app.assignedEngineer)?.name) || "Unassigned"}
                            </Typography>
                          ) : (
                            "Unassigned"
                          )}
                        </TableCell>
                        <TableCell>{app.userId?.address}</TableCell>
                        <TableCell>{app.problemDescription}</TableCell>
                        <TableCell>
                          <IconButton
                            title="Manage Appointment"
                            color="primary"
                            onClick={() => openActionDialog(app)}
                          >
                            <SettingsIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Dialog open={actionDialogOpen} onClose={closeActionDialog} fullWidth maxWidth="sm">
        <DialogTitle>Manage Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>Appointment Details</Typography>
          {selected && (
            <Box sx={{ mb: 2 }}>
              <Typography><strong>Customer Name:</strong> {selected.userId?.name}</Typography>
              <Typography><strong>Contact:</strong> {selected.userId?.mobile}</Typography>
              <Typography><strong>Email:</strong> {selected.userId?.email}</Typography>
              <Typography><strong>Service Type:</strong> {selected.serviceId.serviceType|| "NA"}</Typography>
              <Typography><strong>Device Brand:</strong> {selected.deviceBrand}</Typography>
              <Typography><strong>Problem Description:</strong> {selected.problemDescription}</Typography>
            </Box>
          )}
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
          <Button onClick={closeActionDialog} color="error">Cancel</Button>
          <Button onClick={handleAssignClick} variant="contained" color="primary">
            Assign Engineer
          </Button>
          <Button onClick={handleDeleteAppointment} variant="contained" color="error">
            Delete
          </Button>
          <Button onClick={handleUpdateStatus} variant="contained">Update Status</Button>
        </DialogActions>
      </Dialog>

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
              <Typography><strong>Service Type:</strong> {selectedAppointment.serviceId.serviceType || 'N/A'}</Typography>
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

      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Engineer Details</DialogTitle>
        <DialogContent>
          {engineerToView ? (
            <Box>
              <Typography><strong>Name:</strong> {engineerToView.name}</Typography>
              <Typography><strong>Email:</strong> {engineerToView.email}</Typography>
              <Typography><strong>Mobile:</strong> {engineerToView.mobile || "N/A"}</Typography>
            </Box>
          ) : (
            <Typography>No engineer details available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentTable;