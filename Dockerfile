# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

# Don't write .pyc files and don't buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install only build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages into a local prefix so we can copy them cleanly
COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install --prefix=/install -r requirements.txt


# ── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=Blogg.settings

WORKDIR /app

# Copy installed packages from the builder stage
COPY --from=builder /install /usr/local

# Copy the project source code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run database migrations at build time (SQLite - fine for development)
RUN python manage.py migrate --noinput

# Expose the application port
EXPOSE 8000

# Start with Gunicorn (production-ready WSGI server)
CMD ["gunicorn", "Blogg.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]
