import React from "react";
import { Container, Paper } from "@mui/material";
import DOMPurify from "dompurify";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSanitize from "rehype-sanitize";
import rehypeReact from "rehype-react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { cleanDocument } from "../utility/article2htmlconv";

// Unified processor for HTML to React conversion
const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize)
    .use(rehypeReact, { jsx, jsxs, Fragment });

export default function FileViewer() {
    const saved = sessionStorage.getItem("html_content");
    const sanitized = DOMPurify.sanitize(saved || "");
    const cleanedHtml = cleanDocument(sanitized);
    const htmlReactContent = processor.processSync(cleanedHtml).result;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            {htmlReactContent && (
                <Paper
                    sx={{
                        mt: 4,
                        p: 4,
                        maxHeight: "75vh",
                        overflowY: "auto",
                        textAlign: "left",
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                        fontSize: "1.05rem",
                        color: "#333",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        lineHeight: 1.75,

                        // ✅ Headings underlined
                        "& h1, & h2, & h3, & h4, & h5, & h6": {
                            fontWeight: "bold",
                            textDecoration: "underline",
                            marginTop: "1.5rem",
                            marginBottom: "1rem",
                        },

                        // ✅ Paragraph spacing
                        "& p": {
                            marginBottom: "1rem",
                        },

                        // ✅ Lists
                        "& ul, & ol": {
                            paddingLeft: "1.5rem",
                            marginBottom: "1rem",
                        },

                        // ✅ Links
                        "& a": {
                            color: "#2563eb",
                            textDecoration: "underline",
                        },

                        // ✅ Tables
                        "& table": {
                            width: "100%",
                            borderCollapse: "collapse",
                            marginBottom: "1.5rem",
                        },
                        "& th, & td": {
                            border: "1px solid #ccc",
                            padding: "0.5rem",
                        },

                        // ✅ Images
                        "& img": {
                            maxWidth: "100%",
                            margin: "1rem 0",
                        },

                        // ✅ Code blocks
                        "& pre": {
                            backgroundColor: "#1e293b",
                            color: "#fff",
                            padding: "1rem",
                            borderRadius: "6px",
                            overflowX: "auto",
                        },
                        "& code": {
                            backgroundColor: "#f3f4f6",
                            padding: "0.2rem 0.4rem",
                            borderRadius: "4px",
                            fontSize: "0.95em",
                        },
                    }}
                >
                    <div>{htmlReactContent}</div>
                </Paper>
            )}
        </Container>
    );
}
