#!/bin/bash

echo "🚀 Starting Matching App Development Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Run type checking
echo "🔍 Type checking..."
pnpm type-check

if [ $? -eq 0 ]; then
    echo "✅ Type checking passed!"
    echo ""
    echo "🌐 Starting development server..."
    echo "📱 Open your browser and navigate to the local URL shown below"
    echo ""
    pnpm dev
else
    echo "❌ Type checking failed. Please fix the errors before starting the server."
    exit 1
fi
