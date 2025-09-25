#!/bin/bash

# Create a simple logo using ImageMagick if available
# Otherwise we'll use an existing image

if command -v magick &> /dev/null || command -v convert &> /dev/null; then
    # Create a simple DL logo with ImageMagick
    CMD="convert"
    if command -v magick &> /dev/null; then
        CMD="magick"
    fi

    $CMD -size 200x200 xc:'#1a1b26' \
        -fill '#89b4fa' -pointsize 120 -gravity center \
        -annotate +0+0 "DL" \
        -stroke '#7aa2f7' -strokewidth 2 \
        /tmp/dl_logo.png
    echo "Created logo at /tmp/dl_logo.png"
else
    echo "ImageMagick not found. Please provide an image to convert."
fi