from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import Token, UserLogin
from app.crud.user import get_user_by_email
from app.utils import verify_password, create_access_token

router = APIRouter()

# Hardcoded demo user (for quick testing)
DEMO_USER = {
    "email": "admin@demo.com",
    "password": "admin123",
    "full_name": "Demo Admin"
}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # First check hardcoded demo user
    if form_data.username == DEMO_USER["email"] and form_data.password == DEMO_USER["password"]:
        access_token = create_access_token(data={"sub": DEMO_USER["email"]})
        return {"access_token": access_token, "token_type": "bearer"}
    
    # Check database user (if any)
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}