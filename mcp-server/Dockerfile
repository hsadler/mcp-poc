FROM python:3.11-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml .

# Sync dependencies
RUN uv sync

# Copy application code
COPY main.py .

EXPOSE 8000

CMD ["uv", "run", "python", "main.py"]
