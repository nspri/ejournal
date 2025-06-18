import React, { useState } from "react";
import {
  Box, Card, CardContent, TextField, Avatar, Button,
  Typography, Snackbar, Alert, LinearProgress
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { dev_API_BASE_URL } from "../api/api_services";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register, handleSubmit, watch, formState: { errors }
  } = useForm({
    defaultValues: {
      title: userProfile.title || "",
      phonenumber: userProfile.phonenumber || "",
      firstname: userProfile.firstname || "",
      lastname: userProfile.lastname || "",
      email: userProfile.email || "",
      username: userProfile.username || "",
      profilePhoto: ""
    },
  });

  const previewUrl = watch("profilePhoto")?.[0]
    ? URL.createObjectURL(watch("profilePhoto")[0])
    : `${dev_API_BASE_URL}${userProfile.profilePhoto}`;

  const onSubmit = async (data) => {
const formData = new FormData();
formData.append("title", data.title);
formData.append("phonenumber", data.phonenumber);
formData.append("age", data.age || ""); // Add age field
formData.append("user.firstname", data.firstname);  // Use dot notation
formData.append("user.lastname", data.lastname);
formData.append("user.email", data.email);
formData.append("user.username", data.username);
if (data.profilePhoto?.[0]) {
  formData.append("image", data.profilePhoto[0]);
}

    try {
      const res = await axios.post(
        `${dev_API_BASE_URL}/user/profile/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
          onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded / e.total) * 100))
        }
      );
      setSnackbar({ open: true, severity: "success", message: "Profile updated!" });

      const updated = res.data;
      const urlObj = new URL(updated.profile.image);
      const pathOnly = urlObj.pathname;

      const old = JSON.parse(localStorage.getItem("userProfile")) || {};
      const merged = {
        ...old,
        title: updated.profile.title,
        phonenumber: updated.profile.phonenumber,
        firstname: updated.user.firstname,
        lastname: updated.user.lastname,
        email: updated.user.email,
        username: updated.user.username,
        profilePhoto: pathOnly,
        articles_submitted: old.articles_submitted || [],
      };

      localStorage.setItem("userProfile", JSON.stringify(merged));
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, severity: "error", message: "Update failed." });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Profile</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card elevation={3}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Avatar & Photo Upload */}
            {/* Avatar & Photo Upload */}
<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
  <Avatar src={previewUrl} sx={{ width: 80, height: 80, border: "2px solid", borderColor: "primary.main" }} />
  <Button variant="outlined" component="label">
    Choose Photo
    <input
      type="file"
      hidden
      accept="image/*"
      {...register("profilePhoto", {
        required: "Profile image is required",
        validate: {
          fileExists: files =>
            files?.length > 0 || "Please choose a photo",
        },
      })}
    />
  </Button>
</Box>

{errors.profilePhoto && (
  <Typography variant="caption" color="error">
    {errors.profilePhoto.message}
  </Typography>
)}

{uploadProgress > 0 && (
  <LinearProgress variant="determinate" value={uploadProgress} />
)}


            {/* Text Fields */}
            <TextField label="Title" fullWidth size="small" {...register("title")} />
            <TextField label="Phone Number" fullWidth size="small" {...register("phonenumber")} />
            <TextField label="First Name" fullWidth size="small"
              error={!!errors.firstname}
              helperText={errors.firstname && "Required"}
              {...register("firstname", { required: true })}
            />
            <TextField label="Last Name" fullWidth size="small"
              error={!!errors.lastname}
              helperText={errors.lastname && "Required"}
              {...register("lastname", { required: true })}
            />
            <TextField label="Email" type="email" fullWidth size="small"
              error={!!errors.email}
              helperText={errors.email && "Valid email required"}
              {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
            />
            <TextField label="Username" fullWidth size="small"
              error={!!errors.username}
              helperText={errors.username && "Required"}
              {...register("username", { required: true })}
            />

            {/* Action Buttons */}
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button onClick={() => navigate("/dashboard")} sx={{ mr: 1 }}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </Box>
          </CardContent>
        </Card>
      </form>

      {/* Notification Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
