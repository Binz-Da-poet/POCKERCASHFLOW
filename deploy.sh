#!/bin/bash

# Deploy script for Poker Cash Flow App
set -e

echo "🚀 Starting deployment..."

# Variables
APP_DIR="/var/www/pockercashflow"
REPO_URL="https://github.com/Binz-Da-poet/POCKERCASHFLOW.git"
NGINX_CONF="/etc/nginx/sites-available/pockercashflow"

# Create app directory
sudo mkdir -p $APP_DIR
cd $APP_DIR

# Clone or pull latest code
if [ -d ".git" ]; then
    echo "📦 Pulling latest changes..."
    sudo git pull origin main
else
    echo "📦 Cloning repository..."
    sudo git clone $REPO_URL .
fi

# Install dependencies
echo "📦 Installing dependencies..."
sudo npm ci --production=false

# Build application
echo "🔨 Building application..."
sudo npm run build

# Copy Nginx configuration
echo "🌐 Configuring Nginx..."
sudo cp nginx.conf $NGINX_CONF
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/pockercashflow

# Remove default Nginx site if exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Set proper permissions
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

echo "✅ Deployment completed successfully!"
echo "🌍 App is available at: http://$(curl -s ifconfig.me)" 