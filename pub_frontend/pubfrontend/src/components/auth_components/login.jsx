// src/Login.js
import { Link } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Container, Paper, Box, Snackbar, Alert, CircularProgress, } from '@mui/material';
import { styled } from '@mui/material/styles'; // Replace makeStyles with styled
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../providers/AuthContext';
import { loginUser } from '../api/api_services';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  margin: 'auto',
}));
import logo from "../../assets/logo.JPG";


const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const Login = () => {
  const { login } = useContext(AuthContext); // Access login function and isLoggedIn state
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser(email, password)
      //const response = await axios.post('https://npvbackend.onrender.com/user/login/', {
      //email,
      //password,
      //});

      // Handle the response, e.g., save token, redirect
      //console.log('Login success:', response);
      // Save the JWT token in session storage after receiving it
      const accessToken = response.tokens.access;
      const refreshToken = response.tokens.refresh;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);

      // Store additional user information if needed
      const userProfile = {
        username: response.username,
        email: response.email,
        age: response.age,
        dateOfBirth: response.date_of_birth,
        profilePhoto: response.profilephoto,  // Base64 encoded image
      };

      // Convert the object to a JSON string and store it
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      const storedUserProfile = JSON.parse(localStorage.getItem('userProfile'));
      //if (storedUserProfile) {
      //    console.log(storedUserProfile.username);  // Access the data
      //    console.log(storedUserProfile.email);
      //    console.log(storedUserProfile.age);
      //    console.log(storedUserProfile.dateOfBirth);
      //    console.log(storedUserProfile.profilePhoto);  // Access the base64 image string
      //}


      // Log user profile data (optional)
      //console.log('User Profile:', userProfile);

      // Use the token when needed
      //const storedToken = sessionStorage.getItem('accessToken');
      //const storedrefreshToken = sessionStorage.getItem('refreshToken');
      //console.log("refresh token",storedrefreshToken);
      //console.log('Stored Token:', storedToken);
      login();
      navigate("/");


    } catch (error) {
      // Handle error, e.g., invalid credentials
      console.error('Error during login:', error);
      //throw new Error();
      setError('Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#c0d3d9',
          height: '100vh',  // Vertically center /
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Horizontally center
            alignItems: 'center', // Vertically center /
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Website Logo"
            sx={{ width: 200, height: 200, mb: 3 }} // Adjust the width, height, and margin as needed
          />
        </Box>
        <Container>
          <StyledPaper elevation={3}>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <StyledForm onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                {isLoading ? (
                  <CircularProgress size={24} style={{ color: "white" }} />
                ) : (
                  "Sign In"
                )}
              </StyledButton>
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                component={Link}
                to="/register"
              >
                Register
              </StyledButton>
              <StyledButton
                fullWidth
                variant="text"
                color="primary"
                href="https://npvbackend.onrender.com/password-reset/"  // Django URL here
              >
                Forgot Password?
              </StyledButton>
            </StyledForm>
          </StyledPaper>
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert onClose={() => setError(null)} severity="error">
              {error}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  );
};

export default Login;
