import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box, IconButton, CircularProgress,
  InputAdornment, Select, FormControl, InputLabel, Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";

const REACT_BASE_URL = "https://hvac-final.onrender.com";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceImage, setServiceImage] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [state, setState] = useState({
    searchTerm: "",
    typeFilter: "all",
    sortField: "serviceName",
    sortDirection: "asc",
    formFields: { serviceName: "", serviceDescription: "", serviceType: "" }
  });

  const fetchServices = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const endpoint = token ? `${REACT_BASE_URL}/servicesforadmin` : `${REACT_BASE_URL}/services`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(endpoint, { headers });
      setServices(response.data.allServices);
      toast.success("Services fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch services");
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = useMemo(() => {
    let filtered = [...services];
    if (state.searchTerm) {
      filtered = filtered.filter(service =>
        service.serviceName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        service.serviceDescription?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        service.serviceType?.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }
    if (state.typeFilter !== "all") {
      filtered = filtered.filter(service => service.serviceType === state.typeFilter);
    }
    filtered.sort((a, b) => {
      const aValue = a[state.sortField]?.toLowerCase() || "";
      const bValue = b[state.sortField]?.toLowerCase() || "";
      return state.sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    return filtered;
  }, [services, state.searchTerm, state.typeFilter, state.sortField, state.sortDirection]);

  const handleSort = useCallback((field) => {
    setState(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === "asc" ? "desc" : "asc"
    }));
  }, []);

  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "serviceDescription" && value.length > 150) return;
    setState(prev => ({
      ...prev,
      formFields: { ...prev.formFields, [name]: value }
    }));
  }, []);

  const handleOpenDialog = useCallback((service = null) => {
    if (service) {
      setSelectedService(service);
      setState(prev => ({
        ...prev,
        formFields: {
          serviceName: service.serviceName || "",
          serviceDescription: service.serviceDescription || "",
          serviceType: service.serviceType || ""
        }
      }));
      setServiceImage(null);
    } else {
      setSelectedService(null);
      setState(prev => ({
        ...prev,
        formFields: { serviceName: "", serviceDescription: "", serviceType: "" }
      }));
      setServiceImage(null);
    }
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedService(null);
    setServiceImage(null);
  }, []);

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error("User ID not found");
      setLoading(false);
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append("serviceName", state.formFields.serviceName);
    form.append("serviceDescription", state.formFields.serviceDescription);
    form.append("serviceType", state.formFields.serviceType);
    form.append("userId", userId);
    if (serviceImage) {
      form.append("serviceImage", serviceImage);
    }

    try {
      if (selectedService) {
        const updateForm = new FormData();
        updateForm.append("id", selectedService._id);
        updateForm.append("serviceName", state.formFields.serviceName);
        updateForm.append("serviceDescription", state.formFields.serviceDescription);
        updateForm.append("serviceType", state.formFields.serviceType);
        if (serviceImage) {
          updateForm.append("serviceImage", serviceImage);
        }
        await axios.put(`${REACT_BASE_URL}/updateservice`, updateForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        toast.success("Service updated successfully");
      } else {
        await axios.post(`${REACT_BASE_URL}/addservice`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        toast.success("Service added successfully");
      }
      handleCloseDialog();
      fetchServices();
    } catch (error) {
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  }, [state.formFields, serviceImage, selectedService, fetchServices, handleCloseDialog]);

  const handleDeleteOpen = useCallback((service) => {
    setSelectedService(service);
    setOpenDelete(true);
  }, []);

  const handleDeleteClose = useCallback(() => {
    setOpenDelete(false);
    setSelectedService(null);
  }, []);

  const deleteService = useCallback(async () => {
    try {
      await axios.delete(`${REACT_BASE_URL}/deleteservice`, {
        data: { _id: selectedService._id }
      });
      toast.success("Service deleted successfully");
      setServices(prev => prev.filter((s) => s._id !== selectedService._id));
      handleDeleteClose();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  }, [selectedService, handleDeleteClose]);

  const handlePreviewImage = useCallback((imageUrl) => {
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${REACT_BASE_URL}/${imageUrl.replace(/\\/g, '/')}`;
    setPreviewImage(fullImageUrl);
    setOpenPreview(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setOpenPreview(false);
    setPreviewImage(null);
  }, []);

  return (
    <Paper sx={{ p: 2, m: 2, mt: 3, boxShadow: 3, borderRadius: 2 }}>
      <Toaster position="top-right" />
      <Typography variant="h4" gutterBottom>Service Management</Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search services..."
          value={state.searchTerm}
          onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Service Type Filter</InputLabel>
          <Select
            value={state.typeFilter}
            label="Service Type Filter"
            onChange={(e) => setState(prev => ({ ...prev, typeFilter: e.target.value }))}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Installation">Installation</MenuItem>
            <MenuItem value="Maintenance">Maintenance</MenuItem>
            <MenuItem value="Repair">Repair</MenuItem>
            <MenuItem value="Service">Service</MenuItem>
            <MenuItem value="Heater Maintenance">Heater Maintenance</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="warning" onClick={() => handleOpenDialog()}>
          Add New Service
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: 'inherit' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Serial No.</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("serviceName")}>
                  <b>Service Name</b>
                  {state.sortField === "serviceName" ? (
                    state.sortDirection === "asc" ? (
                      <Tooltip title="Sorting A to Z">
                        <ArrowUpwardIcon sx={{ ml: 1, fontSize: 20 }} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Sorting Z to A">
                        <ArrowDownwardIcon sx={{ ml: 1, fontSize: 20 }} />
                      </Tooltip>
                    )
                  ) : (
                    <Tooltip title="Click to sort">
                      <Box sx={{ ml: 1, width: 20, height: 20 }} />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("serviceType")}>
                  <b>Type</b>
                  {state.sortField === "serviceType" ? (
                    state.sortDirection === "asc" ? (
                      <Tooltip title="Sorting A to Z">
                        <ArrowUpwardIcon sx={{ ml: 1, fontSize: 20 }} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Sorting Z to A">
                        <ArrowDownwardIcon sx={{ ml: 1, fontSize: 20 }} />
                      </Tooltip>
                    )
                  ) : (
                    <Tooltip title="Click to sort">
                      <Box sx={{ ml: 1, width: 20, height: 20 }} />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.map((service, index) => (
              <TableRow key={service._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{service.serviceName}</TableCell>
                <TableCell>{service.serviceType}</TableCell>
                <TableCell>{service.serviceDescription}</TableCell>
                <TableCell>
                  {service.serviceImage && (
                    <IconButton
                      color="primary"
                      onClick={() => handlePreviewImage(service.serviceImage)}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenDialog(service)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteOpen(service)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{selectedService ? "Edit Service" : "Add New Service"}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Service Name"
              name="serviceName"
              value={state.formFields.serviceName}
              onChange={handleFieldChange}
              required
            />
            <TextField
              label="Service Description"
              name="serviceDescription"
              multiline
              rows={3}
              value={state.formFields.serviceDescription}
              onChange={handleFieldChange}
              helperText={`${state.formFields.serviceDescription.length}/150 characters`}
              required
            />
            <FormControl>
              <InputLabel>Service Type</InputLabel>
              <Select
                name="serviceType"
                value={state.formFields.serviceType}
                onChange={handleFieldChange}
                required
                label="Service Type"
              >
                <MenuItem value="Installation">Installation</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Repair">Repair</MenuItem>
                <MenuItem value="Service">Service</MenuItem>
                <MenuItem value="Heater Maintenance">Heater Maintenance</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              component="label"
            >
              Upload Image
              <input
                type="file"
                hidden
                onChange={(e) => setServiceImage(e.target.files[0])}
              />
            </Button>
            {serviceImage && (
              <Typography variant="body2">Selected Image: {serviceImage.name}</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (selectedService ? "Update" : "Add")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Service?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this service?</Typography>
          <DialogActions sx={{ justifyContent: 'space-between', mt: 3 }}>
            <Button sx={{ width: 100 }} onClick={handleDeleteClose} variant="contained">Cancel</Button>
            <Button sx={{ width: 100 }} onClick={deleteService} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog open={openPreview} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogTitle>Service Image Preview</DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <img
                src={previewImage}
                alt="Service Preview"
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                loading="lazy"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default React.memo(ServiceManagement);