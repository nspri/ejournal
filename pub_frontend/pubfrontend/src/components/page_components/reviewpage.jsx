import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Card,
  CardContent,
  Switch, FormControlLabel
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArticleIcon from "@mui/icons-material/Article";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { renderAsync } from "docx-preview";
import { dev_API_BASE_URL } from "../api/api_services";

// PDF Viewer styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";

function ReviewPage() {
  const { state } = useLocation();
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [approve, setApprove] = useState(null); // true = approve, false = disapprove, null = unset
  const [reviewText, setReviewText] = useState("");
  const [reviewFile, setReviewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const docxRef = useRef(null);

  const article = state?.article;
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar, toolbarPluginProps } = toolbarPluginInstance;

  useEffect(() => {
    const renderDocx = async () => {
      if (article?.file?.endsWith(".docx")) {
        setLoading(true);
        try {
          const res = await fetch(new URL(article.file, dev_API_BASE_URL).href);
          const blob = await res.blob();
          if (docxRef.current) {
            docxRef.current.innerHTML = "";
            await renderAsync(blob, docxRef.current);
          }
        } catch (err) {
          console.error("DOCX load failed", err);
        } finally {
          setLoading(false);
        }
      }
    };

    renderDocx();
  }, [article]);

  const handleSubmit = async () => {
    console.log(approve)
  if (!reviewText.trim() && !reviewFile) {
    alert("Please enter a review or upload a review file.");
    return;
  }

  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    alert("You must be logged in to submit a review.");
    return;
  }
  

  const formData = new FormData();
  formData.append("article", articleId);        // article ID as integer/string
  formData.append("review_text", reviewText);   // review text
  formData.append("approved", approve);
  if (reviewFile) {
    formData.append("review_file", reviewFile); // file object from input
  }

  try {
    const response = await fetch(`${dev_API_BASE_URL}/articles/review_submissions/`,{
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // no Content-Type header! Let browser set it
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      alert(`Failed to submit review: ${err}`);
      return;
    }

    alert("Review submitted!");
    navigate("/");

  } catch (error) {
    console.error("Error submitting review:", error);
    alert("An error occurred.");
  }
};



  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setReviewFile(file);
  };

  if (!article) return <Typography>Invalid article or missing data.</Typography>;

  return (
    <Box 
      sx={{ 
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
        width: { xs:200 , sm: 450, md:500, lg: 1000}
        
      }}
    >
              <Box
        sx={{
          maxWidth: "95vw",
          width: "100%",
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              color: "#1e293b",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 2
            }}
          >
            <RateReviewIcon sx={{ fontSize: "inherit", color: "#3b82f6" }} />
            Review Article
          </Typography>
          <Typography variant="h5" sx={{ color: "#64748b", fontWeight: 400 }}>
            {article.title}
          </Typography>
          <Chip 
            label={article.file.split('.').pop().toUpperCase()} 
            color="primary" 
            size="small" 
            sx={{ mt: 1 }}
          />
        </Box>

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
            p: 0,
            backgroundColor: "transparent",
            borderRadius: 3,
          }}
        >
          {/* Article Preview */}
          <Card
            sx={{
              flex: { lg: "1 1 92%" },
              minWidth: 0,
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                mb: 2
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <ArticleIcon sx={{ color: "#3b82f6" }} />
                  Article Preview
                </Typography>
                {article.file.endsWith(".pdf") && (
                  <>
                    <IconButton 
                      onClick={handleMenuOpen}
                      sx={{
                        backgroundColor: "#f1f5f9",
                        "&:hover": { backgroundColor: "#e2e8f0" }
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                      PaperProps={{
                        elevation: 8,
                        sx: {
                          borderRadius: 2,
                          border: "1px solid #e2e8f0",
                        }
                      }}
                    >
                      <Toolbar>
                        {(slots) => (
                          <>
                            <MenuItem onClick={handleMenuClose}>{slots.ZoomIn()}</MenuItem>
                            <MenuItem onClick={handleMenuClose}>{slots.ZoomOut()}</MenuItem>
                            <MenuItem onClick={handleMenuClose}>{slots.GoToPreviousPage()}</MenuItem>
                            <MenuItem onClick={handleMenuClose}>{slots.GoToNextPage()}</MenuItem>
                            <MenuItem onClick={handleMenuClose}>{slots.Download()}</MenuItem>
                            <MenuItem onClick={handleMenuClose}>{slots.Print()}</MenuItem>
                          </>
                        )}
                      </Toolbar>
                    </Menu>
                  </>
                )}
              </Box>

              {loading ? (
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center",
                  py: 8,
                  flexDirection: "column",
                  gap: 2
                }}>
                  <CircularProgress size={48} thickness={4} />
                  <Typography color="text.secondary">Loading document...</Typography>
                </Box>
              ) : article.file.endsWith(".pdf") ? (
                <Box sx={{ 
                  height: "88vh",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #e2e8f0"
                }}>
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer
                      fileUrl={new URL(article.file, dev_API_BASE_URL).href}
                      plugins={[toolbarPluginInstance]}
                    />
                  </Worker>
                </Box>
              ) : article.file.endsWith(".docx") ? (
                <Box
                  ref={docxRef}
                  sx={{
                    maxHeight: "88vh",
                    overflow: "auto",
                    backgroundColor: "#ffffff",
                    p: 3,
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    boxShadow: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
                  }}
                />
              ) : (
                <Box sx={{ 
                  textAlign: "center", 
                  py: 8,
                  color: "#64748b"
                }}>
                  <ArticleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography>Unsupported file type</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Review Form */}
          <Card
            sx={{
              flex: { lg: "1 1 8%" },
              minWidth: { xs: "100%", lg: "280px" },
              maxWidth: { xs: "100%", lg: "320px" },
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              height: "fit-content",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: "#1e293b",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <RateReviewIcon sx={{ color: "#3b82f6" }} />
                Write Your Review
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={10}
                label="Enter your detailed review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                sx={{ 
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#ffffff",
                    }
                  }
                }}
                placeholder="Provide your comprehensive review, feedback, and suggestions..."
              />

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#374151",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <CloudUploadIcon sx={{ color: "#3b82f6" }} />
                  Upload Review File
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Alternatively, upload a review document (PDF or DOCX)
                </Typography>
                
                <Box
                  component="label"
                  sx={{
                    display: "block",
                    p: 3,
                    border: "2px dashed #cbd5e1",
                    borderRadius: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    backgroundColor: "#f8fafc",
                    "&:hover": {
                      borderColor: "#3b82f6",
                      backgroundColor: "#eff6ff",
                    },
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  <CloudUploadIcon sx={{ fontSize: 32, color: "#64748b", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {reviewFile ? reviewFile.name : "Click to upload file"}
                  </Typography>
                </Box>
              </Box>
              <FormControlLabel
    control={
      <Switch
        checked={approve === true}
        onChange={(e) => setApprove(e.target.checked)}
        color="success"
      />
    }
    label="Approve"
    labelPlacement="start"
    sx={{
      ml: 1,
      mr: 1,
      flex: 1,
      fontWeight: 600,
      ".MuiFormControlLabel-label": {
        fontWeight: 600,
        fontSize: "1rem",
      },
    }}
  />

              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    "&:hover": {
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }
                  }}
                >
                  Submit Review
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    borderColor: "#d1d5db",
                    color: "#6b7280",
                    "&:hover": {
                      borderColor: "#9ca3af",
                      backgroundColor: "#f9fafb",
                    }
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Paper>
      </Box>
    </Box>
  );
}

export default ReviewPage;