import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Paper, Typography, Card, CardContent, Avatar, CircularProgress,
    useTheme, useMediaQuery, LinearProgress, Tooltip, IconButton, Chip
} from '@mui/material';
import {
    People as PeopleIcon,
    CalendarToday as CalendarIcon,
    Build as BuildIcon,
    Refresh as RefreshIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#F44336'];
const REACT_BASE_URL = "http://localhost:3000" 


const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [appointments, setAppointments] = useState([])
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

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please log in to access the dashboard.');
                navigate('/login');
                return;
            }

            // Fetch all data from /dashboard
            const response = await axios.get(`${REACT_BASE_URL}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { data } = await axios.get(
                `${REACT_BASE_URL}/getappoinments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const list = data.appointments || [];
            setAppointments(list);
            console.log("appointments", data.appointments)
            console.log("user", data.appointments)
            console.log("appointments", data.appointments.appointmentStatus)
            const { appointmentCount, serviceCount, blogsCount } = response.data.data;

            // Process appointment status
            const statusCounts = {
                Pending: 0,
                Approved: 0,
                Completed: 0,
                Cancelled: 0,
            };

            appointmentCount.forEach(apt => {
                const status = (apt.appointmentStatus || 'Pending').charAt(0).toUpperCase() + (apt.appointmentStatus || 'Pending').slice(1).toLowerCase();
                if (statusCounts.hasOwnProperty(status)) {
                    statusCounts[status]++;
                }
            });

            // Process service types
            const serviceTypes = {};
            serviceCount.forEach(service => {
                const type = service.serviceType || 'Other';
                serviceTypes[type] = (serviceTypes[type] || 0) + 1;
            });

            // Get recent appointments from appointmentCount
            const recentAppointments = appointmentCount
                .sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.uploadedDate || Date.now());
                    const dateB = new Date(b.createdAt || b.uploadedDate || Date.now());
                    return dateB - dateA;
                })
                .slice(0, 5);

            // Update state
            setStats({
                totalAppointments: appointmentCount.length,
                totalServices: serviceCount.length,
                totalBlogs: blogsCount.length,
                recentAppointments,
                serviceTypes: Object.entries(serviceTypes).map(([name, value]) => ({ name, value })),
                appointmentStatus: statusCounts,
            });
            console.log("recent", recentAppointments)

            toast.success('Dashboard data updated successfully');
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                localStorage.removeItem('accessToken');
                navigate('/login');
            } else {
                toast.error('Failed to fetch dashboard data: ' + (error.response?.data?.message || error.message));
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
                        value={stats.totalServices}
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
                                        { name: "Cancelled", value: stats.appointmentStatus.Cancelled },
                                        
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
                            <IconButton size="small">
                                <MoreVertIcon />
                            </IconButton>
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
                {/* <Grid item xs={12}>
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
                                            <td style={{ padding: '12px' }}>{appointment.userId?.name || 'Unknown'}</td>
                                            <td style={{ padding: '12px' }}>{appointment.serviceId?.serviceType || 'N/A'}</td>
                                            <td style={{ padding: '12px' }}>
                                                <Chip
                                                    label={appointment.appointmentStatus || 'Pending'}
                                                    color={
                                                        appointment.appointmentStatus === 'Completed' ? 'success' :
                                                            appointment.appointmentStatus === 'Pending' ? 'warning' :
                                                                appointment.appointmentStatus === 'Cancelled' ? 'error' : 'info'
                                                    }
                                                    size="small"
                                                />
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {new Date(appointment.createdAt || Date.now()).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </Paper>
                </Grid> */}
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