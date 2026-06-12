import React from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom color="text.secondary">
        Welcome back, {user?.name || user?.userName || 'User'}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6">Compliance Score</Typography>
            <Typography variant="h2" color="primary" fontWeight="bold">85%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6">Pending Tasks</Typography>
            <Typography variant="h2" color="secondary" fontWeight="bold">12</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6">Active Policies</Typography>
            <Typography variant="h2" fontWeight="bold">24</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;