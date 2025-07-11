import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import React, { useState, useEffect} from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Avatar,
    Card,
    Chip,
    CardContent,
    CardHeader,
    Grid,
    Paper,
    Button,
    CircularProgress,
    Switch,
    FormControlLabel,
    Snackbar,
    Alert,
    Tooltip,
    Stack,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Article } from "@mui/icons-material";
import { motion } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";
import { dev_API_BASE_URL, publishArticle } from "../api/api_services";
import { generateArticlePreviews } from "../utility/article_preview_generator";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const profileSrc = `${dev_API_BASE_URL}${userProfile.profilePhoto}`|| "/avatar.png";
    //console.log(profileSrc);
    //const [articles, setArticles] = useState(userProfile.articles_submitted || []);
    const [articles, setArticles] = useState(null)
  useEffect(() => {
    const fetchUserArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${dev_API_BASE_URL}/articles/user_articles/`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
        });
        console.log(response.data);
        setArticles(response.data);
        //console.log(articles);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserArticles();
  }, []);


    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // "error" | "warning" | "info"
    });

    const previews = JSON.parse(sessionStorage.getItem("articlePreviews") || "{}");
    const navigate = useNavigate();
    const goToEditProfile = () => {
        navigate("/edit-profile");
  };

    const handleTogglePublish = async (articleId) => {
        try {
            let response = await publishArticle(articleId);
            //console.log(response)
            
            if (response.status === 200) {
                response = await response.json()
                const newStatus = response.pubstatus
                setArticles((prev) =>
                    prev.map((a) =>
                        a.id === articleId ? { ...a, published: newStatus } : a
                    )
                );

            setSnackbar({
                open: true,
                message: newStatus ? "Article published!" : "Article unpublished!",
                severity: "success",
            });
            } else {
                response = await response.json()
                setSnackbar({
                    open: true,
                    message: response.pubstatus || "Failed to update publish status.",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error("Toggle error:", error);
            setSnackbar({
                open: true,
                message: "An error occurred.",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleReadArticle = (article) => {
        navigate("/fileviewer", { state: { article } });
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ backgroundColor: "#c0d3d9", width: "100%", maxWidth: 1000, p: 2 }}>
                {/* Profile */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                   <Card 
      sx={{ 
        mb: 4, 
        p: 0, 
        maxWidth: 400, 
        mx: "auto", 
        borderRadius: 2, 
        boxShadow: 3 
      }} 
      elevation={3}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{ width: 80, height: 80 }}
            src={profileSrc}
            alt={userProfile.firstname || "U"}
          />
        }
        action={
          <Tooltip title="Edit profile">
            <IconButton onClick={goToEditProfile} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
        }
        title={
          <Typography variant="h6">
            {userProfile.firstname} {userProfile.lastname}
          </Typography>
        }
        sx={{
          pb: 0,
          "& .MuiCardHeader-content": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      />
      <CardContent sx={{ pt: 1 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {/* Insert subtitle or bio—e.g. job title or summary */}
            {/*userProfile.bio || "Your profile summary here."*/}
          </Typography>
        </Box>
      </CardContent>
    </Card>
                </motion.div>

                <Typography variant="h6" sx={{ mb: 2 }}>
                    Submitted Articles
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2} justifyContent="center">
                        {Array.isArray(articles) && articles.length > 0 ? (
                            articles.map((article, index) => (
                            <Grid  key={article.id} sx ={{width: { xs:200 , sm: 450, md:800, lg: 1000}}}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: "100%" }}>
                                        {article.cover_image && (
                                            <img
                                                src={`${dev_API_BASE_URL}/${article.cover_image}`}
                                                alt="cover"
                                                style={{ width: "100%", borderRadius: 8, marginBottom: 10 }}
                                            />
                                        )}
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            <Article sx={{ mr: 1 }} />
                                            {article.title}
                                        </Typography>

                                        {/* Authors */}
                                        {article.authors?.length > 0 && (
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="subtitle2">Authors:</Typography>
                                                {article.authors.map((a, i) => (
                                                    <Typography key={i} variant="body2" color="textSecondary">
                                                        {a.author.title} {a.author.firstname} {a.author.lastname} — {a.author.email}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        )}

                                        <Box justifyContent="center" sx={{ mb: 1 }}>
                                            <Chip
                                                label={article.published ? "Published" : "Unpublished"}
                                                color={article.published ? "success" : "warning"}
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                            <Chip
                                                label={article.reviewed ? "Reviewed" : "Not Reviewed"}
                                                color={article.reviewed ? "info" : "default"}
                                                size="small"
                                            />
                                        </Box>

                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            Submitted on: {new Date(article.created_at).toLocaleDateString()}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            onClick={() => handleReadArticle(article)}
                                        >
                                            Read Full Article
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            sx={{ mt: 1 }}
                                            onClick={() => {
                                                sessionStorage.setItem("articleToUpdate", JSON.stringify(article));
                                                sessionStorage.setItem("articleFormMethod", "PUT");
                                                navigate("/submission");
                                            }}
                                        >
                                            Update Article
                                        </Button>

                                        {article.reviewed && (
                                            <FormControlLabel
                                                sx={{ mt: 1 }}
                                                control={
                                                    <Switch
                                                        checked={article.published}
                                                        onChange={() => handleTogglePublish(article.id)}
                                                        color="success"
                                                    />
                                                }
                                                label={article.published ? "Unpublish" : "Publish"}
                                            />
                                        )}
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))):(
                        <Typography variant="body2" align="center">
                            No submitted articles found.
                        </Typography>
                        )}
                    </Grid>
                )}

                <Box textAlign="center" mt={4}>
                    <Button variant="contained" color="primary" size="large" component={RouterLink} to="/submission">
                        Submit New Article
                    </Button>
                </Box>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
