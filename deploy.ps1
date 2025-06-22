# PowerShell deployment script
$BucketName = "pockercashflow-1750603012.85526"
$DistributionId = "E3GUYCNLRRQECZ"

Write-Host "噫 Starting deployment..." -ForegroundColor Green

# Build app
Write-Host "逃 Building application..." -ForegroundColor Yellow
npm run build

# Upload to S3
Write-Host "豆 Uploading to S3..." -ForegroundColor Yellow
aws s3 sync "dist/" "s3://$BucketName/" --delete --cache-control "max-age=31536000" --exclude "*.html"
aws s3 sync "dist/" "s3://$BucketName/" --cache-control "no-cache" --include "*.html"

# Invalidate CloudFront cache
Write-Host "🌐 Invalidating CloudFront cache..." -ForegroundColor Yellow
aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌍 Your app URLs:" -ForegroundColor Cyan
Write-Host "   HTTPS: https://d1vp9iofpvfkkg.cloudfront.net" -ForegroundColor Green
Write-Host "   HTTP:  http://$BucketName.s3-website-ap-northeast-1.amazonaws.com" -ForegroundColor Yellow
