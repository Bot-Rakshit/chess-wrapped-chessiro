#!/bin/bash

# Generate favicons from Chessiro-light.png
# This script creates all necessary favicon sizes

SOURCE="/Users/rakshit/workspace/archives/repos/chessiro/public/Chessiro-light.png"
OUTPUT_DIR="/Users/rakshit/workspace/archives/repos/chessiro/public"

echo "Generating favicons from $SOURCE..."

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "Using ImageMagick..."
    
    # Generate all required sizes
    convert "$SOURCE" -resize 16x16 "$OUTPUT_DIR/favicon-16x16.png"
    convert "$SOURCE" -resize 32x32 "$OUTPUT_DIR/favicon-32x32.png"
    convert "$SOURCE" -resize 180x180 "$OUTPUT_DIR/apple-touch-icon.png"
    convert "$SOURCE" -resize 192x192 "$OUTPUT_DIR/android-chrome-192x192.png"
    convert "$SOURCE" -resize 512x512 "$OUTPUT_DIR/android-chrome-512x512.png"
    
    # Generate ICO file with multiple sizes
    convert "$SOURCE" -resize 16x16 -colors 256 "$OUTPUT_DIR/favicon.ico"
    
    echo "✓ Generated: favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png"
    
elif command -v sips &> /dev/null; then
    echo "Using macOS sips..."
    
    # Create temp directory
    TEMP_DIR=$(mktemp -d)
    cp "$SOURCE" "$TEMP_DIR/source.png"
    
    # Generate each size
    sips -z 16 16 "$SOURCE" --out "$OUTPUT_DIR/favicon-16x16.png" > /dev/null
    sips -z 32 32 "$SOURCE" --out "$OUTPUT_DIR/favicon-32x32.png" > /dev/null
    sips -z 180 180 "$SOURCE" --out "$OUTPUT_DIR/apple-touch-icon.png" > /dev/null
    sips -z 192 192 "$SOURCE" --out "$OUTPUT_DIR/android-chrome-192x192.png" > /dev/null
    sips -z 512 512 "$SOURCE" --out "$OUTPUT_DIR/android-chrome-512x512.png" > /dev/null
    
    # For ICO, we'll use a simple PNG (modern browsers support PNG favicons)
    cp "$SOURCE" "$OUTPUT_DIR/favicon.ico"
    
    rm -rf "$TEMP_DIR"
    
    echo "✓ Generated: favicon.ico (PNG), favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png"
    
else
    echo "⚠ Neither ImageMagick nor sips found. Creating symbolic links instead..."
    
    # Create symbolic links for the source image
    ln -sf "Chessiro-light.png" "$OUTPUT_DIR/favicon.ico"
    ln -sf "Chessiro-light.png" "$OUTPUT_DIR/favicon-16x16.png"
    ln -sf "Chessiro-light.png" "$OUTPUT_DIR/favicon-32x32.png"
    ln -sf "Chessiro-light.png" "$OUTPUT_DIR/apple-touch-icon.png"
    ln -sf "Chessiro-light.png" "$OUTPUT_DIR/android-chrome-192x192.png"
    ln -sf "Chessiro-light.png" "$OUTPUT_DIR/android-chrome-512x512.png"
    
    echo "✓ Created symbolic links (install ImageMagick for proper sizes)"
fi

# Create site.webmanifest for PWA
cat > "$OUTPUT_DIR/site.webmanifest" << 'EOF'
{
  "name": "Chessiro Capsule",
  "short_name": "Chessiro",
  "description": "Your Chess Year Wrapped",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0908",
  "theme_color": "#0a0908",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

echo "✓ Created site.webmanifest"

# Create browserconfig.xml for IE/Edge
cat > "$OUTPUT_DIR/browserconfig.xml" << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <square310x310logo src="/mstile-310x310.png"/>
      <wide310x150logo src="/mstile-310x150.png"/>
      <TileColor>#0a0908</TileColor>
    </tile>
  </msapplication>
</browserconfig>
EOF

echo "✓ Created browserconfig.xml"

echo ""
echo "Favicon generation complete!"
echo ""
echo "Files created:"
ls -la "$OUTPUT_DIR"/favicon* "$OUTPUT_DIR"/android-chrome* "$OUTPUT_DIR"/apple-touch* "$OUTPUT_DIR"/site.webmanifest "$OUTPUT_DIR"/browserconfig.xml 2>/dev/null || true
