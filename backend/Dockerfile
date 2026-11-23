# syntax=docker/dockerfile:1
FROM python:3.12-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Set working directory inside container
WORKDIR /app

# Install system dependencies:
# - libgomp1: Required for OpenMP support by LightGBM and XGBoost
# - curl: Useful for container health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model artifacts
COPY . .

# Expose the default port (Render will override via $PORT at runtime)
EXPOSE 8000

# Start Uvicorn bound to 0.0.0.0 and dynamic $PORT (default 8000)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
