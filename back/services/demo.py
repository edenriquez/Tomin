from fastapi import HTTPException
from pdf_utils import extract_text
from services import llm
import magic


ONE_MB = 1024 * 1024


def validate_pdf_format(mime):
    if mime != "application/pdf":
        raise HTTPException(400, "Invalid file type. Only PDFs are accepted")


def validate_max_content_size(content):
    if len(content) > ONE_MB:
        raise HTTPException(413, "File size exceeds 1MB limit")


async def process_pdf(content: bytes):
    mime = magic.from_buffer(content, mime=True)

    validate_pdf_format(mime)
    # validate_max_content_size(content)

    try:
        text = extract_text(content)
        return await llm.analyze_expenses(text)
    except Exception as e:
        raise HTTPException(500, f"Processing error: {str(e)}")
