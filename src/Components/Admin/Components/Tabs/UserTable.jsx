import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import toast, { Toaster } from "react-hot-toast";
const UserTable = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("userName");
    const [sortDirection, setSortDirection] = useState("asc");

    // useEffect(() => {
    //     const fetchAppointments = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:3000/getappoinment");
    //             console.log(response.data.appointments);
    //             setAppointments(response.data.appointments || []);
    //             setFilteredAppointments(response.data.appointments || []);
    //         } catch (error) {
    //             alert("Error fetching appointments");
    //             console.error(error);
    //             setAppointments([]);
    //             setFilteredAppointments([]);
    //         }
    //     };

    //     fetchAppointments();
    // }, []);

    // Handle Search and Sort
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token if available

                const response = await axios.get("http://localhost:3000/getappoinments", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                });

                // console.log(response.data.appointments);
                setAppointments(response.data.appointments || []);
                setFilteredAppointments(response.data.appointments || []);
                toast.success("Clients fetched successfully");
            } catch (error) {
                toast.error("network error");

                console.error(error);
                setAppointments([]);
                setFilteredAppointments([]);
            }
        };

        fetchAppointments();
    }, []);



    useEffect(() => {
        let filtered = [...appointments];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(client =>
                client.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.userMobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.userAddress?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const aValue = a[sortField]?.toLowerCase() || "";
            const bValue = b[sortField]?.toLowerCase() || "";
            return sortDirection === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });

        setFilteredAppointments(filtered);
    }, [appointments, searchTerm, sortField, sortDirection]);

    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    return (
        <Box sx={{ p: 1, overflowX: 'auto' }}>
            <Toaster position="top-right" />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" component="h1">
                    Our Clients
                </Typography>
                <TextField
                    placeholder="Search clients..."
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
            </Box>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'inherit', width: '110%', color: 'inherit' }}>
                            <TableCell><strong>Sr. no</strong></TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("userName")}>
                                    <strong>Name</strong>
                                    {sortField === "userName" ? (
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
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("userMobile")}>
                                    <strong>Phone</strong>
                                    {sortField === "userMobile" ? (
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
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("userEmail")}>
                                    <strong>Email</strong>
                                    {sortField === "userEmail" ? (
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
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("userAddress")}>
                                    <strong>Address</strong>
                                    {sortField === "userAddress" ? (
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
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((client) => (
                                <TableRow
                                    key={client._id}
                                    sx={{
                                        '&:hover': { backgroundColor: 'gray' }
                                    }}
                                >
                                    <TableCell>{filteredAppointments.indexOf(client) + 1}</TableCell>
                                    <TableCell>
                                        <Typography variant="body1">
                                            {client.userName?.toUpperCase()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {client.userMobile}
                                    </TableCell>
                                    <TableCell>
                                        {client.userEmail || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {client.userAddress || 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">
                                        No client found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserTable; 