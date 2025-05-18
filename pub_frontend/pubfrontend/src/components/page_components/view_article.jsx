//import React, { useState } from "react";
//import { Container, Paper, Typography, Button } from "@mui/material";
import axios from "axios";
import DOMPurify from "dompurify";
import React, { useState, useEffect, } from "react";
import { createElement } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";

import { Container, Paper, Typography, Button, Box } from "@mui/material";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSanitize from "rehype-sanitize";
import rehypeReact from "rehype-react";
import { cleanDocument } from "../utility/article2htmlconv";

// Function to convert and sanitize HTML into React elements
const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize)
    .use(rehypeReact, {
        jsx, // ✅ use the new JSX runtime
        jsxs,
        Fragment,
        // You can also add components if needed:
        // components: { h1: CustomHeading }
    });

export default function FileViewer() {
    //const [htmlContent, setHtmlContent] = useState("");
    //const [error, setError] = useState(null);
    const saved = sessionStorage.getItem("html_content");
    //console.log(saved)
    const sanitized = DOMPurify.sanitize(saved);
    let htmlContent = sanitized
    //
    const cleanedHtml = cleanDocument(sanitized);
    let htmlReactContent = processor.processSync(cleanedHtml).result;
    console.log(cleanedHtml);
    console.log(htmlReactContent)
    //setHtmlContent(sanitized);
    //setError(null);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>


            {htmlReactContent && (
                <Paper
                    elevation={3}
                    sx={{
                        mt: 4,
                        p: 3,
                        maxHeight: "70vh",
                        overflowY: "auto",
                        "& h1, & h2, & h3": {
                            fontWeight: "bold",
                            mt: 3,
                            mb: 2,
                        },
                        "& p": {
                            mb: 2,
                            lineHeight: 1.8,
                        },
                        "& ul, & ol": {
                            pl: 3,
                            mb: 2,
                        },
                        "& a": {
                            color: "blue",
                            textDecoration: "underline",
                        },
                        "& table": {
                            width: "100%",
                            borderCollapse: "collapse",
                            mb: 3,
                        },
                        "& th, & td": {
                            border: "1px solid #ccc",
                            padding: "0.5rem",
                        },
                        "& img": {
                            maxWidth: "100%",
                            margin: "1rem 0",
                        },
                    }}
                >
                    <div className="bg-white min-h-screen py-8 px-4 sm:px-8">
                        <div className="prose prose-lg max-w-4xl mx-auto">
                            {htmlReactContent}
                        </div>
                    </div>
                </Paper>
            )}
        </Container>
    );
}
