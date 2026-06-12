import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAppTheme } from "../../context/ThemeContext.jsx";
import { toast } from "react-toastify";

const Signin = () => {
  const { mode } = useAppTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData);
      if (response.status === 200) {
        toast.success("Signin successful!");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const isDark = mode === 'dark';
  const primaryColor = '#2563eb';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const secondaryTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: bgColor,
      padding: '20px',
      fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif'
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      padding: '40px',
      backgroundColor: cardBg,
      borderRadius: '20px',
      boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.04)',
      border: `1px solid ${borderColor}`,
      textAlign: 'center'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '800',
      color: textColor,
      marginBottom: '8px',
      letterSpacing: '-1px'
    },
    subtitle: {
      fontSize: '15px',
      color: secondaryTextColor
    },
    formStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '32px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left'
    },
    label: {
      marginBottom: '6px',
      fontSize: '13px',
      fontWeight: '600',
      color: textColor,
      opacity: 0.8
    },
    input: {
      height: '48px',
      padding: '0 16px',
      borderRadius: '10px',
      border: `1px solid ${borderColor}`,
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      color: textColor,
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      width: '100%',
      boxSizing: 'border-box'
    },
    button: {
      backgroundColor: primaryColor,
      color: '#ffffff',
      padding: '14px 40px',
      borderRadius: '25px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      width: '100%',
      transition: 'background-color 0.2s'
    },
    footer: {
      marginTop: '24px',
      fontSize: '14px',
      color: secondaryTextColor
    },
    error: {
      color: '#ef4444',
      fontSize: '13px',
      marginBottom: '20px',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account.</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formStack}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = primaryColor}
                onBlur={(e) => e.target.style.borderColor = borderColor}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = primaryColor}
                onBlur={(e) => e.target.style.borderColor = borderColor}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account? <Link to="/signup" style={{color: primaryColor, textDecoration: 'none', fontWeight: '700'}}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;