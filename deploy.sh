#!/bin/bash

# Wing Shack Dashboard Deployment Script
echo "🚀 Starting Wing Shack Dashboard deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the dashboard directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Error: Build failed. Please check the build output above."
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your dashboard should be live at the URL provided above."
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure custom domain (optional)"
echo "3. Test the production deployment"
