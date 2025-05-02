import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Paper, Typography, Card, CardContent, Avatar, CircularProgress,
    useTheme, useMediaQuery, LinearProgress, Tooltip, IconButton, Chip
} from '@mui/material';
import {
    People as PeopleIcon,
    CalendarToday as CalendarIcon,
    Build as BuildIcon,
    TrendingUp as TrendingUpIcon,
    Refresh as RefreshIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#F44336'];

const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAppointments: 0,
        totalServices: 0,
        totalBlogs: 0,
        recentAppointments: [],
        serviceTypes: [],
        appointmentStatus: {
            Pending: 0, Approved: 0, Completed: 0, Cancelled: 0
        }
    });

    // const fetchDashboardData = async () => {
    //     try {
    //         setLoading(true);
    //         console.log('Fetching dashboard data...');

    //         // Fetch appointments
    //         const appointmentsRes = await axios.get('http://localhost:3000/getappoinment');
    //         console.log('Appointments response:', appointmentsRes.data);

    //         // Fetch services
    //         const servicesRes = await axios.get('http://localhost:3000/services');
    //         console.log('Services response:', servicesRes.data);

    //         // Fetch blogs
    //         const blogsRes = await axios.get('http://localhost:3000/blogs');
    //         console.log('Blogs response:', blogsRes.data);

    //         // Extract data from responses
    //         const appointments = appointmentsRes.data.appointments || [];
    //         const services = servicesRes.data.allServices || [];
    //         const blogs = blogsRes.data.blogs || [];

    //         console.log('Raw data:', { appointments, services, blogs });

    //         // Process appointment status
    //         const statusCounts = {
    //             Pending: 0,
    //             Approved: 0,
    //             Completed: 0,
    //             Cancelled: 0
    //         };

    //         appointments.forEach(apt => {
    //             const status = apt.appointmentStatus || 'Pending';
    //             // Convert status to proper case format
    //             const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    //             if (statusCounts.hasOwnProperty(normalizedStatus)) {
    //                 statusCounts[normalizedStatus]++;
    //             } else {
    //                 console.log('Unknown status:', status);
    //             }
    //         });

    //         console.log('Status counts:', statusCounts);

    //         // Process service types
    //         const serviceTypes = {};
    //         services.forEach(service => {
    //             const type = service.serviceType || 'Other';
    //             serviceTypes[type] = (serviceTypes[type] || 0) + 1;
    //         });

    //         console.log('Service types:', serviceTypes);

    //         // Get recent appointments
    //         const recentAppointments = appointments
    //             .sort((a, b) => {
    //                 const dateA = new Date(a.createdAt || a.uploadedDate || Date.now());
    //                 const dateB = new Date(b.createdAt || b.uploadedDate || Date.now());
    //                 return dateB - dateA;
    //             })
    //             .slice(0, 5);

    //         console.log('Recent appointments:', recentAppointments);

    //         // Update state with processed data
    //         setStats({
    //             totalAppointments: appointments.length,
    //             totalServices: services.length,
    //             totalBlogs: blogs.length,
    //             recentAppointments,
    //             serviceTypes: Object.entries(serviceTypes).map(([name, value]) => ({ name, value })),
    //             appointmentStatus: statusCounts
    //         });

    //         console.log('Final stats:', {
    //             totalAppointments: appointments.length,
    //             totalServices: services.length,
    //             totalBlogs: blogs.length,
    //             appointmentStatus: statusCounts,
    //             serviceTypes: Object.entries(serviceTypes).map(([name, value]) => ({ name, value }))
    //         });

    //         toast.success('Dashboard data updated successfully');
    //     } catch (error) {
    //         console.error('Error fetching dashboard data:', error);
    //         toast.error('Failed to fetch dashboard data: ' + (error.response?.data?.message || error.message));
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchDashboardData();
    // }, []);

    // const handleRefresh = () => {
    //     fetchDashboardData();
    // };


    const fetchDashboardData = async () => {
        try {
          setLoading(true);
        //   console.log("Fetching dashboard data...");
      
          // Get auth token
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("You need to log in first.");
            return;
          }
      
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };
      
          // Fetch data in parallel
          const [appointmentsRes, servicesRes, blogsRes] = await Promise.all([
            axios.get("http://localhost:3000/getappoinments", { headers }),
            axios.get("http://localhost:3000/servicesforadmin", { headers }),
            axios.get("http://localhost:3000/blogsforadmin", { headers }),
          ]);
      
          // Extract data
          const appointments = appointmentsRes.data.appointments || [];
          const services = servicesRes.data.allServices || [];
          const blogs = blogsRes.data.blogs || [];
      
        //   console.log("Raw data:", { appointments, services, blogs });
      
          // Process appointment status
          const statusCounts = appointments.reduce((acc, apt) => {
            const status = apt.appointmentStatus || "Pending";
            const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
            acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1;
            return acc;
          }, { Pending: 0, Approved: 0, Completed: 0, Cancelled: 0 });
      
          // Process service types
          const serviceTypes = services.reduce((acc, service) => {
            const type = service.serviceType || "Other";
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {});
      
          // Get recent appointments (latest 5)
          const recentAppointments = appointments
            .sort((a, b) => new Date(b.createdAt || b.uploadedDate || Date.now()) - new Date(a.createdAt || a.uploadedDate || Date.now()))
            .slice(0, 5);
      
          // Update state with processed data
          setStats({
            totalAppointments: appointments.length,
            totalServices: services.length,
            totalBlogs: blogs.length,
            recentAppointments,
            serviceTypes: Object.entries(serviceTypes).map(([name, value]) => ({ name, value })),
            appointmentStatus: statusCounts,
          });
      
        //  console.log("Final stats:", {
        //     totalAppointments: appointments.length,
        //     totalServices: services.length,
        //     totalBlogs: blogs.length,
        //     appointmentStatus: statusCounts,
        //     serviceTypes: Object.entries(serviceTypes).map(([name, value]) => ({ name, value })),
        //   });
      
          toast.success("Dashboard data updated successfully");
        } catch (error) {
          if (error.response) {
            if (error.response.status === 401) {
              toast.error("Session expired. Please log in again.");
              localStorage.removeItem("token");
              window.location.href = "/login"; // Redirect to login
            } else {
              toast.error(error.response.data.message || "Error fetching dashboard data.");
            }
          } else {
            toast.error("Network error. Please check your connection.");
          }
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        fetchDashboardData();
      }, []);
      
      const handleRefresh = () => {
        fetchDashboardData();
      };
      

    if (loading) {
        return (
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <LinearProgress sx={{ width: '100%' }} />
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Dashboard Overview
                </Typography>
                <Tooltip title="Refresh Dashboard">
                    <IconButton onClick={handleRefresh} color="primary">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Grid container spacing={3}>
                {/* Stat Cards */}
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Appointments"
                        value={stats.totalAppointments}
                        icon={<CalendarIcon />}
                        color="#1976d2"
                        onClick={() => navigate('/main/my-appointments')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Active Services"
                        data={stats.totalServices}
                        icon={<BuildIcon />}
                        color="#2e7d32"
                        onClick={() => navigate('/main/my-services')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Blogs"
                        value={stats.totalBlogs}
                        icon={<PeopleIcon />}
                        color="#ed6c02"
                        onClick={() => navigate('/main/my-blogs')}
                    />
                </Grid>

                {/* Appointment Status Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 2, boxShadow: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Appointment Status
                            </Typography>
                            <IconButton size="small">
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: "Completed", value: stats.appointmentStatus.Completed },
                                        { name: "Pending", value: stats.appointmentStatus.Pending },
                                        { name: "Approved", value: stats.appointmentStatus.Approved },
                                        { name: "Cancelled", value: stats.appointmentStatus.Cancelled }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {COLORS.map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} />
                                    ))}
                                </Pie>
                                <ChartTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Service Types Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 2, boxShadow: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Service Types Distribution
                            </Typography>
                            {/* <IconButton size="small">
                                <MoreVertIcon />
                            </IconButton> */}
                        </Box>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.serviceTypes}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ChartTooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Recent Appointments */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Recent Appointments
                            </Typography>
                            <IconButton size="small">
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee' }}>
                                        <th style={{ textAlign: 'left', padding: '12px' }}>Client</th>
                                        <th style={{ textAlign: 'left', padding: '12px' }}>Service</th>
                                        <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                                        <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentAppointments.map((appointment) => (
                                        <tr key={appointment._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '12px' }}>{appointment.userName}</td>
                                            <td style={{ padding: '12px' }}>{appointment.serviceType}</td>
                                            <td style={{ padding: '12px' }}>
                                                <Chip
                                                    label={appointment.appointmentStatus}
                                                    color={
                                                        appointment.appointmentStatus === 'Completed' ? 'success' :
                                                            appointment.appointmentStatus === 'Pending' ? 'warning' :
                                                                appointment.appointmentStatus === 'Cancelled' ? 'error' : 'info'
                                                    }
                                                    size="small"
                                                />
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {new Date(appointment.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card
        sx={{
            height: '100%',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: 2,
            boxShadow: 3,
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
            }
        }}
        onClick={onClick}
    >
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: color, mr: 2, width: 48, height: 48 }}>
                    {icon}
                </Avatar>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

export default Dashboard;


