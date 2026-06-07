# ==========================================
# STAGE 1: Next.js Frontend Build Environment
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Install dependencies first for efficient Docker caching
COPY cookie/frontend/package*.json ./
RUN npm ci

# Copy source code relative to workspace root
COPY cookie/frontend/ ./

# Accept build arguments for public env variables baked in at compilation
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:8000}

# Build production static pages & Turbopack bundle
RUN npm run build

# ==========================================
# STAGE 2: Next.js Frontend Minimal Production Runner
# ==========================================
FROM node:20-alpine AS frontend-runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV HOSTNAME="0.0.0.0"

# Copy package configurations
COPY cookie/frontend/package*.json ./

# Copy builds, public static assets, configurations, and node modules from builder
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

# Run Next.js server
CMD ["npm", "run", "start"]

# ==========================================
# STAGE 3: FastAPI Backend Slim Production Runner
# ==========================================
FROM python:3.11-slim AS backend-runner
WORKDIR /app

# System dependency tuning (reduce python file size, prevent python buffering)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install python dependencies
COPY cookie/cookie-tracker-graph/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files relative to workspace root
COPY cookie/cookie-tracker-graph/ ./

EXPOSE 8000

# Bind to 0.0.0.0 instead of 127.0.0.1 to expose port out of the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
