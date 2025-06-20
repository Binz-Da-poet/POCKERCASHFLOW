#!/bin/bash

# Health Check Script
echo "🏥 Running health check..."

# Check Nginx status
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
    sudo systemctl restart nginx
fi

# Check if site is accessible
if curl -f -s http://localhost > /dev/null; then
    echo "✅ Website is accessible"
else
    echo "❌ Website is not accessible"
    exit 1
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2{printf "%s", $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️  Warning: Disk usage is ${DISK_USAGE}%"
else
    echo "✅ Disk usage: ${DISK_USAGE}%"
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
echo "📊 Memory usage: ${MEMORY_USAGE}%"

echo "🎯 Health check completed!" 