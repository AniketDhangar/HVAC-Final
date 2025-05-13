import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  IconButton,
  CircularProgress,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Fade,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceImage, setServiceImage] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState("serviceName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [serviceType, setserviceType] = useState("");
  // Local state for form fields (for add/edit)
  const [formFields, setFormFields] = useState({
    serviceName: "",
    serviceDescription: "",
    serviceType: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Handle Search and Filter
  useEffect(() => {
    let filtered = [...services];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(service => service.serviceType === typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase() || "";
      const bValue = b[sortField]?.toLowerCase() || "";
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    setFilteredServices(filtered);
  }, [services, searchTerm, typeFilter, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // const fetchServices = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3000/servicesforadmin');
  //     setServices(response.data.allServices);
  //     setFilteredServices(response.data.allServices);
  //     toast.success("Services fetched successfully");
  //   } catch (error) {
  //     console.error("Error fetching services:", error);
  //     toast.error("Failed to fetch services");
  //   }
  // };

  // Handle form field changes
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token if available

      const endpoint = token
        ? "http://localhost:3000/servicesforadmin" // Admin route (requires token)
        : "http://localhost:3000/services"; // Public route for users

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(endpoint, { headers });

      setServices(response.data.allServices);
      setFilteredServices(response.data.allServices);
      toast.success("Services fetched successfully");
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services");
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    // For description, enforce a 150 character limit
    if (name === "serviceDescription") {
      if (value.length > 150) return;
      setDescription(value);
    }
    setFormFields({ ...formFields, [name]: value });
  };

  // Open Add/Edit Dialog; if service provided, we're editing
  const handleOpenDialog = (service = null) => {
    if (service) {
      setSelectedService(service);
      setFormFields({
        serviceName: service.serviceName || "",
        serviceDescription: service.serviceDescription || "",
        serviceType: service.serviceType || "",
      });
      setDescription(service.serviceDescription || "");
      setServiceImage(null);
    } else {
      setSelectedService(null);
      setFormFields({
        serviceName: "",
        serviceDescription: "",
        serviceType: "",
      });
      setDescription("");
      setServiceImage(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
  };

  // Handle Add/Edit form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();


    form.append("serviceName", formFields.serviceName);
    form.append("serviceDescription", formFields.serviceDescription);
    form.append("serviceType", formFields.serviceType);
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      toast.error("User ID not found in localStorage");
      return;
    }
    // Append userId to form data
    form.append("userId", userId);
    if (serviceImage) {
      form.append("serviceImage", serviceImage);
    }

    try {
      if (selectedService) {
        // Update service
        try {
          const reqBody = {
            id: selectedService._id,
            serviceName: formFields.serviceName,
            serviceDescription: formFields.serviceDescription,
            serviceType: formFields.serviceType
          }
          let result = await axios.put("http://localhost:3000/updateservice", reqBody)
          toast.success("Service updated successfully");
          window.location.reload(false);
        } catch (error) {
          alert("Error in updating", error.message);
          console.error(error);
        }
      } else {
        // Add new service
        await axios.post("http://localhost:3000/addservice", form, {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if available
          },
        });
        toast.success("Service added successfully");
      }
      handleCloseDialog();
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  // Open Delete Confirmation Dialog
  const handleDeleteOpen = (service) => {
    setSelectedService(service);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setSelectedService(null);
  };

  const deleteService = async () => {
    try {
      await axios.delete(`http://localhost:3000/deleteservice`, {
        data: { _id: selectedService._id }
      });
      toast.success("Service deleted successfully");
      setServices(services.filter((s) => s._id !== selectedService._id));
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    } finally {
      handleDeleteClose();
    }
  };

  const handlePreviewImage = (imageUrl) => {
    // Convert relative path to full URL
    const fullImageUrl = `http://localhost:3000/${imageUrl.replace(/\\/g, '/')}`;
    setPreviewImage(fullImageUrl);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewImage(null);
  };

  return (
    <Paper sx={{ p: 2, m: 2, mt: 3, boxShadow: 3, borderRadius: 2 }}>
      <Toaster position="top-right" />
      <Typography variant="h4" gutterBottom>
        Service Management
      </Typography>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search services..."
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
          <InputLabel>Service Type Filter</InputLabel>
          <Select
            value={typeFilter}
            label="Service Type Filter"
            onChange={(e) => setTypeFilter(e.target.value)}
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
            <TableRow >
              <TableCell sx={{ fontWeight: 'bold' }}>Serial No.</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("serviceName")}>
                  <b>Service Name</b>
                  {sortField === "serviceName" ? (
                    sortDirection === "asc" ? (
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
                  {sortField === "serviceType" ? (
                    sortDirection === "asc" ? (
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

      {/* Add/Edit Service Dialog */}
      {/* <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedService ? "Edit Service" : "Add New Service"}</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <TextField
              name="serviceName"
              label="Service Name"
              fullWidth
              required
              margin="normal"
              value={formFields.serviceName}
              onChange={handleFieldChange}
            />
            <TextField
              name="serviceDescription"
              label="Description"
              fullWidth
              required
              multiline
              rows={3}
              margin="normal"
              value={formFields.serviceDescription}
              onChange={handleFieldChange}
              helperText={`${description.length}/150 characters`}
              inputProps={{ maxLength: 150 }}
            />
            {/* <TextField
              name="serviceType"
              label="Service Type"
              fullWidth
              required
              margin="normal"
              value={formFields.serviceType}
              onChange={handleFieldChange}
            /> 
            <TextField select fullWidth required name="serviceType" margin="normal" value={formFields.serviceType}
              onChange={handleFieldChange}
              label="Service Type"
            >
              <MenuItem value="Repair">Repair</MenuItem>
              <MenuItem value="Installation">Installation</MenuItem>
              <MenuItem value="Service">Service</MenuItem>
              <MenuItem value="Heater Maintenance">Heater Maintenance</MenuItem>
              <MenuItem value="Maintenance">Other Maintenance</MenuItem>
              <MenuItem value="Other">Other</MenuItem>

            </TextField>
            <TextField
              name="serviceImage"
              type="file"
              onChange={(e) => setServiceImage(e.target.files[0])}
              label="Service Image"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <DialogActions sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button color='error' variant='contained' sx={{ width: 100 }} onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" sx={{ width: 100 }} color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : selectedService ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </DialogContent>

        </form>
      </Dialog> */}


      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{selectedService ? "Edit Service" : "Add New Service"}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Service Name"
              name="serviceName"
              value={formFields.serviceName}
              onChange={handleFieldChange}
              required
            />
            <TextField
              label="Service Description"
              name="serviceDescription"
              multiline
              rows={3}
              value={description}
              onChange={handleFieldChange}
              helperText={`${description.length}/150 characters`}
              required
            />
            <FormControl>
              <InputLabel>Service Type</InputLabel>
              <Select
                name="serviceType"
                value={formFields.serviceType}
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
            {
            // loading ? <CircularProgress size={24} /> : 
            (selectedService ? "Update" : "Add")
            }
          </Button>
        </DialogActions>
      </Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Service?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this service?
          </Typography>
          <DialogActions sx={{ justifyContent: 'space-between', mt: 3 }}>
            <Button sx={{ width: 100 }} onClick={handleDeleteClose} variant="contained">Cancel</Button>
            <Button sx={{ width: 100 }} onClick={deleteService} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </DialogContent>

      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog 
        open={openPreview} 
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Service Image Preview</DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <img 
                src={previewImage} 
                alt="Service Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh', 
                  objectFit: 'contain' 
                }} 
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

export default ServiceManagement;
