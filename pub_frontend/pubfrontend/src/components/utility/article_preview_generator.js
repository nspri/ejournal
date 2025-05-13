//import * as pdfjsLib from "pdfjs-dist";
import * as mammoth from "mammoth";
//import * as pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsLib from "pdfjs-dist";
import { dev_API_BASE_URL } from "../api/api_services";
// Use a CDN that works without `?import`
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Generates preview text for a list of article files (PDF/DOCX).
 * @param {Array} articles - Array of article objects with `id` and `file` (URL) properties.
 * @returns {Promise<Object>} - Resolves to a map of article IDs to preview strings.
 */
export async function generateArticlePreviews(articles) {
  const previewsMap = {};

  for (const article of articles) {
    //const fileUrl = article.file;

    const fileUrl = `${dev_API_BASE_URL}${article.file}`;
    //console.log(fileUrl)
    try {
      if (fileUrl.endsWith(".pdf")) {
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        const previewText = textContent.items.map(i => i.str).join(" ");
        previewsMap[article.id] = previewText.slice(0, 300) + "...";
      } else if (fileUrl.endsWith(".docx")) {
        const res = await fetch(fileUrl);
        const arrayBuffer = await res.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        previewsMap[article.id] = result.value.slice(0, 300) + "...";
      } else {
        previewsMap[article.id] = "Unsupported file format";
      }
    } catch (err) {
      console.error(`Error processing file for article ID ${article.id}:`, err);
      previewsMap[article.id] = "Error generating preview";
    }
  }
  // console.log(previewsMap);
  sessionStorage.setItem("articlePreviews", JSON.stringify(previewsMap));

  //return previewsMap;
}
