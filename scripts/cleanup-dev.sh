#!/bin/bash

# Cleanup script for Next.js dev servers
# Kills all Next.js dev server processes and PostCSS workers

echo "🧹 Cleaning up dev server processes..."

# Kill Next.js dev processes
pkill -f "next dev" 2>/dev/null && echo "  ✓ Stopped Next.js dev servers"

# Kill next-server processes
pkill -f "next-server" 2>/dev/null && echo "  ✓ Stopped next-server processes"

# Kill PostCSS worker processes
pkill -f ".next/postcss" 2>/dev/null && echo "  ✓ Stopped PostCSS workers"

echo "✨ Cleanup complete!"
