from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=schemas.APIResponse)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = auth.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    new_user = auth.create_user(db=db, user=user)
    
    access_token = auth.create_access_token(data={"sub": new_user.email})
    refresh_token = auth.create_refresh_token(data={"sub": new_user.email})
    
    token_data = schemas.Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )
    
    return schemas.APIResponse(
        success=True,
        message="User registered successfully",
        data=token_data.dict()
    )

@router.post("/login", response_model=schemas.APIResponse)
async def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user.last_login_at = models.func.now()
    db.commit()
    
    access_token = auth.create_access_token(data={"sub": user.email})
    refresh_token = auth.create_refresh_token(data={"sub": user.email})
    
    token_data = schemas.Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )
    
    return schemas.APIResponse(
        success=True,
        message="Login successful",
        data=token_data.dict()
    )

@router.post("/refresh", response_model=schemas.APIResponse)
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        token_data = auth.verify_token(refresh_token, token_type="refresh")
        user = auth.get_user_by_email(db, email=token_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        access_token = auth.create_access_token(data={"sub": user.email})
        
        return schemas.APIResponse(
            success=True,
            message="Token refreshed successfully",
            data={"access_token": access_token, "token_type": "bearer"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

@router.get("/profile", response_model=schemas.APIResponse)
async def get_profile(current_user: models.User = Depends(auth.get_current_active_user)):
    user_data = schemas.UserResponse.from_orm(current_user)
    return schemas.APIResponse(
        success=True,
        message="Profile retrieved successfully",
        data=user_data.dict()
    )

@router.put("/profile", response_model=schemas.APIResponse)
async def update_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    user_data = schemas.UserResponse.from_orm(current_user)
    return schemas.APIResponse(
        success=True,
        message="Profile updated successfully",
        data=user_data.dict()
    )

@router.post("/change-password", response_model=schemas.APIResponse)
async def change_password(
    password_data: schemas.ChangePasswordRequest,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    if not auth.verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    current_user.password_hash = auth.get_password_hash(password_data.new_password)
    db.commit()
    
    return schemas.APIResponse(
        success=True,
        message="Password changed successfully"
    )

@router.post("/logout", response_model=schemas.APIResponse)
async def logout(current_user: models.User = Depends(auth.get_current_active_user)):
    return schemas.APIResponse(
        success=True,
        message="Logged out successfully"
    )
