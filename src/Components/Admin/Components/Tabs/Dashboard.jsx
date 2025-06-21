import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, Card, CardContent, Avatar, CircularProgress,
  useTheme, useMediaQuery, LinearProgress, Tooltip, IconButton, Chip,
  Table, TableBody, TableCell, TableHead, TableRow
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

const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0', '#FF9800'];
const REACT_BASE_URL =  "https://hvac-final.onrender.com";

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
    appointmentStatus: { Pending: 0, Approved: 0, Completed: 0, Cancelled: 0 }
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

      const response = await axios.get(`${REACT_BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data } = response;
      if (!data?.data) {
        throw new Error('Invalid response structure from /dashboard');
      }
      const { appointmentCount = [], serviceCount = [], blogsCount = [] } = data.data;

      const statusCounts = { Pending: 0, Approved: 0, Completed: 0, Cancelled: 0 };
      appointmentCount.forEach(apt => {
        const status = (apt.appointmentStatus || 'Pending').charAt(0).toUpperCase() + (apt.appointmentStatus || 'Pending').slice(1).toLowerCase();
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      });

      const serviceTypes = {};
      serviceCount.forEach(service => {
        const type = service.serviceType || 'Other';
        serviceTypes[type] = (serviceTypes[type] || 0) + 1;
      });

      const recentAppointments = appointmentCount
        .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
        .slice(0, 5);

      setStats({
        totalAppointments: appointmentCount.length,
        totalServices: serviceCount.length,
        totalBlogs: blogsCount.length,
        recentAppointments,
        serviceTypes: Object.entries(serviceTypes).map(([name, value]) => ({ name, value })),
        appointmentStatus: statusCounts,
      });
console.log(recentAppointments)
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

  const pieData = Object.entries(stats.appointmentStatus)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

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
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarIcon />}
            color="#1976d2"
            // onClick={() => navigate('/main/my-appointments')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Services"
            value={stats.totalServices}
            icon={<BuildIcon />}
            color="#2e7d32"
            // onClick={() => navigate('/main/my-services')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Blogs"
            value={stats.totalBlogs}
            icon={<PeopleIcon />}
            color="#ed6c02"
            // onClick={() => navigate('/main/my-blogs')}
          />
        </Grid>

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
              <PieChart aria-label="Appointment status distribution">
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

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
{/* 
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentAppointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{appointment.userId?.name || 'Unknown'}</TableCell>
                    <TableCell>{appointment.serviceId?.serviceType || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.appointmentStatus || 'Pending'}
                        color={
                          appointment.appointmentStatus === 'Completed' ? 'success' :
                          appointment.appointmentStatus === 'Pending' ? 'warning' :
                          appointment.appointmentStatus === 'Cancelled' ? 'error' : 'info'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.createdAt || Date.now()).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      borderRadius: 2,
      boxShadow: 3,
      '&:hover': onClick ? { transform: 'translateY(-5px)', boxShadow: 6 } : {}
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
      <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default Dashboard;