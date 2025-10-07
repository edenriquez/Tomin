from sqlalchemy import Column, String, Boolean, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .base import BaseModel

class User(BaseModel):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=True)  # For password-based auth
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    
    # OAuth fields
    provider = Column(String(50), nullable=True)  # 'google', 'github', etc.
    provider_id = Column(String(255), nullable=True, unique=True)
    
    # Profile information
    picture = Column(String(500), nullable=True)
    
    def __repr__(self):
        return f"<User {self.email}>"
    
    @property
    def is_authenticated(self):
        return self.is_active
    
    @property
    def display_name(self):
        return self.full_name or self.email.split('@')[0]
