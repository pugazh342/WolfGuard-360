# backend/Dockerfile

# 1. Base Image: Lightweight Python 3.10
FROM python:3.10-slim

# 2. Set environment variables (prevents .pyc files & buffers)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Create and set working directory
WORKDIR /app

# 4. Install system dependencies (needed for PostgreSQL adapter)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 5. Copy requirements and install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 6. Copy the rest of the application code
COPY . .

# 7. Command to run the app (handled by docker-compose, but good fallback)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]