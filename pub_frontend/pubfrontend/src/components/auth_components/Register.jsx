// src/RegistrationForm.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  InputLabel,
  FormControl,
  CircularProgress,
  Input,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { post_encryped_data } from "../api/api_services";
import logo from '../assets/logo.JPG';


const Registration = () => {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    dateOfBirth: "",
    title: "",
    age: "",
    image: null,
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start the loader
    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      alert("Passwords do not match!");
      window.alert("Passwords do not match!");
      return;
    }
    else {
      //const data = new FormData();
      //const profile = new FormData();
      let base64Image = null;
      const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      };
      let data = {}
      data = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        profile: {
          phonenumber: formData.phonenumber,
          age: formData.age,
          date_of_birth: formData.dateOfBirth,
          title: formData.title,
        },
      };
      // If image is provided, convert it to base64
      if (formData.image) {
        base64Image = await convertToBase64(formData.image);
        data.profile.image = base64Image;
      }
      //data.append("image", formData.image);  //Attach the image file

      try {
        // Sending the POST request
        const response = await post_encryped_data(data, '/user/signup/')

        if (response.ok) {
          const result = await response.json();
          // Handle success (show a success message, navigate, etc.)
          navigate("/login");
        } else {
          const result = await response.json();
          setIsLoading(false);
          console.error("Failed to submit:", result.data);
          let errorMessage = '';
          alert(`Submission Failed:\n${errorMessage}`);
          navigate("/registration");
          // Handle error (show an error message, etc.)
        }
      } catch (error) {
        console.error("Error during submission:", error);

        // Handle error
      } finally {
        setIsLoading(false); // Stop the loader
      }

    }
  };
  // Here you would typically send formData to the server or handle validation


  //if (isLoading) {
  //  return (
  //    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
  //      <CircularProgress />
  //    </Box>
  //  );
  //}
  return (
    <>
      {isLoading && (
        <div style={overlayStyle}>
          <CircularProgress />
        </div>
      )}
      <Box
        sx={{
          backgroundColor: '#c0d3d9',  // Vertically center /
        }}
      >
        <Box
          sx={{
            filter: isLoading ? "blur(5px)" : "none",
            display: 'flex',
            justifyContent: 'center', // Horizontally center
            alignItems: 'center', // Vertically center /
          }}
        >
          <Box
            component="img"
            src={logo} // Update with the correct path to your image
            alt="Website Logo"
            sx={{ width: 200, height: 200, mb: 3 }} // Adjust the width, height, and margin as needed
          />
        </Box>
        <Container maxWidth="sm">
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Registration
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
              {/* Password Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Confirm Password Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Age"
                  variant="outlined"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Box height={10}></Box>
            <Box direction="row" alignItems="center">
              <FormControl>
                <Box alignItems="center">
                  <Button
                    variant="contained"
                    component="label"
                    color="primary"
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </Button>
                  {formData.image && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {formData.image.name}
                    </Typography>
                  )}
                </Box>
              </FormControl>
              <Box height={10}></Box>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Registration;
