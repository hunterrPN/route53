from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, hosted_zones, records

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Route53 Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(hosted_zones.router, prefix="/api/hosted-zones", tags=["hosted-zones"])
app.include_router(records.router, prefix="/api", tags=["records"])

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Route53 Clone API"}