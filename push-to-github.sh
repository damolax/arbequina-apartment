#!/usr/bin/env bash
set -euo pipefail
REPO_URL="https://github.com/damolax/arbequina-apartment.git"
git init
git add .
git commit -m "Final Arbequina Apartment launch reference" || true
git branch -M main
if git remote get-url origin >/dev/null 2>&1; then git remote set-url origin "$REPO_URL"; else git remote add origin "$REPO_URL"; fi
git push -u origin main --force
