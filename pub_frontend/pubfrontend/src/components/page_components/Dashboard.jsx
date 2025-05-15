import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Card,
    Chip,
    CardContent,
    Grid,
    Paper,
    Button,
    CircularProgress
} from "@mui/material";
import { Article } from "@mui/icons-material";
import { motion } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";
import * as mammoth from "mammoth";
import { dev_API_BASE_URL } from "../api/api_services";
import { generateArticlePreviews } from "../utility/article_preview_generator";

// Configure PDFJS worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function Dashboard() {
    //const [previews, setPreviews] = useState({});
    const [loading, setLoading] = useState(false);


    const storedUserProfile = JSON.parse(localStorage.getItem("userProfile")) || {
        firstname: "John",
        lastname: "Doe",
        email: "example@example.com",
        articles_submitted: [],
    };
    //const previews = {}
    const previews = JSON.parse(sessionStorage.getItem("articlePreviews") || "{}");
    const navigate = useNavigate();
    console.log(storedUserProfile.articles_submitted

    )


    // 🛠️ Fetch previews only once when the component mounts
    //useEffect(() => {
    //    const loadPreviews = async () => {
    //        setLoading(true);
    //        try {
    //            const previewsMap = await generateArticlePreviews(storedUserProfile.articles_submitted);
    //            setPreviews(previewsMap);
    //        } catch (error) {
    //            console.error("Error generating previews:", error);
    //        } finally {
    //                setLoading(false);
    //           }
    //      };

    //loadPreviews();
    //}, [storedUserProfile.articles_submitted]);
    //sessionStorage.setItem("articlePreviews", JSON.stringify(previewsMap));
    //setPreviews(previewsMap);

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",         // vertically center content
            justifyContent: "center",     // horizontally center conten
        }}
        >
            <Box sx={{
                backgroundColor: "#c0d3d9",
                width: {
                    xs: "10",   // 100% width on extra-small screens (mobile)
                    sm: "10",    // 80% on small screens
                    md: "10",    // 60% on medium screens
                    lg: "10"     // 40% on large screens
                }
            }}>
                {/* Profile Card */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card sx={{ mb: 4, p: 2 }} elevation={3}>
                        <CardContent sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ width: 80, height: 80, mr: 2 }} src="/avatar.png" />
                            <Box sx={{ ml: 'auto' }}>
                                <Typography variant="h5">{`${storedUserProfile.firstname} ${storedUserProfile.lastname}`}</Typography>
                                <Typography color="textSecondary">{storedUserProfile.email}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Articles Section */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Submitted Articles
                </Typography>

                {loading ? (

                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {storedUserProfile.articles_submitted.map((article, index) => (
                            <Grid item xs={12} sm={6} md={4} key={article.id}>
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
                                        {article.authors && article.authors.length > 0 && (
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="subtitle2">Authors:</Typography>
                                                {article.authors.map((a, i) => (
                                                    <Typography key={i} variant="body2" color="textSecondary">
                                                        {a.author.title} {a.author.firstname} {a.author.lastname} — {a.author.email}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        )}
                                        <Box justifyContent="center">
                                            <Chip
                                                label={article.published ? 'Published' : 'Unpublished'}
                                                color={article.published ? 'success' : 'warning'}
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                            <Chip
                                                label={article.reviewed ? 'Reviewed' : 'Not Reviewed'}
                                                color={article.reviewed ? 'info' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            Submitted on: {new Date(article.created_at).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {previews[article.id] || "Generating preview..."}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            href={article.file}
                                            //target="_blank"
                                            fullWidth
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

                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Submit New Article Button */}
                <Box textAlign="center" mt={4}>
                    <Button variant="contained" color="primary" size="large">
                        Submit New Article
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
