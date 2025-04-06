from io import BytesIO
import pdfplumber


def extract_text(pdf_bytes: bytes) -> str:
    """Extracts text from PDF bytes using pdfplumber"""
    try:
        text = []
        with BytesIO(pdf_bytes) as pdf_file:
            with pdfplumber.open(pdf_file) as pdf:
                for page in pdf.pages:
                    text.append(page.extract_text())
        return "\n".join(text)
    except Exception as e:
        raise ValueError(f"PDF processing failed: {str(e)}")
