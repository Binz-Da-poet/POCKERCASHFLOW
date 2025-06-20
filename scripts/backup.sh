#!/bin/bash

# Backup Script
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/pockercashflow"
APP_DIR="/var/www/pockercashflow"

echo "💾 Creating backup..."

# Create backup directory
sudo mkdir -p $BACKUP_DIR

# Backup application files
sudo tar -czf "$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz" \
    -C "/var/www" "pockercashflow"

# Backup Nginx configuration
sudo cp /etc/nginx/sites-available/pockercashflow \
    "$BACKUP_DIR/nginx_config_$TIMESTAMP.conf"

# Keep only last 5 backups
sudo find $BACKUP_DIR -name "app_backup_*.tar.gz" -type f -mtime +5 -delete
sudo find $BACKUP_DIR -name "nginx_config_*.conf" -type f -mtime +5 -delete

echo "✅ Backup completed: $BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz" 