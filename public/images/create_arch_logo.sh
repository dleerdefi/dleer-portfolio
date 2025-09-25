#!/bin/bash

# Create an Arch Linux-inspired logo
CMD="convert"
if command -v magick &> /dev/null; then
    CMD="magick"
fi

# Create a simple Arch-inspired triangle logo
$CMD -size 200x200 xc:'#1a1b26' \
    -fill '#89b4fa' \
    -draw "polygon 100,40 30,160 170,160" \
    -fill '#1a1b26' \
    -draw "polygon 100,70 50,140 150,140" \
    /tmp/arch_logo.png

echo "Created Arch-style logo at /tmp/arch_logo.png"