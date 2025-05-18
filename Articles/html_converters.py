from docx import Document
from django.utils.html import escape
import fitz  # PyMuPDF
from django.utils.html import escape
import bleach

def extract_docx_to_html(docx_file):
    document = Document(docx_file)
    html = ""
    for para in document.paragraphs:
        html += f"<p>{escape(para.text)}</p>"
    return html


def extract_pdf_to_html(pdf_file):
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    html = ""
    for page in doc:
        text = page.get_text()
        html += f"<p>{escape(text)}</p>"
    return html


def extract_file_content(file_obj):
    filename = file_obj.name.lower()
    if filename.endswith(".docx"):
        return extract_docx_to_html(file_obj)
    elif filename.endswith(".pdf"):
        return extract_pdf_to_html(file_obj)
    return "<p>Unsupported file format.</p>"

