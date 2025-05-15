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
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import SettingsIcon from '@mui/icons-material/Settings';
import toast, { Toaster } from 'react-hot-toast';

const ContactIssues = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [loading, setLoading] = useState(true);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
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

                console.log("Contacts data:", response.data.contacts);
                const contactList = response.data.contacts || [];
                setContacts(contactList);
                setFilteredContacts(contactList);
                toast.success("Fetched contacts successfully!");
            } catch (error) {
                console.error("Error fetching contacts:", error);
                if (error.response?.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                } else {
                    toast.error("Error fetching contacts!");
                }
                setContacts([]);
                setFilteredContacts([]);
            } finally {
                setLoading(false);
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

    // Handle action dialog
    const openActionDialog = (contact) => {
        setSelectedContact(contact);
        setActionDialogOpen(true);
    };

    const closeActionDialog = () => {
        setActionDialogOpen(false);
        setSelectedContact(null);
    };

    // Handle delete
    const handleDeleteContact = async () => {
        if (!selectedContact) return;

        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete("http://localhost:3000/deletecontact", {
                data: { _id: selectedContact._id },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            setContacts(prev => prev.filter(contact => contact._id !== selectedContact._id));
            setFilteredContacts(prev => prev.filter(contact => contact._id !== selectedContact._id));
            toast.success("Contact deleted successfully!");
            closeActionDialog();
        } catch (error) {
            console.error("Error deleting contact:", error);
            toast.error("Failed to delete contact!");
        }
    };

    // Commented-out block functionality (retained for future use)
    // const handleBlock = async (client) => {
    //     try {
    //         const response = await axios.put("http://localhost:3000/updatecontact", {
    //             _id: client._id,
    //             isBlock: !client.isBlock
    //         });
    //         if (response.data.contact) {
    //             setContacts(prevContacts =>
    //                 prevContacts.map(contact =>
    //                     contact._id === client._id ? { ...contact, isBlock: !client.isBlock } : contact
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         alert("Error updating contact");
    //         console.error(error);
    //     }
    // };

    return (
        <Box sx={{ p: 2 }}>
            <Toaster position="top-right" />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contact Requests
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <TextField
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sr. No</TableCell>
                                    <TableCell onClick={() => handleSort("name")} sx={{ cursor: "pointer" }}>
                                        Name <SortIcon fontSize="small" />
                                    </TableCell>
                                    <TableCell onClick={() => handleSort("email")} sx={{ cursor: "pointer" }}>
                                        Email <SortIcon fontSize="small" />
                                    </TableCell>
                                    <TableCell onClick={() => handleSort("subject")} sx={{ cursor: "pointer" }}>
                                        Subject <SortIcon fontSize="small" />
                                    </TableCell>
                                    <TableCell onClick={() => handleSort("message")} sx={{ cursor: "pointer" }}>
                                        Message <SortIcon fontSize="small" />
                                    </TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredContacts.length > 0 ? (
                                    filteredContacts.map((client, index) => (
                                        <TableRow key={client._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {client.name?.toUpperCase() || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{client.email || 'N/A'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{client.subject || 'N/A'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{client.message || 'N/A'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    title="Manage Contact"
                                                    color="primary"
                                                    onClick={() => openActionDialog(client)}
                                                >
                                                    <SettingsIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography variant="body2">
                                                No contact requests found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            <Dialog
                open={actionDialogOpen}
                onClose={closeActionDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Manage Contact</DialogTitle>
                <DialogContent>
                    {selectedContact && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>Contact Details</Typography>
                            <Typography><strong>Name:</strong> {selectedContact.name?.toUpperCase() || 'N/A'}</Typography>
                            <Typography><strong>Email:</strong> {selectedContact.email || 'N/A'}</Typography>
                            <Typography><strong>Subject:</strong> {selectedContact.subject || 'N/A'}</Typography>
                            <Typography><strong>Message:</strong> {selectedContact.message || 'N/A'}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeActionDialog} color="error">Cancel</Button>
                    <Button
                        onClick={handleDeleteContact}
                        variant="contained"
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ContactIssues;