// src/pages/ArticleList.jsx
// src/pages/ArticleList.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    Stack,
    Pagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { dev_API_BASE_URL } from "../api/api_services";
import { Description, CheckCircle, Schedule, CalendarToday } from "@mui/icons-material";

const ARTICLES_PER_PAGE = 5;

function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch(`${dev_API_BASE_URL}/articles/articles/`);
                if (!res.ok) throw new Error("Failed to fetch articles");
                const data = await res.json();
                setArticles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const getStatusChip = (article) => {
        if (article?.published) {
            return <Chip icon={<CheckCircle />} label="Published" color="success" size="small" />;
        } else if (article?.reviewed) {
            return <Chip icon={<CheckCircle />} label="Reviewed" color="info" size="small" />;
        } else {
            return <Chip icon={<Schedule />} label="Under Review" color="warning" size="small" />;
        }
    };

    const paginatedArticles = articles.slice(
        (page - 1) * ARTICLES_PER_PAGE,
        page * ARTICLES_PER_PAGE
    );

    const handleClick = (article) => {
        navigate("/fileviewer", { state: { article } });
    };

    const handlePageChange = (_, value) => setPage(value);

    if (loading) {
        return (
            <Container sx={{ mt: 8, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="body1" mt={2}>Loading articles...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 8, textAlign: "center" }}>
                <Typography variant="h6" color="error">Error: {error}</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{width: { xs:200 , sm: 450, md:500, lg: 1000 }}}>
            <Typography variant="h4" gutterBottom>Articles</Typography>

            <Stack spacing={3}>
                {paginatedArticles.map((article) => (
                    <Card
                        key={article.id}
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            boxShadow: 2,
                            borderRadius: 2,
                            overflow: 'hidden',
                            height: 160, // consistent height like a meter rule
                        }}
                    >
                        {article.cover_image ? (
                            <CardMedia
                                component="img"
                                image={`${dev_API_BASE_URL}${article.cover_image}`}
                                alt={article.title}
                                sx={{
                                    width: 160,
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: 160,
                                    height: '100%',
                                    bgcolor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontStyle: 'italic',
                                    color: 'gray'
                                }}
                            >
                                No Image
                            </Box>
                        )}

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                px: 3,
                                py: 2,
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="h6" fontWeight="bold" noWrap>
                                    <Description sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }} />
                                    {article.title}
                                </Typography>

                                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                    {getStatusChip(article)}
                                    <Chip
                                        icon={<CalendarToday fontSize="small" />}
                                        label={new Date(article.created_at).toLocaleDateString()}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Stack>
                            </Box>

                            <Button
                                variant="contained"
                                size="medium"
                                onClick={() => handleClick(article)}
                                sx={{
                                    ml: 3,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                }}
                            >
                                Read
                            </Button>
                        </Box>
                    </Card>
                ))}
            </Stack>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Pagination
                    count={Math.ceil(articles.length / ARTICLES_PER_PAGE)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Container>
    );
}

export default ArticleList;
