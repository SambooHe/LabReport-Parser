#!/bin/bash
set -Eeuo pipefail

WORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$WORK_DIR/medical-report-analyzer"

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Build completed successfully!"