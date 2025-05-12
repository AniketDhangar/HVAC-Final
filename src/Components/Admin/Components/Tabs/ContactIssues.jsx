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
import toast, { Toaster } from 'react-hot-toast';

const ContactIssues = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("userName");
    const [sortDirection, setSortDirection] = useState("asc");

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const token = localStorage.getItem("accessToken"); // ✅ Ensure token is retrieved
                if (!token) {
                    toast.error("Unauthorized: No token found!");
                    return;
                }
    
                const response = await axios.get("http://localhost:3000/getcontacts", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                console.log(response.data.contacts);
                setContacts(response.data.contacts || []);
                setFilteredContacts(response.data.contacts || []);
                toast.success("Fetched contacts successfully!");
            } catch (error) {
                console.log(error);
                toast.error("Error fetching contacts!");
                setContacts([]);
                setFilteredContacts([]);
            }
        };
    
        fetchContacts();
    }, []);
        

    // Handle Search and Sort
    useEffect(() => {
        let filtered = [...contacts];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.subject?.toLowerCase().includes(searchTerm.toLowerCase())
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

        setFilteredContacts(filtered);
    }, [contacts, searchTerm, sortField, sortDirection]);

    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Handle block and handle Unblock
    // const handleBlock = async (client) => {
    //     try {
    //         const response = await axios.put("http://localhost:3000/updatecontact", {
    //             _id: client._id,
    //             isBlock: !client.isBlock
    //         });

    //         if (response.data.contact) {
    //             setContacts(prevContacts =>
    //                 prevContacts.map(contact =>
    //                     contact._id === client._id ? { ...contact, isBlock: !contact.isBlock  } : contact
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         alert("Error updating contact");
    //         console.error(error);
    //     }

    // }



  


    return (
        <Box sx={{ p: 1, overflowX: 'auto' }}>
      <Toaster position="top-right" />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" component="h1">
                    Contact Requests
                </Typography>
                <TextField
                    placeholder="Search users..."
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
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("subject")}>
                                    <strong>Email</strong>
                                    {sortField === "subject" ? (
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
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort("message")}>
                                    <strong>Message</strong>
                                    {sortField === "message" ? (
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
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map((client) => (
                                <TableRow
                                    key={client._id}
                                    sx={{
                                        '&:hover': { backgroundColor: 'gray' }
                                    }}
                                >
                                    <TableCell>{filteredContacts.indexOf(client) + 1}</TableCell>
                                    <TableCell>
                                        <Typography variant="body1">
                                            {client.name?.toUpperCase()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {client.email}
                                    </TableCell>
                                    <TableCell>
                                        {client.subject || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {client.message || 'N/A'}
                                    </TableCell>
                                    {/* <TableCell>
                                        <Button
                                            variant="contained"
                                            color={client.isBlock ? "error" : "success"}
                                            onClick={() => handleBlock(client)}
                                        >
                                            {client.isBlock ? "Unblock" : "Block"}
                                        </Button>
                                    </TableCell> */}

                                  
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">
                                        No request found
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

export default ContactIssues 