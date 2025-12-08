from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.controllers import sales_controller

app = FastAPI(title="TruEstate Retail Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (easiest for testing)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sales_controller.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "TruEstate API Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)