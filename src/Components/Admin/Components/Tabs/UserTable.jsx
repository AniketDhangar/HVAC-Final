import React, { useState, useEffect, useMemo } from 'react';
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
    const [sortField, setSortField] = useState("name");
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
                const token = localStorage.getItem("accessToken"); // Get token if available

                const response = await axios.get("http://localhost:3000/getappoinments", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("usertable", response.data.appointments.userId);
                setAppointments(response.data.appointments || []);
                setFilteredAppointments(response.data.appointments || []);
                console.log("filteredAppointments: ", filteredAppointments)
                toast.success("Clients fetched successfully");
            } catch (error) {
                toast.error(error?.response?.data?.message || "Network error");


                console.log(error);
                setAppointments([]);
                setFilteredAppointments([]);
            }
        };

        fetchAppointments();
    }, []);



    // useEffect(() => {
    //     let filtered = [...appointments];

    //     // Apply search filter
    //     if (searchTerm) {
    //         filtered = filtered.filter(client =>
    //             client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             client.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             client.address?.toLowerCase().includes(searchTerm.toLowerCase())
    //         );
    //     }

    //     // Apply sorting
    //     filtered.sort((a, b) => {
    //         const aValue = a.userId?.[sortField]?.toLowerCase() || "";
    //         const bValue = b.userId?.[sortField]?.toLowerCase() || "";
    //         return sortDirection === "asc"
    //             ? aValue.localeCompare(bValue)
    //             : bValue.localeCompare(aValue);
    //     });

    //     setFilteredAppointments(filtered);
    // }, [appointments, searchTerm, sortField, sortDirection]);
    // filteredAppointments.forEach((appointment) => {
    //     const user = appointment.userId;
    //     console.log("Name:", user.name);
    //     console.log("Email:", user.email);
    //     console.log("Mobile:", user.mobile);
    // });
    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };


const sortedFilteredAppointments = useMemo(() => {
    let filtered = [...appointments];
    if (searchTerm) {
        filtered = filtered.filter(client =>
            client.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.userId?.mobile?.includes(searchTerm) ||
            client.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.userId?.address?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    filtered.sort((a, b) => {
        const aVal = a.userId?.[sortField]?.toLowerCase() || "";
        const bVal = b.userId?.[sortField]?.toLowerCase() || "";
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return filtered;
}, [appointments, searchTerm, sortField, sortDirection]);


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
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("name")}>
                                    <strong>Name</strong>
                                    {sortField === "name" ? (
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
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("mobile")}>
                                    <strong>Phone</strong>
                                    {sortField === "mobile" ? (
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
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("email")}>
                                    <strong>Email</strong>
                                    {sortField === "email" ? (
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
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("address")}>
                                    <strong>Address</strong>
                                    {sortField === "address" ? (
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
                        {sortedFilteredAppointments.length > 0 ? (
                            sortedFilteredAppointments.map((client) => (
                                <TableRow
                                    key={client._id}
                                    sx={{
                                        '&:hover': { backgroundColor: 'gray' }
                                    }}
                                >
                                    <TableCell>{sortedFilteredAppointments.indexOf(client) + 1}</TableCell>
                                    <TableCell>
                                        <Typography variant="body1">{console.log(client.name)}
                                            {client.userId.name?.toUpperCase()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {client.userId.mobile}
                                    </TableCell>
                                    <TableCell>
                                        {client.userId.email || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {client.userId.address || 'N/A'}
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