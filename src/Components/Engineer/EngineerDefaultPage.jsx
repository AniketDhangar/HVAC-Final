import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const REACT_BASE_URL = "https://hvac-final.onrender.com" 

function EngineerDefaultPage() {
  const [incomingData, setIncomingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${REACT_BASE_URL}/getappoinments`);
        console.log('API Response:', response.data); // Debugging log

        if (response.data && response.data.appointments) {
          setIncomingData(response.data.appointments);
        } else {
          console.error('Unexpected API response structure:', response.data);
          toast.error('Failed to load appointments. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching appointments. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hello Engineer! 👷‍♂️
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : incomingData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Service Type</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomingData.map((item, index) => (
                <TableRow key={item._id || index}>
                  <TableCell>{item._id || index + 1}</TableCell>
                  <TableCell>{item.name || 'N/A'}</TableCell>
                  <TableCell>{item.serviceType || 'N/A'}</TableCell>
                  <TableCell>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{item.status || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">
          No appointments found.
        </Typography>
      )}
    </Container>
  );
}

export default EngineerDefaultPage;
