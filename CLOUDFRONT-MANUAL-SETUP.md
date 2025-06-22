# 🌐 CloudFront Manual Setup Guide

PowerShell có issue với JSON encoding trong command line. Hãy setup CloudFront qua AWS Console:

## 🚀 **Manual Setup Steps:**

### 1. **Truy cập CloudFront Console:**

- Đi đến: https://console.aws.amazon.com/cloudfront/
- Click **"Create Distribution"**

### 2. **Origin Settings:**

```
Origin Domain: pockercashflow-1750603012.85526.s3-website-ap-northeast-1.amazonaws.com
Origin Path: (leave empty)
Origin ID: pockercashflow-s3-origin
```

### 3. **Default Cache Behavior:**

```
Viewer Protocol Policy: Redirect HTTP to HTTPS
Allowed HTTP Methods: GET, HEAD
Cache Policy: Managed-CachingOptimized
Origin Request Policy: Managed-CORS-S3Origin
```

### 4. **Distribution Settings:**

```
Price Class: Use Only US, Canada and Europe (cheapest)
Default Root Object: index.html
Description: Poker Cash Flow CDN
```

### 5. **Custom Error Pages:**

```
Error Code: 404
Response Page Path: /index.html
HTTP Response Code: 200
```

### 6. **Create Distribution**

- Click **"Create Distribution"**
- ⏳ **Wait 5-15 minutes** for deployment

## 🔧 **After Creation:**

### Get Distribution Info:

```bash
# List your distributions
aws cloudfront list-distributions --query "DistributionList.Items[*].{Id:Id,DomainName:DomainName,Status:Status}" --output table

# Get specific distribution details
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

### Update Deploy Script:

```bash
# Invalidate cache after deployment
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 💰 **Expected Results:**

- **HTTPS URL:** `https://xyz123.cloudfront.net`
- **Global Performance:** ~100ms loading từ Việt Nam
- **Additional Cost:** ~$0.02/month
- **SSL Certificate:** Free AWS Certificate

## 🌍 **Benefits:**

- ✅ **HTTPS Security**
- ✅ **Global CDN Performance**
- ✅ **Custom Domain Support** (optional)
- ✅ **Better SEO**
- ✅ **Browser Security Compliance**

---

**Hoặc bạn có thể giữ nguyên S3 HTTP nếu chỉ dùng nội bộ!**
