# Use official Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Cloud Run expects the app to listen on port 8080 (or the $PORT env var)
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]