import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Reduxwork/userSlice'; // ✅ Make sure the path is correct

const Profile = () => {
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
          backgroundColor: 'background.paper',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const { userData } = user;
  const { name, email, role, mobile } = userData;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        padding: 3,
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '2.5rem',
            }}
          >
            Profile
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />

          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                Name:
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                {name}
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                Email:
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                {email}
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                Role:
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                {role}
              </Typography>
            </Grid>

            {mobile && (
              <Grid item>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                  Mobile:
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                  {mobile}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Box sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogout}
              sx={{
                borderRadius: 20,
                padding: '12px 0',
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
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
