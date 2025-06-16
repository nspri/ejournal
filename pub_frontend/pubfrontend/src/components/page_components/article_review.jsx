import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Divider,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import { fetch_articles_to_review, dev_API_BASE_URL } from "../api/api_services";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { renderAsync } from "docx-preview";
import { useNavigate } from "react-router-dom";


function ArticleReviewList() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const docxContainerRef = useRef(null);
  const isStaff = sessionStorage.getItem("is_staff") === "true";

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const getArticles = async () => {
      try {
        const result = await fetch_articles_to_review("articles/articles2review/");
        setArticles(result);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    if (isStaff) {
      getArticles();
    }
  }, [isStaff]);

  useEffect(() => {
    const renderDocx = async () => {
      if (
        selectedArticle &&
        selectedArticle.file &&
        selectedArticle.file.endsWith(".docx")
      ) {
        setLoadingPreview(true);
        try {
          const res = await fetch(new URL(selectedArticle.file, dev_API_BASE_URL).href);
          const blob = await res.blob();
          if (docxContainerRef.current) {
            docxContainerRef.current.innerHTML = "";
            await renderAsync(blob, docxContainerRef.current);
          }
        } catch (err) {
          console.error("Failed to load DOCX file", err);
        } finally {
          setLoadingPreview(false);
        }
      }
    };

    renderDocx();
  }, [selectedArticle]);

  const navigate = useNavigate();

  const handleSelect = (article) => {
    navigate(`/review/${article.id}`, { state: { article } });
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      alert("Please write a review first.");
      return;
    }

    console.log("Review submitted:", {
      articleId: selectedArticle.id,
      review: reviewText,
    });

    alert("Review submitted!");
    setSelectedArticle(null);
    setReviewText("");
  };

  if (!isStaff) {
    return <Typography>You do not have permission to review articles.</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Articles for Review
      </Typography>

      <Stack spacing={3}>
        {articles.length === 0 ? (
          <Typography>No articles available for review.</Typography>
        ) : (
          articles.map((article) => (
            <Card key={article.id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{article.title}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Authors:{" "}
                  {article.authors
                    .map((entry) => {
                      const { firstname, lastname } = entry.author;
                      return `${firstname} ${lastname}`;
                    })
                    .join(", ")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Submitted on: {new Date(article.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleSelect(article)}>
                  Review This Article
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Stack>

      {selectedArticle && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" gutterBottom>
            Reviewing: {selectedArticle.title}
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Preview
            </Typography>

            {loadingPreview ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : selectedArticle.file?.endsWith(".pdf") ? (
              <Box sx={{ height: "75vh", width: "100%" }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={new URL(selectedArticle.file, dev_API_BASE_URL).href}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              </Box>
            ) : selectedArticle.file?.endsWith(".docx") ? (
              <Box
                ref={docxContainerRef}
                sx={{
                  minHeight: "400px",
                  maxHeight: "75vh",
                  overflow: "auto",
                  backgroundColor: "#fafafa",
                  p: 2,
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <Typography color="text.secondary">
                Unsupported file type: {selectedArticle.file}
              </Typography>
            )}
          </Paper>

          <TextField
            fullWidth
            multiline
            minRows={6}
            label="Write your review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleSubmitReview}>
              Submit Review
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setSelectedArticle(null);
                setReviewText("");
              }}
            >
              Cancel Review
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}

export default ArticleReviewList;
