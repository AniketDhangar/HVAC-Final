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
    Tooltip,
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const ContactIssues = () => {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getcontacts');
                setContacts(response.data.contacts || []);
            } catch (error) {
                console.error('Error fetching contacts:', error);
                setContacts([]);
            }
        };

        fetchContacts();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSort = (field) => {
        const isAsc = sortField === field && sortDirection === 'asc';
        setSortField(field);
        setSortDirection(isAsc ? 'desc' : 'asc');
    };

    const handleBlockToggle = async (contactId, currentStatus) => {
        try {
            const response = await axios.put('http://localhost:3000/updatecontact', {
                _id: contactId,
                isBlock: !currentStatus,
            });

            if (response.data.success) {
                setContacts((prevContacts) =>
                    prevContacts.map((contact) =>
                        contact._id === contactId ? { ...contact, isBlock: !currentStatus } : contact
                    )
                );
            } else {
                console.error('Failed to update contact:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

    const filteredContacts = contacts
        .filter((contact) =>
            ['name', 'email', 'subject', 'message'].some((field) =>
                contact[field]?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => {
            const aValue = a[sortField]?.toLowerCase() || '';
            const bValue = b[sortField]?.toLowerCase() || '';
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Contact Requests</Typography>
                <TextField
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={handleSearch}
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            {['name', 'email', 'subject', 'message'].map((field) => (
                                <TableCell key={field} onClick={() => handleSort(field)} sx={{ cursor: 'pointer' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}</strong>
                                        {sortField === field ? (
                                            sortDirection === 'asc' ? (
                                                <Tooltip title="Ascending">
                                                    <ArrowUpwardIcon sx={{ ml: 1, fontSize: 20 }} />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Descending">
                                                    <ArrowDownwardIcon sx={{ ml: 1, fontSize: 20 }} />
                                                </Tooltip>
                                            )
                                        ) : null}
                                    </Box>
                                </TableCell>
                            ))}
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map((contact, index) => (
                                <TableRow key={contact._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{contact.name}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.subject || 'N/A'}</TableCell>
                                    <TableCell>{contact.message || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color={contact.isBlock ? 'error' : 'success'}
                                            onClick={() => handleBlockToggle(contact._id, contact.isBlock)}
                                        >
                                            {contact.isBlock ? 'Unblock' : 'Block'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No contact requests found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ContactIssues;
