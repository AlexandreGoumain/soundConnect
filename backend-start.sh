#!/usr/bin/env sh

# Start script for the backend service using POSIX sh.
# Installs only production dependencies to avoid dev peer conflicts
# (e.g., puppeteer/@mermaid-js/mermaid-cli), then starts the server.

set -eu

export NPM_CONFIG_PRODUCTION=true
export PUPPETEER_SKIP_DOWNLOAD=true

cd backend

echo "[backend-start.sh] Installing production dependencies (omit dev)…"
npm ci --omit=dev

echo "[backend-start.sh] Starting API…"
exec npm start

