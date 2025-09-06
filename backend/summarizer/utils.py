
import pdfplumber
from docx import Document
from langdetect import detect

def extract_text_from_pdf(file):
    text = ''
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ''
    return text

def extract_text_from_docx(file):
    doc = Document(file)
    return '\n'.join([para.text for para in doc.paragraphs])

def extract_text(file):
    filename = file.name.lower()
    if filename.endswith('.pdf'):
        return extract_text_from_pdf(file)
    elif filename.endswith('.docx'):
        return extract_text_from_docx(file)
    elif filename.endswith('.txt'):
        return file.read().decode('utf-8')
    else:
        raise ValueError('Unsupported file format')

def is_supported_filetype(filename):
    return filename.lower().endswith(('.pdf', '.docx', '.txt'))

def detect_language(text):
    try:
        return detect(text)
    except Exception:
        return "unknown"
