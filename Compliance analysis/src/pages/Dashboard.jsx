import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { useAuth } from "../context/AuthContext.jsx";
import ShieldIcon from '@mui/icons-material/Shield';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StorageIcon from '@mui/icons-material/Storage';
import api from "../api/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    complianceScore: 0,
    frameworksCount: 0,
    productsCount: 0,
    loading: true
  });
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reportsRes, frameworksRes, productsRes] = await Promise.all([
        api.get("/compliance/get-reports"),
        api.get("/framework/get-frameworks"),
        api.get("/product/get-products")
      ]);

      const reports = reportsRes.data?.data || [];
      const frameworks = frameworksRes.data?.data || [];
      const products = productsRes.data?.data || [];

      // Calculate average score across all reports
      const avgScore = reports.length > 0 
        ? Math.round(reports.reduce((acc, r) => acc + r.complianceScore, 0) / reports.length) 
        : 0;

      setStats({
        complianceScore: avgScore,
        frameworksCount: frameworks.length,
        productsCount: products.length,
        loading: false
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Dashboard Overview
      </Typography>
      <Typography variant="body1" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, {user?.name || user?.userName || 'User'}. Here is your real-time compliance summary.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white' }}>
            <ShieldIcon sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
            <Typography variant="h6" fontWeight="500" sx={{ opacity: 0.9 }}>Overall Compliance Score</Typography>
            {stats.loading ? <CircularProgress color="inherit" sx={{ mt: 2 }} /> : (
              <Typography variant="h2" fontWeight="bold" sx={{ mt: 1 }}>{stats.complianceScore > 0 ? `${stats.complianceScore}%` : 'N/A'}</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
            <AssignmentIcon sx={{ fontSize: 50, mb: 2, color: 'primary.main', opacity: 0.9 }} />
            <Typography variant="h6" color="text.secondary" fontWeight="500">Active Frameworks</Typography>
            {stats.loading ? <CircularProgress sx={{ mt: 2 }} /> : (
              <Typography variant="h2" color="primary" fontWeight="bold" sx={{ mt: 1 }}>{stats.frameworksCount}</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
            <StorageIcon sx={{ fontSize: 50, mb: 2, color: 'secondary.main', opacity: 0.9 }} />
            <Typography variant="h6" color="text.secondary" fontWeight="500">Products Tracked</Typography>
            {stats.loading ? <CircularProgress sx={{ mt: 2, color: 'secondary.main' }} /> : (
              <Typography variant="h2" color="secondary" fontWeight="bold" sx={{ mt: 1 }}>{stats.productsCount}</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;