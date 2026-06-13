import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import api from "../api/api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ComplianceEngine = () => {
  const [products, setProducts] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productRes, frameworkRes] = await Promise.all([
        api.get("/product/get-products"),
        api.get("/framework/get-frameworks")
      ]);
      setProducts(productRes.data?.data || []);
      setFrameworks(frameworkRes.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products and frameworks");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedProduct || !selectedFramework) {
      toast.warning("Please select both a Product and a Framework");
      return;
    }

    setLoading(true);
    setReport("");
    try {
      const response = await api.post(
        "/compliance/analyze",
        {
          productId: selectedProduct,
          frameworkId: selectedFramework,
        }
      );
      
      setReport(response.data?.data?.report);
      toast.success("Compliance report generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon fontSize="large" /> Compliance Engine
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select a product and a regulatory framework to perform an AI-powered RAG analysis.
      </Typography>

      <Grid container spacing={4}>
        {/* Controls Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" fontWeight="600" mb={3}>
              Analysis Parameters
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="product-select-label">Select Product</InputLabel>
              <Select
                labelId="product-select-label"
                value={selectedProduct}
                label="Select Product"
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {products.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.productName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="framework-select-label">Select Framework</InputLabel>
              <Select
                labelId="framework-select-label"
                value={selectedFramework}
                label="Select Framework"
                onChange={(e) => setSelectedFramework(e.target.value)}
              >
                {frameworks.map((f) => (
                  <MenuItem key={f._id} value={f._id}>
                    {f.name} ({f.shortCode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleAnalyze}
              disabled={loading || !selectedProduct || !selectedFramework}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1.05rem', boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}
            >
              {loading ? "Generating Report..." : "Analyze Compliance"}
            </Button>
          </Paper>
        </Grid>

        {/* Report Section */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2, 
              minHeight: '60vh',
              background: report ? '#ffffff' : '#f8f9fa',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {!report && !loading && (
              <Box sx={{ m: 'auto', textAlign: 'center', opacity: 0.6 }}>
                <AutoAwesomeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" color="text.secondary">
                  Ready for Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Configure your parameters on the left and run the AI engine.
                </Typography>
              </Box>
            )}

            {loading && (
              <Box sx={{ m: 'auto', textAlign: 'center' }}>
                <CircularProgress size={50} sx={{ mb: 3 }} />
                <Typography variant="h6" color="primary" sx={{ animation: 'pulse 1.5s infinite' }}>
                  Querying Vector Database & Analyzing...
                </Typography>
              </Box>
            )}

            {report && !loading && (
              <Box className="markdown-body">
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  AI Compliance Analysis Report
                </Typography>
                <Divider sx={{ mb: 4 }} />
                <Box sx={{ 
                  '& h1, & h2, & h3': { color: '#1a237e', mt: 4, mb: 2, fontWeight: 600 },
                  '& p': { lineHeight: 1.8, mb: 2, color: '#333' },
                  '& ul': { pl: 3, mb: 2, color: '#333' },
                  '& li': { mb: 1 },
                  '& strong': { color: '#000' }
                }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {report}
                  </ReactMarkdown>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComplianceEngine;
