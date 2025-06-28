import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { dev_API_BASE_URL } from "../api/api_services";
import { useNavigate } from "react-router-dom";

const PasswordResetConfirm = () => {
  const [params] = useSearchParams();
  const token = params.get("token"); // or 'uid' + 'token' if your backend uses both
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${dev_API_BASE_URL}/user/api/password_reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setSuccess(true);
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data?.detail || "Password reset failed.");
      }
    } catch {
      setError("An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Set New Password
        </Typography>

        {success ? (
          <Alert severity="success" sx={{ mt: 3 }}>
            Password has been reset successfully. You may now log in.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              required
              value={confirmPassword}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Reset Password"}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PasswordResetConfirm;
