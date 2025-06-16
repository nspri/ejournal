import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    IconButton,
    Chip,
    LinearProgress,
    Alert,
    Fab,
    Zoom,
    useTheme,
    alpha,
    Menu,
    MenuItem,
    Card,
    CardContent
} from "@mui/material";
import {
    Description,
    Download,
    ErrorOutline,
    CheckCircle,
    Schedule,
    MoreVert
} from "@mui/icons-material";
import { renderAsync } from "docx-preview";
import { dev_API_BASE_URL } from "../api/api_services";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";

// ... all imports remain the same ...

export default function DocumentViewer() {
    const { state } = useLocation();
    const article = state?.article;
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [documentType, setDocumentType] = useState(null);
    const [fileName, setFileName] = useState("Document");
    const [fileUrl, setFileUrl] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const docxRef = useRef(null);

    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    useEffect(() => {
        if (article) {
            loadDocument();
        } else {
            setError("No article data provided");
            setLoading(false);
        }
    }, [article]);

    const loadDocument = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!article.file) {
                throw new Error("No file attached to this article");
            }

            const fullFileUrl = new URL(article.file, dev_API_BASE_URL).href;
            const fileName = article.file.split('/').pop() || article.title || "Document";
            const extension = fileName.toLowerCase().split('.').pop();

            setFileName(fileName);
            setFileUrl(fullFileUrl);

            if (extension === "pdf") {
                setDocumentType("pdf");
            } else if (extension === "docx") {
                setDocumentType("docx");
                await loadDocxDocument(fullFileUrl);
            } else {
                throw new Error(`Unsupported document type: ${extension}.`);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadDocxDocument = async (fileUrl) => {
        try {
            const res = await fetch(fileUrl);
            if (!res.ok) throw new Error(`Failed to fetch DOCX: ${res.status}`);
            const blob = await res.blob();
            if (docxRef.current) {
                docxRef.current.innerHTML = "";
                await renderAsync(blob, docxRef.current);
            }
        } catch (err) {
            throw new Error("Failed to load DOCX: " + err.message);
        }
    };

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleDownload = () => {
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            link.target = '_blank';
            link.click();
        }
    };

    const getStatusChip = () => {
        if (article?.published) {
            return <Chip icon={<CheckCircle />} label="Published" color="success" size="small" />;
        } else if (article?.reviewed) {
            return <Chip icon={<CheckCircle />} label="Reviewed" color="info" size="small" />;
        } else {
            return <Chip icon={<Schedule />} label="Under Review" color="warning" size="small" />;
        }
    };

    const paperBackground = isDarkMode ? "#1e293b" : "#ffffff";
    const previewBackground = isDarkMode ? "#0f172a" : "#f9fafb";
    const textColor = isDarkMode ? "#f1f5f9" : "#1e293b";
    const borderColor = isDarkMode ? "#334155" : "#e5e7eb";

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Container maxWidth="sm">
                    <Box sx={{
                        textAlign: 'center',
                        p: 6,
                        borderRadius: 4,
                        background: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}>
                        <LinearProgress sx={{ mb: 3 }} />
                        <Typography variant="h5" fontWeight={600}>
                            Loading Document
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Preparing "{article?.title || 'document'}"...
                        </Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Container maxWidth="sm">
                    <Alert
                        severity="error"
                        icon={<ErrorOutline />}
                        sx={{
                            borderRadius: 3,
                            boxShadow: theme.shadows[6],
                            backgroundColor: isDarkMode ? "#1e1e1e" : undefined
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Document Load Error
                        </Typography>
                        {error}
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: previewBackground, py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
                <Zoom in={!loading}>
                    <Fab
                        onClick={handleDownload}
                        sx={{
                            background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                            color: 'white',
                            '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 12px 32px ${alpha(theme.palette.secondary.main, 0.4)}`
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Download />
                    </Fab>
                </Zoom>
            </Box>

            <Container sx={{width: { xs:300 , sm: 450, md: 1000 }}}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: textColor, mb: 1 }}>
                        <Description sx={{ verticalAlign: "middle", mr: 1, color: "#3b82f6" }} />
                        {article?.title || "Document Viewer"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Chip label={documentType?.toUpperCase() || "DOC"} color="primary" size="small" />
                        {getStatusChip()}
                    </Box>
                </Box>

                <Card
                    sx={{
                        borderRadius: 3,
                        backgroundColor: paperBackground,
                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
                        border: "none"
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: textColor }}>
                                <Description sx={{ color: "#3b82f6", mr: 1 }} />
                                Document Preview
                            </Typography>
                            {documentType === "pdf" && (
                                <>
                                    <IconButton onClick={handleMenuOpen}>
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
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

                        {documentType === "pdf" ? (
                            <Box
                                sx={{
                                    height: "88vh",
                                    overflow: "hidden",
                                    borderRadius: 3,
                                    backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                                    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.06)",
                                    p: 2,
                                    border: `1px solid ${borderColor}`,
                                }}
                            >
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
                                </Worker>
                            </Box>
                        ) : documentType === "docx" ? (
                            <Box
                                ref={docxRef}
                                sx={{
                                    maxHeight: "88vh",
                                    overflowY: "auto",
                                    p: 3,
                                    borderRadius: 3,
                                    background: previewBackground,
                                    boxShadow: "0 1px 8px rgba(0, 0, 0, 0.05)",
                                    border: `1px solid ${borderColor}`,
                                    fontSize: "1rem",
                                    lineHeight: 1.6,
                                    color: textColor,
                                    "& *": {
                                        color: textColor
                                    }
                                }}
                            />
                        ) : (
                            <Typography variant="body1" color="text.secondary">
                                Unsupported file type.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
