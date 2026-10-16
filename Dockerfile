# Multi-Platform Production Dockerfile for Muse AI Agent
FROM python:3.11-slim-bookworm

# Prevent Python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive
ENV DISPLAY=:99

WORKDIR /app

# Install system dependencies, Node.js, and virtual X11 server for CUA desktop capture
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    xvfb \
    x11-utils \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy repository
COPY . .

# Expose Muse Agent Gateway port
EXPOSE 8765

# Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://127.0.0.1:8765/api/status || exit 1

# Start virtual display and Muse Agent headless server
CMD ["sh", "-c", "Xvfb :99 -screen 0 1920x1080x24 & python main.py --headless"]
