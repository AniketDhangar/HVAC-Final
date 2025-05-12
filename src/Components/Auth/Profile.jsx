import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Grid,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Reduxwork/userSlice';

const Profile = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  if (!user || !user.userData) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.paper',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const { name, email, role, mobile } = user.userData;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 550, width: '100%', borderRadius: 4, boxShadow: 4 }}>
        <CardContent sx={{ p: theme.spacing(4) }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}
          >
            User Profile
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {[['Name', name], ['Email', email], ['Role', role], ['Mobile', mobile]].map(
              ([label, value], idx) =>
                value && (
                  <Grid item xs={12} key={idx}>
                    <Grid container>
                      <Grid item xs={4}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, fontSize: '1.1rem' }}
                        >
                          {label}:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography
                          variant="body1"
                          sx={{ color: 'text.secondary', fontSize: '1.05rem' }}
                        >
                          {value}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )
            )}
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogout}
              sx={{
                borderRadius: 30,
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: 2,
              }}
            >
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
  