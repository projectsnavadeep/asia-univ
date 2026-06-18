from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import universities, rankings, countries, search

app = FastAPI(title="AUR - Asia University Ranking API", version="1.0.0")

# Allow frontend (Next.js) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(universities.router)
app.include_router(rankings.router)
app.include_router(countries.router)
app.include_router(search.router)

@app.get("/")
def root():
    return {"message": "AUR API is running!"}