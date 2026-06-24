from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import LoginRequest, Token, UserResponse, UserCreate
from app.crud.user import get_user_by_email, create_user
from app.utils import verify_password, create_access_token, decode_access_token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login-form", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    # Check hardcoded user
    if email == "admin@demo.com":
        return {"email": "admin@demo.com", "id": 1, "is_active": True}
        
    # Check database
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

@router.post("/login", response_model=Token)
def login(login_req: LoginRequest, db: Session = Depends(get_db)):
    # 1. Check hardcoded credentials
    if login_req.email == "admin@demo.com" and login_req.password == "admin123":
        access_token = create_access_token(data={"sub": login_req.email})
        return {"access_token": access_token, "token_type": "bearer"}
    
    # 2. Check DB
    db_user = get_user_by_email(db, email=login_req.email)
    if not db_user or not verify_password(login_req.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

from fastapi.security import OAuth2PasswordRequestForm
@router.post("/login-form", response_model=Token, include_in_schema=False)
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """OAuth2 password flow form login for Swagger UI documentation compatibility."""
    if form_data.username == "admin@demo.com" and form_data.password == "admin123":
        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
        
    db_user = get_user_by_email(db, email=form_data.username)
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email matches the hardcoded admin email
    if user.email == "admin@demo.com":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered (reserved admin email)",
        )
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    new_user = create_user(db=db, user=user)
    return new_user

@router.get("/me")
def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
