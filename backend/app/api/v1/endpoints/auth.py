from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core import security
from app.core.config import settings
from app.core.oauth2 import get_google_user_info
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import Token, UserCreate, User as UserSchema
from app.core.security import get_password_hash, create_access_token

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/login/google")
async def login_google(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Google OAuth2 login/registration
    """
    data = await request.json()
    token = data.get("token")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No token provided"
        )
    
    try:
        # Verify Google token and get user info
        user_info = get_google_user_info(token)
        
        # Check if user exists
        user = db.query(User).filter(
            (User.email == user_info['email']) | 
            (User.provider == 'google' and User.provider_id == user_info['provider_id'])
        ).first()
        
        # Create user if doesn't exist
        if not user:
            user = User(
                email=user_info['email'],
                full_name=user_info['name'],
                picture=user_info['picture'],
                provider='google',
                provider_id=user_info['provider_id'],
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Generate access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            user.id, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "picture": user.picture,
                "is_active": user.is_active
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: User = Depends(security.get_current_active_user)
):
    """
    Get current user
    """
    return current_user
