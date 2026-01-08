#!/bin/bash
# Scans /images folder and generates config.json

cd "$(dirname "$0")"

echo "[" > config.json

first=true
for file in images/*; do
  [ -f "$file" ] || continue

  # Check if it's an image
  case "$file" in
    *.jpg|*.jpeg|*.png|*.webp|*.JPG|*.JPEG|*.PNG|*.WEBP) ;;
    *) continue ;;
  esac

  filename=$(basename "$file")
  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> config.json
  fi
  printf '  { "src": "%s" }' "$filename" >> config.json
done

echo "" >> config.json
echo "]" >> config.json

echo "Generated config.json with $(grep -c '"src"' config.json) images"
