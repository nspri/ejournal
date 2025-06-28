import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';
import { dev_API_BASE_URL } from '../api/api_services';


const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError('');

    try {
      // Replace with your actual API endpoint
      const res = await axios.post(`${dev_API_BASE_URL}/user/api/password_reset/`, { email });
      if (res.status === 200) {
        setSubmitted(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to send password reset request. Please try again.'
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Reset Your Password
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enter your email and we'll send you a link to reset your password.
        </Typography>

        {submitted && <Alert severity="success">Reset link sent! Check your email.</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 2,
              input: { color: 'white' },                    // Input text color
              label: { color: 'white' },                    // Label color
              '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',                     // Default border
              },
              '&:hover fieldset': {
                borderColor: 'white',                     // Hover border
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',                     // Focus border
              },
            },
          }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Send Reset Link
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PasswordResetRequest;
