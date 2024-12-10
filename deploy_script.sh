#!/bin/bash

FRONTEND_BUILD_DIR="./host-packages/main-game-prod"

if [ ! -d "$FRONTEND_BUILD_DIR" ]; then
  echo "Error: $FRONTEND_BUILD_DIR directory does not exist!"
  exit 1
fi

if [ ! -f "$FRONTEND_BUILD_DIR/index.html" ]; then
  echo "Error: index.html file not found in $FRONTEND_BUILD_DIR!"
  exit 1
fi

if [ ! -d "$FRONTEND_BUILD_DIR/assets" ]; then
  echo "Error: assets directory not found in $FRONTEND_BUILD_DIR!"
  exit 1
fi

echo "Frontend build is ready. Starting server..."

# Run TypeScript server using PM2
pm2 start npm --name "gambit" -- run run-server-prod

# Save PM2 process list (to restart on server reboot)
pm2 save