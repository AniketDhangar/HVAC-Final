import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Zoom,
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Close as CloseIcon, 
  AccessTime, 
  LocationOn,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import BuildIcon from '@mui/icons-material/Build';
import EngineeringIcon from '@mui/icons-material/Engineering';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  }
}));

const ServiceDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    maxHeight: '90vh',
    overflow: 'hidden',
  }
}));

const Services = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showAllServices, setShowAllServices] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/services');
        setServices(response.data.allServices || []);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Extract unique categories from services
  const categories = [...new Set(services.map(service => service.serviceType))];

const servicesList = [
  {
    title: 'AC Repair & Maintenance',
    description: 'Professional repair and maintenance services for all AC brands and models. We diagnose and fix issues quickly.',
    icon: BuildIcon,
  },
  {
    title: 'Emergency Services',
    description: "24/7 emergency AC repair services. We understand that AC problems don't wait for business hours.",
    icon: TimelapseIcon,
  },
  {
    title: 'Installation Services',
    description: 'Expert installation of new AC units with proper sizing and efficiency recommendations.',
    icon: EngineeringIcon,
  },
  {
    title: 'Preventive Maintenance',
    description: 'Regular maintenance programs to keep your AC running efficiently and prevent future problems.',
    icon: AcUnitIcon,
  },
];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenDialog = (service) => {
    setSelectedService(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
  };

  const handleTypeClick = (type) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  const filteredServices = (services || []).filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(service.serviceType);
    return matchesSearch && matchesType;
  });

  const displayedServices = showAllServices ? filteredServices : filteredServices.slice(0, 3);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Typography
          variant="h2"
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 6,
            color: theme.palette.primary.main,
          }}
        >
          Our Services
        </Typography>

        {/* Static Services Grid */}
        <Grid container spacing={4}>
          {servicesList.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.5s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      pt: 3,
                      color: theme.palette.primary.main
                    }}
                  >
                    <IconComponent sx={{ fontSize: 40 }} />
                  </Box>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      align="center"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      align="center"
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Divider sx={{ my: 8 }} />

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search services..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '25px',
                backgroundColor: theme.palette.background.paper,
                '&:hover': {
                  backgroundColor: theme.palette.background.default,
                }
              }
            }}
          />
        </Box>

        {/* Service Type Chips */}
        <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="All Services"
            onClick={() => setSelectedTypes([])}
            color={selectedTypes.length === 0 ? "primary" : "default"}
            sx={{
              borderRadius: '20px',
              px: 2,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: selectedTypes.length === 0 ? 
                  theme.palette.primary.dark : 
                  theme.palette.action.hover,
              }
            }}
          />
          {categories.map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => handleTypeClick(type)}
              color={selectedTypes.includes(type) ? "primary" : "default"}
              sx={{
                borderRadius: '20px',
                px: 2,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: selectedTypes.includes(type) ? 
                    theme.palette.primary.dark : 
                    theme.palette.action.hover,
                }
              }}
            />
          ))}
        </Box>

        {/* Dynamic Services Grid */}
        <Grid container spacing={4}>
          {loading ? (
            // Loading state
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : error ? (
            // Error state
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
                <Typography>Error loading services. Please try again later.</Typography>
              </Box>
            </Grid>
          ) : (
            // Services grid
            displayedServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={service._id || index}>
                <Zoom in timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                  <StyledCard>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:3000/${service.serviceImage}`}
                      alt={service.serviceName}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={service.serviceType} 
                          color="primary" 
                          size="small"
                          sx={{ 
                            borderRadius: '12px',
                            px: 1,
                            py: 0.5,
                            fontSize: '0.8rem',
                          }}
                        />
        </Box>
        <Typography
                        variant="h6" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
                          color: theme.palette.text.primary,
                          mb: 1,
          }}
        >
                        {service.serviceName}
        </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        paragraph
                sx={{
                          lineHeight: 1.6,
                          mb: 2,
                        }}
                      >
                        {service.serviceDescription}
                      </Typography>
                      {/* <Box sx={{ 
                  display: 'flex',
                        alignItems: 'center', 
                        color: theme.palette.text.secondary,
                        mb: 2,
                      }}>
                        <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">
                          {service.serviceDuration}
                        </Typography>
                      </Box> */}
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        fullWidth 
                        variant="contained"
                        onClick={() => handleOpenDialog(service)}
                        sx={{
                          borderRadius: '25px',
                          py: 1.5,
                          textTransform: 'none',
                          fontWeight: 500,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          }
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </StyledCard>
                </Zoom>
              </Grid>
            ))
          )}
        </Grid>

        {/* Show More Button */}
        {filteredServices.length > 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAllServices(!showAllServices)}
              endIcon={<ExpandMoreIcon sx={{ 
                transform: showAllServices ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s ease-in-out'
              }} />}
              sx={{
                borderRadius: '25px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                  '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.dark,
                }
              }}
            >
              {showAllServices ? 'Show Less' : 'Show More Services'}
            </Button>
          </Box>
        )}

        {/* No Results Message */}
        {filteredServices.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
          }}>
            <Typography variant="h6" color="text.secondary">
              No services found matching your search criteria
            </Typography>
          </Box>
        )}

        {/* Service Details Dialog */}
        <ServiceDialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 2,
          }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {selectedService?.serviceName}
            </Typography>
            <IconButton
              onClick={handleCloseDialog}
                  sx={{
                color: theme.palette.grey[500],
                '&:hover': {
                  color: theme.palette.grey[700],
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <img
                src={`http://localhost:3000/${selectedService?.serviceImage}`}
                alt={selectedService?.serviceName}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
                    />
                  </Box>
            <Box sx={{ mb: 3 }}>
              <Chip 
                label={selectedService?.serviceType} 
                color="primary" 
                sx={{ 
                  borderRadius: '12px',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.9rem',
                  mb: 2,
                }}
              />
              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
                {selectedService?.serviceDescription}
              </Typography>
              {/* <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: theme.palette.text.secondary,
                mb: 1,
              }}>
                <AccessTime sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Duration: {selectedService?.serviceDuration}
                  </Typography>
              </Box> */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: theme.palette.text.secondary,
              }}>
                <LocationOn sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Service Area: Any
                  </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                borderRadius: '25px',
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
                  <Button
              variant="contained"
              sx={{
                borderRadius: '25px',
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
              }}
              onClick={() => navigate('/user/take-appointment')}
            >
              Book Now
            </Button>
          </DialogActions>
        </ServiceDialog>
      </Box>
      </Container>
  );
};

export default Services;
