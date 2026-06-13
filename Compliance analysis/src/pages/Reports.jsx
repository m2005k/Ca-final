import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  IconButton
} from "@mui/material";
import api from "../api/api";
import { toast } from "react-toastify";
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/compliance/get-reports");
      setReports(response.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "success";
    if (score >= 75) return "warning";
    return "error";
  };

  // Stats calculation
  const totalReports = reports.length;
  const avgScore = reports.length > 0 ? Math.round(reports.reduce((acc, r) => acc + r.complianceScore, 0) / reports.length) : 0;
  const compliantCount = reports.filter(r => r.complianceScore >= 90).length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Compliance Reports
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your historical AI-generated compliance analysis reports.
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, borderLeft: '6px solid #1976d2' }}>
            <Typography variant="body2" color="text.secondary" fontWeight="bold">Total Scans</Typography>
            <Typography variant="h3" color="primary" fontWeight="bold">{loading ? "..." : totalReports}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, borderLeft: '6px solid #2e7d32' }}>
            <Typography variant="body2" color="text.secondary" fontWeight="bold">Avg. Compliance Score</Typography>
            <Typography variant="h3" color="success.main" fontWeight="bold">{loading ? "..." : `${avgScore}%`}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, borderLeft: '6px solid #9c27b0' }}>
            <Typography variant="body2" color="text.secondary" fontWeight="bold">Highly Compliant</Typography>
            <Typography variant="h3" color="secondary" fontWeight="bold">{loading ? "..." : compliantCount}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Reports List */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Recent Reports</Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : reports.length === 0 ? (
        <Paper elevation={1} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
          <AssessmentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No reports found.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid item xs={12} md={6} lg={4} key={report._id}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 2, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', cursor: 'pointer' }
                }}
                onClick={() => setSelectedReport(report)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ maxWidth: '70%' }} noWrap>
                      {report.product?.productName || "Unknown Product"}
                    </Typography>
                    <Chip 
                      label={`${report.complianceScore}%`} 
                      color={getScoreColor(report.complianceScore)} 
                      size="small" 
                      fontWeight="bold"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Framework:</strong> {report.framework?.name} ({report.framework?.shortCode})
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block">
                    {new Date(report.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal for viewing full report */}
      <Dialog 
        open={Boolean(selectedReport)} 
        onClose={() => setSelectedReport(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        {selectedReport && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#4c4b4bff' }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {selectedReport.product?.productName} - {selectedReport.framework?.shortCode} Report
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Generated on {new Date(selectedReport.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={`Score: ${selectedReport.complianceScore}%`} 
                  color={getScoreColor(selectedReport.complianceScore)} 
                  fontWeight="bold"
                />
                <IconButton onClick={() => setSelectedReport(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent dividers sx={{ p: 4, bgcolor: '#ffffff', color: '#333' }}>
              <Box sx={{ 
                  '& h1, & h2, & h3': { color: '#1976d2', mt: 3, mb: 2, fontWeight: 600 },
                  '& h4, & h5, & h6': { color: '#333', mt: 2, mb: 1, fontWeight: 600 },
                  '& p': { lineHeight: 1.8, mb: 2, color: '#424242' },
                  '& ul, & ol': { pl: 3, mb: 2, color: '#424242' },
                  '& li': { mb: 1 },
                  '& strong': { color: '#000' },
                  '& code': { bgcolor: '#f5f5f5', p: 0.5, borderRadius: 1, fontFamily: 'monospace' }
                }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedReport.reportText}
                  </ReactMarkdown>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Button onClick={() => setSelectedReport(null)} variant="contained" color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Reports;
