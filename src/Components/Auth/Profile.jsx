import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Fade,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUserData } from '../Reduxwork/userSlice';
import Loader from '../Auth/Loader';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const REACT_BASE_URL = "http://localhost:3000" 

const Profile = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('')
  const [newMobile, setNewMobile] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user || !user.userData) {
    return <Loader />;
  }

  const { name, email, role, mobile,address } = user.userData;

  const handleOpenUpdate = () => {
    setOpenUpdate(true);
    setNewName(name || '');
    setNewMobile(mobile || '');
    setNewPassword('');
    setNewAddress('')
    setNameError('');
    setMobileError('');
    setPasswordError('');
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setNewName('');
    setNewMobile('');
    setNewPassword('');
    setNewAddress('')
    setNameError('');
    setMobileError('');
    setPasswordError('');
  };

  const validateInputs = () => {
    let isValid = true;

    // Name validation (only if provided)
    if (newName && newName.trim().length < 1) {
      setNameError('Name cannot be empty if provided');
      isValid = false;
    } else {
      setNameError('');
    }

    // Mobile validation (only if provided)
    const mobileRegex = /^\d{10}$/;
    if (newMobile && !mobileRegex.test(newMobile)) {
      setMobileError('Mobile number must be 10 digits if provided');
      isValid = false;
    } else {
      setMobileError('');
    }

    // Password validation (only if provided)
    if (newPassword && newPassword.length < 1) {
      setPasswordError('Password cannot be empty if provided');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const updateProfile = async () => {
    if (!validateInputs()) {
      return;
    }

    const loggedInUserId = localStorage.getItem('userId');
    if (!loggedInUserId) {
      toast.error('User not authenticated');
      return;
    }

    // Only include fields that have changed or are provided
    const reqBody = {
      _id: loggedInUserId,
      userId: loggedInUserId,
      ...(newName && newName !== name && { newName }),
      ...(newMobile && newMobile !== mobile && { newMobile }),
      ...(newPassword && { newPassword }),
      ...(newAddress && {newAddress})
    };

    // Check if any fields are provided for update
    if (Object.keys(reqBody).length <= 2) {
      toast.error('No changes provided to update');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axios.put(`${REACT_BASE_URL}/users`, reqBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      console.log('Backend response:', response.data); // Debug log
      toast.success(response.data.message || 'Profile updated successfully');

      // Update Redux store with new user data
      if (response.data.updatedUser) {
        dispatch(updateUserData(response.data.updatedUser));
        console.log('Dispatched updateUserData with:', response.data.updatedUser); // Debug log
      }

      handleCloseUpdate();
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    navigate('/login', { replace: true });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        bgcolor: 'background.default',
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <Toaster position="top-right" />
      <Fade in timeout={500}>
        <Card
          sx={{
            maxWidth: 600,
            width: '100%',
            borderRadius: 3,
            boxShadow: 6,
            bgcolor: 'background.paper',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 10,
            },
            maxHeight: 'calc(100vh - 96px)',
            overflow: 'auto',
            mt: { xs: 8, sm: 10 }, // Offset for 64px AppBar
          }}
        >
          <CardContent sx={{ p: theme.spacing(4) }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  letterSpacing: '-0.5px',
                }}
                aria-label="User Profile"
              >
                User Profile
              </Typography>
              <IconButton
                color="primary"
                onClick={handleOpenUpdate}
                aria-label="Update profile"
                sx={{
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    bgcolor: 'primary.light',
                  },
                }}
              >
                <EditSharpIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 3, bgcolor: 'primary.light', opacity: 0.3 }} />

            <Grid container spacing={2}>
              {[
                ['Name', name],
                ['Email', email],
                ['Role', role],
                ['Mobile', mobile],
                ['Address',address]
              ].map(([label, value], idx) =>
                value ? (
                  <Grid item xs={12} key={idx}>
                    <Grid container alignItems="center">
                      <Grid item xs={4}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            color: 'text.primary',
                          }}
                        >
                          {label}:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '1.05rem',
                            wordBreak: 'break-word',
                          }}
                        >
                          {value}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null
              )}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                onClick={handleLogout}
                aria-label="Log out of your account"
                variant="contained"
                sx={{
                  borderRadius: 10,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #1976d2, #1565c0)',
                  color: 'common.white',
                  boxShadow: 3,
                  transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                    boxShadow: 6,
                    transform: 'scale(1.03)',
                  },
                  '&:active': {
                    transform: 'scale(0.97)',
                  },
                  '&:focus': {
                    outline: '2px solid #1565c0',
                    outlineOffset: '2px',
                  },
                }}
              >
                Logout
              </Button>
              {role === 'user' && (
                <Button
                  fullWidth
                  onClick={() => navigate('/user/my-appointments')}
                  aria-label="View your appointments"
                  variant="outlined"
                  sx={{
                    borderRadius: 10,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    background: 'linear-gradient(45deg, #42a5f520, #1976d220)',
                    transition: 'background 0.3s ease, transform 0.2s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #42a5f540, #1976d240)',
                      transform: 'scale(1.03)',
                      borderColor: 'primary.dark',
                    },
                    '&:active': {
                      transform: 'scale(0.97)',
                    },
                    '&:focus': {
                      outline: '2px solid #1976d2',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  See My Appointments
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Update Profile Dialog */}
      <Dialog
        open={openUpdate}
        onClose={handleCloseUpdate}
        maxWidth="sm"
        fullWidth
        aria-labelledby="update-profile-dialog-title"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            boxShadow: 6,
            p: 2,
          },
        }}
      >
        <DialogTitle id="update-profile-dialog-title" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Update Profile
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            Update any of your profile details below.
          </Typography>
          <TextField
            fullWidth
            type="text"
            variant="outlined"
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
            autoFocus
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
            aria-describedby="new-name-helper-text"
          />
          <TextField
            fullWidth
            type="tel"
            variant="outlined"
            label="Mobile Number"
            value={newMobile}
            onChange={(e) => setNewMobile(e.target.value)}
            error={!!mobileError}
            helperText={mobileError}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
            aria-describedby="new-mobile-helper-text"
          />
             <TextField
            fullWidth
            type="text"
            variant="outlined"
            label="Your Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
              // error={!!addressError}
              // helperText={addressError}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
            aria-describedby="new-address-helper-text"
          />
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
            aria-describedby="new-password-helper-text"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseUpdate}
            variant="outlined"
            disabled={isUpdating}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.primary',
              borderColor: 'grey.400',
              '&:hover': {
                borderColor: 'grey.600',
                bgcolor: 'grey.100',
              },
            }}
            aria-label="Cancel profile update"
          >
            Cancel
          </Button>
          <Button
            onClick={updateProfile}
            variant="contained"
            color="primary"
            disabled={isUpdating}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1976d2, #1565c0)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                boxShadow: 4,
              },
            }}
            aria-label="Confirm profile update"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;