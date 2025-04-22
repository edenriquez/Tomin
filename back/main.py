from mangum import Mangum

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from back.services import health  # Updated import
from back.services import demo    # Updated import
from models import models
from database import connection
from fastapi import HTTPException
import requests
import datetime
from fastapi import Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

limiter = Limiter(key_func=get_remote_address, default_limits=["2/minute"])
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return {
        "statusCode": 429,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": {"message": "Too many requests", "success": False},
    }


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return health.validate_service_health()


@app.post("/demo-process")
async def process_pdf(file: UploadFile = File(..., format=[".pdf"], alias="file")):
    content = await file.read()
    analysis = demo.process_pdf(file)

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


@app.post("/subscribe")
async def subscribe(payload: dict):
    email = payload.get("email")

    body = {"message": "User inserted in waitlist successfully", "success": True}
    status_code = 200

    if not email or "@" not in email:
        status_code = 400
        body = {"message": "Invalid email format", "success": False}

    supabase = connection.connect()
    existing = (
        supabase.table("subscriptions").select("email").eq("email", email).execute()
    )
    if existing.data:
        status_code = 409
        body = {"message": "Email already subscribed", "success": False}

    response = supabase.table("subscriptions").insert({"email": email}).execute()

    if response.count is not None:
        body = {"message": "Failed to subscribe user", "success": False}

    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": body,
    }


@app.post("/oauth-token")
async def handle_oauth_token(token_data: dict):
    # Extract token details
    access_token = token_data.get("access_token")
    expires_in = token_data.get("expires_in")

    # Verify the token with the OAuth provider
    try:
        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response.raise_for_status()
        token_info = response.json()

        if not token_info.get("active"):
            raise HTTPException(status_code=401, detail="Invalid token")

        # Extract user info from token_info
        user_info = {
            "email": token_info.get("email"),
            "oauth_provider": "google",
            "oauth_id": token_info.get("sub"),
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500, detail=f"Token verification failed: {str(e)}"
        )

    # Check if user exists and update or create
    user = await models.User.get_or_none(email=user_info["email"])
    if user:
        # Update user details
        user.oauth_access_token = access_token
        user.oauth_refresh_token = (
            "new_refresh_token"  # This should be obtained securely
        )
        user.oauth_token_expires = datetime.now() + datetime.timedelta(
            seconds=expires_in
        )
        await user.save()
    else:
        # Create new user
        user = await models.User.create(
            email=user_info["email"],
            oauth_provider=user_info["oauth_provider"],
            oauth_id=user_info["oauth_id"],
            oauth_access_token=access_token,
            oauth_refresh_token="new_refresh_token",  # This should be obtained securely
            oauth_token_expires=datetime.now() + datetime.timedelta(seconds=expires_in),
        )

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": {
            "success": True,
            "message": "User signed in correctly",
            "token": access_token,
        },
    }


handler = Mangum(app)
