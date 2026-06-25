from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, hosted_zones, records
from app.routers import auth, hosted_zones, records
# ... rest same
# Create tables (only once)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Route53 Clone API",
    description="Backend API for AWS Route53 Clone",
    version="1.0.0"
)

# CORS Middleware - Important for Vercel + Local
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local frontend
        "https://your-frontend-domain.vercel.app",  # Change to your actual frontend URL
        "*"  # Temporary (for testing) - Production mein specific origin daalna better hai
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(hosted_zones.router, prefix="/api/hosted-zones", tags=["hosted-zones"])
app.include_router(records.router, prefix="/api", tags=["records"])

# Health Check
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Route53 Clone API",
        "version": "1.0.0"
    }

# Optional: Root endpoint
@app.get("/")
def root():
    return {
        "message": "Welcome to Route53 Clone API",
        "docs": "/docs",
        "health": "/api/health"
    }

# For Vercel Serverless (important)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)