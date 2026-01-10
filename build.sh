#!/bin/bash
# Scans photo folders and generates config files

cd "$(dirname "$0")"

# Generate config.json for surfaces (photos/surfaces/normal folder)
echo "[" > config.json

first=true
for file in photos/surfaces/normal/*; do
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

# Generate config_pit.json for pit (photos/pit/normal folder)
echo "[" > config_pit.json

first=true
for file in photos/pit/normal/*; do
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
    echo "," >> config_pit.json
  fi
  printf '  { "src": "%s" }' "$filename" >> config_pit.json
done

echo "" >> config_pit.json
echo "]" >> config_pit.json

echo "Generated config_pit.json with $(grep -c '"src"' config_pit.json) images"
