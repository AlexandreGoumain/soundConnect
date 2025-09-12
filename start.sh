#!/usr/bin/env sh

# Simple static server for the Vite build in frontend/dist
# Compatible with POSIX sh environments used by some builders.

set -eu

BUILD_DIR="${BUILD_DIR:-frontend/dist}"
PORT="${PORT:-3000}"
HOST="${HOST:-0.0.0.0}"

# If the build directory is missing (first boot), build the frontend
if [ ! -d "$BUILD_DIR" ]; then
  echo "[start.sh] Build directory '$BUILD_DIR' not found. Building frontend..."
  npm ci --prefix frontend
  npm run build --prefix frontend
fi

echo "[start.sh] Serving '$BUILD_DIR' on ${HOST}:${PORT}"
# -s enables SPA fallback to index.html
# -n disables clipboard on containerized environments
exec npx -y serve -s "$BUILD_DIR" -n -l "${HOST}:${PORT}"
