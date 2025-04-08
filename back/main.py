from mangum import Mangum

from fastapi import FastAPI, UploadFile, HTTPException, File
from fastapi.middleware.cors import CORSMiddleware
from pdf_utils import extract_text
from llm_service import analyze_expenses
import magic
import datetime

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ONE_MB = 1024 * 1024


def validate_pdf_format(mime):
    if mime != "application/pdf":
        raise HTTPException(400, "Invalid file type. Only PDFs are accepted")


def validate_max_content_size(content):
    if len(content) > ONE_MB:
        raise HTTPException(413, "File size exceeds 1MB limit")


@app.get("/health")
async def health_check():
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": {
            "status": "healthy",
            "service": "pdf-processor",
            "timestamp": datetime.datetime.utcnow().isoformat(),
        },
    }


@app.post("/process")
async def process_pdf(file: UploadFile = File(..., format=[".pdf"], alias="file")):
    content = await file.read()
    mime = magic.from_buffer(content, mime=True)

    validate_pdf_format(mime)
    # validate_max_content_size(content)

    await file.seek(0)

    try:
        text = extract_text(content)
        analysis = await analyze_expenses(text)
    except Exception as e:
        raise HTTPException(500, f"Processing error: {str(e)}")

    print(analysis)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": {
            "filename": file.filename,
            "size": len(content),
            "analysis": analysis,
        },
    }


handler = Mangum(app)
