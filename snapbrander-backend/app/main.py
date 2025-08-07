from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, create_tables
from .routers import auth, projects, templates, subscriptions, payments, ai_generator, notifications
from . import models
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SnapBrander API",
    description="AI-powered WordPress website generation platform",
    version="1.0.0"
)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(templates.router)
app.include_router(subscriptions.router)
app.include_router(payments.router)
app.include_router(ai_generator.router)
app.include_router(notifications.router)

@app.get("/healthz")
async def healthz():
    return {"status": "ok", "message": "SnapBrander API is running"}

@app.get("/")
async def root():
    return {"message": "Welcome to SnapBrander API", "version": "1.0.0"}
