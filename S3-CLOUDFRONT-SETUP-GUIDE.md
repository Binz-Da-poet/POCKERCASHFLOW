# 📚 Hướng dẫn chi tiết Setup S3 + CloudFront

## 🎯 **Tổng quan**

Hướng dẫn này sẽ giúp bạn setup từ A-Z:

- ✅ AWS S3 Static Website Hosting
- ✅ CloudFront CDN Distribution
- ✅ Custom domain (tùy chọn)
- ✅ CI/CD với GitHub Actions

**Estimated time:** 30-45 phút  
**Cost:** ~$1-3/tháng

---

## 🛠️ **Bước 1: Chuẩn bị**

### **1.1 Install AWS CLI**

```bash
# Windows
curl "https://awscli.amazonaws.com/AWSCLIV2.msi" -o "AWSCLIV2.msi"
# Chạy file .msi để install

# Verify installation
aws --version
```

### **1.2 Configure AWS Credentials**

```bash
aws configure
```

**Nhập:**

- `AWS Access Key ID`: Từ IAM user
- `AWS Secret Access Key`: Từ IAM user
- `Default region name`: `ap-southeast-1` (Singapore - gần Việt Nam nhất)
- `Default output format`: `json`

### **1.3 Build React App**

```bash
# Install dependencies
npm install

# Build production
npm run build

# Verify build folder exists
ls dist/
```

---

## 🪣 **Bước 2: Setup S3 Bucket**

### **2.1 Tạo S3 Bucket**

```bash
# Tạo bucket với tên unique
BUCKET_NAME="pockercashflow-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME --region ap-southeast-1

# Hoặc tự đặt tên
BUCKET_NAME="your-app-name-unique"
aws s3 mb s3://$BUCKET_NAME --region ap-southeast-1
```

### **2.2 Enable Static Website Hosting**

```bash
# Configure static website hosting
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html
```

### **2.3 Setup Bucket Policy (Public Read)**

```bash
# Tạo file bucket policy
cat > bucket-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
EOF

# Thay YOUR_BUCKET_NAME bằng tên bucket thực tế
sed -i "s/YOUR_BUCKET_NAME/$BUCKET_NAME/g" bucket-policy.json

# Apply bucket policy
aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy file://bucket-policy.json
```

### **2.4 Upload Files to S3**

```bash
# Upload với cache optimization
# Static assets (JS, CSS, images) - cache 1 year
aws s3 sync dist/ s3://$BUCKET_NAME/ \
    --delete \
    --cache-control "max-age=31536000, public" \
    --exclude "*.html"

# HTML files - no cache (for SPA routing)
aws s3 sync dist/ s3://$BUCKET_NAME/ \
    --cache-control "no-cache, no-store, must-revalidate" \
    --include "*.html"
```

### **2.5 Test S3 Website**

```bash
# Get S3 website URL
S3_URL="http://$BUCKET_NAME.s3-website-ap-southeast-1.amazonaws.com"
echo "S3 Website URL: $S3_URL"

# Test trong browser hoặc curl
curl -I $S3_URL
```

---

## ☁️ **Bước 3: Setup CloudFront Distribution**

### **3.1 Tạo CloudFront Distribution Configuration**

```bash
cat > cloudfront-config.json << EOF
{
    "CallerReference": "$(date +%s)",
    "Comment": "Poker Cash Flow App Distribution",
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "Compress": true
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3-website-ap-southeast-1.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only",
                    "OriginSslProtocols": {
                        "Quantity": 1,
                        "Items": ["TLSv1.2"]
                    }
                }
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100",
    "CustomErrorResponses": {
        "Quantity": 2,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            },
            {
                "ErrorCode": 403,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    }
}
EOF
```

### **3.2 Tạo CloudFront Distribution**

```bash
# Create distribution
aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json \
    > cloudfront-output.json

# Extract distribution ID và domain
DISTRIBUTION_ID=$(jq -r '.Distribution.Id' cloudfront-output.json)
CLOUDFRONT_DOMAIN=$(jq -r '.Distribution.DomainName' cloudfront-output.json)

echo "Distribution ID: $DISTRIBUTION_ID"
echo "CloudFront Domain: $CLOUDFRONT_DOMAIN"
echo "CloudFront URL: https://$CLOUDFRONT_DOMAIN"
```

### **3.3 Wait for Distribution Deployment**

```bash
# Check deployment status
aws cloudfront get-distribution --id $DISTRIBUTION_ID \
    --query 'Distribution.Status' --output text

# Wait for deployment (takes 10-15 minutes)
echo "⏳ Waiting for CloudFront deployment..."
aws cloudfront wait distribution-deployed --id $DISTRIBUTION_ID
echo "✅ CloudFront deployment completed!"
```

---

## 🌐 **Bước 4: Test và Verify**

### **4.1 Test Endpoints**

```bash
# Test S3 direct
echo "Testing S3: $S3_URL"
curl -I $S3_URL

# Test CloudFront
echo "Testing CloudFront: https://$CLOUDFRONT_DOMAIN"
curl -I https://$CLOUDFRONT_DOMAIN

# Performance test
echo "Testing performance..."
curl -w "@curl-format.txt" -o /dev/null -s https://$CLOUDFRONT_DOMAIN
```

### **4.2 Tạo curl format file**

```bash
cat > curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

---

## 🔄 **Bước 5: Setup Deployment Scripts**

### **5.1 Tạo Deploy Script**

```bash
cat > deploy.sh << EOF
#!/bin/bash
# Deployment script for S3 + CloudFront

set -e

BUCKET_NAME="$BUCKET_NAME"
DISTRIBUTION_ID="$DISTRIBUTION_ID"

echo "🚀 Starting deployment..."

# Build app
echo "📦 Building application..."
npm run build

# Upload to S3
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://\$BUCKET_NAME/ \\
    --delete \\
    --cache-control "max-age=31536000, public" \\
    --exclude "*.html"

aws s3 sync dist/ s3://\$BUCKET_NAME/ \\
    --cache-control "no-cache, no-store, must-revalidate" \\
    --include "*.html"

# Invalidate CloudFront
echo "☁️ Invalidating CloudFront cache..."
aws cloudfront create-invalidation \\
    --distribution-id \$DISTRIBUTION_ID \\
    --paths "/*"

echo "✅ Deployment completed!"
echo "🌍 App URL: https://$CLOUDFRONT_DOMAIN"
EOF

chmod +x deploy.sh
```

### **5.2 Tạo Config File**

```bash
cat > aws-config.env << EOF
# AWS Configuration
export BUCKET_NAME="$BUCKET_NAME"
export DISTRIBUTION_ID="$DISTRIBUTION_ID"
export CLOUDFRONT_DOMAIN="$CLOUDFRONT_DOMAIN"
export S3_WEBSITE_URL="$S3_URL"
export AWS_REGION="ap-southeast-1"

# Usage:
# source aws-config.env
# ./deploy.sh
EOF
```

---

## 🎯 **Bước 6: Optimizations**

### **6.1 Configure GZIP Compression**

```bash
# CloudFront đã enable compress=true
# Verify compression
curl -H "Accept-Encoding: gzip" -I https://$CLOUDFRONT_DOMAIN
```

### **6.2 Setup Custom Cache Behaviors**

```bash
# Tạo cache behavior cho API calls (nếu có)
cat > cache-behavior.json << 'EOF'
{
    "PathPattern": "/api/*",
    "TargetOriginId": "S3-YOUR_BUCKET",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "DefaultTTL": 0,
    "MaxTTL": 0,
    "ForwardedValues": {
        "QueryString": true,
        "Headers": {
            "Quantity": 1,
            "Items": ["Authorization"]
        }
    }
}
EOF
```

### **6.3 Performance Monitoring**

```bash
# Tạo script monitor performance
cat > monitor.sh << 'EOF'
#!/bin/bash
echo "📊 Performance Monitoring"
echo "========================"

# Test load time
LOAD_TIME=$(curl -w '%{time_total}' -o /dev/null -s https://YOUR_CLOUDFRONT_DOMAIN)
echo "Load time: ${LOAD_TIME}s"

# Test cache hit
CACHE_STATUS=$(curl -I https://YOUR_CLOUDFRONT_DOMAIN 2>/dev/null | grep -i "x-cache" || echo "No cache header")
echo "Cache status: $CACHE_STATUS"

# Test compression
COMPRESSION=$(curl -H "Accept-Encoding: gzip" -I https://YOUR_CLOUDFRONT_DOMAIN 2>/dev/null | grep -i "content-encoding" || echo "No compression")
echo "Compression: $COMPRESSION"
EOF

chmod +x monitor.sh
```

---

## 💰 **Bước 7: Cost Optimization**

### **7.1 Setup Cost Alerts**

```bash
# Tạo budget alert
cat > budget.json << 'EOF'
{
    "BudgetName": "PockerCashFlow-Monthly",
    "BudgetLimit": {
        "Amount": "5.0",
        "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST",
    "CostFilters": {
        "Service": ["Amazon Simple Storage Service", "Amazon CloudFront"]
    }
}
EOF

# Create budget (requires account ID)
ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
aws budgets create-budget --account-id $ACCOUNT_ID --budget file://budget.json
```

### **7.2 S3 Storage Class Optimization**

```bash
# Setup lifecycle policy cho old files
cat > lifecycle.json << EOF
{
    "Rules": [
        {
            "ID": "OptimizeStorage",
            "Status": "Enabled",
            "Filter": {"Prefix": ""},
            "Transitions": [
                {
                    "Days": 30,
                    "StorageClass": "STANDARD_IA"
                },
                {
                    "Days": 90,
                    "StorageClass": "GLACIER"
                }
            ]
        }
    ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \
    --bucket $BUCKET_NAME \
    --lifecycle-configuration file://lifecycle.json
```

---

## 🔐 **Bước 8: Security & Domain (Optional)**

### **8.1 Custom Domain với Route 53**

```bash
# Nếu bạn có domain, create hosted zone
DOMAIN_NAME="yourdomain.com"
aws route53 create-hosted-zone \
    --name $DOMAIN_NAME \
    --caller-reference $(date +%s)

# Tạo CNAME record pointing to CloudFront
```

### **8.2 SSL Certificate với ACM**

```bash
# Request SSL certificate (must be in us-east-1 for CloudFront)
aws acm request-certificate \
    --domain-name $DOMAIN_NAME \
    --subject-alternative-names "*.$DOMAIN_NAME" \
    --validation-method DNS \
    --region us-east-1
```

---

## 📋 **Summary & Next Steps**

### **✅ What You've Setup:**

- ✅ S3 Static Website với optimized caching
- ✅ CloudFront CDN với global distribution
- ✅ Deployment scripts cho future updates
- ✅ Cost monitoring và optimization
- ✅ Performance monitoring tools

### **📊 Expected Costs:**

```
S3 Storage (1GB):        $0.025/month
S3 Requests (1K):        $0.0004/month
CloudFront (1GB):        $0.085/month
CloudFront Requests:     $0.0075/month
Total:                   ~$0.12-1.00/month
```

### **🚀 Regular Usage:**

```bash
# Load environment
source aws-config.env

# Deploy updates
./deploy.sh

# Monitor performance
./monitor.sh

# Check costs
aws ce get-cost-and-usage \
    --time-period Start=2024-01-01,End=2024-02-01 \
    --granularity MONTHLY \
    --metrics BlendedCost
```

### **📞 Support Commands:**

```bash
# Rollback deployment
aws s3 sync s3://$BUCKET_NAME/ ./backup/
aws s3 sync ./previous-build/ s3://$BUCKET_NAME/

# Debug CloudFront
aws cloudfront get-distribution --id $DISTRIBUTION_ID

# Debug S3
aws s3api get-bucket-location --bucket $BUCKET_NAME
aws s3api get-bucket-policy --bucket $BUCKET_NAME
```

**🎉 Congratulations!** Bạn đã setup thành công AWS S3 + CloudFront với chi phí tối ưu!
