# 🌐 Custom Domain Setup Guide

## ❌ **Không thể đổi thành "pocker.cloudfront.net"**

CloudFront **không cho phép** custom subdomain trên `.cloudfront.net`. Domain `d1vp9iofpvfkkg.cloudfront.net` là **auto-generated** và cố định.

## ✅ **Để có Custom Domain:**

### **Option 1: Mua Domain Mới (Recommended)**

#### 1. **Mua Domain:**

- **Namecheap:** `pokercashflow.com` (~$10/year)
- **GoDaddy:** `pokercash.net` (~$12/year)
- **AWS Route 53:** `poker-cashflow.com` (~$12/year)

#### 2. **Setup DNS với Route 53:**

```bash
# Create hosted zone
aws route53 create-hosted-zone --name pokercashflow.com --caller-reference poker-2024

# Add CNAME record pointing to CloudFront
aws route53 change-resource-record-sets --hosted-zone-id YOUR_ZONE_ID --change-batch '{
  "Changes": [{
    "Action": "CREATE",
    "ResourceRecordSet": {
      "Name": "app.pokercashflow.com",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": [{"Value": "d1vp9iofpvfkkg.cloudfront.net"}]
    }
  }]
}'
```

#### 3. **Request SSL Certificate:**

```bash
# Request certificate for custom domain
aws acm request-certificate --domain-name app.pokercashflow.com --validation-method DNS --region us-east-1
```

#### 4. **Add to CloudFront:**

- AWS Console → CloudFront → Distribution
- **Alternate Domain Names:** `app.pokercashflow.com`
- **SSL Certificate:** Select your ACM certificate

### **Option 2: Subdomain miễn phí**

#### **Sử dụng dịch vụ miễn phí:**

- **Freenom:** `.tk`, `.ml`, `.ga` domains
- **No-IP:** Dynamic DNS service
- **DuckDNS:** `poker.duckdns.org`

## 🔒 **Block Direct S3 Access**

### **Current URLs:**

- ✅ **CloudFront (HTTPS):** https://d1vp9iofpvfkkg.cloudfront.net
- ❌ **S3 Direct (HTTP):** http://pockercashflow-1750603012.85526.s3-website-ap-northeast-1.amazonaws.com

### **Security Steps:**

1. **Run:** `.\secure-s3-access.bat`
2. **Result:** Chỉ CloudFront có thể access S3
3. **S3 direct access** sẽ bị block (403 Forbidden)

## 💰 **Cost Analysis:**

| Option       | Setup Cost | Monthly Cost | Custom Domain            |
| ------------ | ---------- | ------------ | ------------------------ |
| **Current**  | $0         | $0.05        | ❌ Random CloudFront     |
| **+Domain**  | $10/year   | $0.05        | ✅ app.pokercashflow.com |
| **+Route53** | $10/year   | $0.55        | ✅ Professional DNS      |

## 🎯 **Recommendation:**

### **Immediate:**

Run `.\secure-s3-access.bat` để block direct S3 access

### **Future:**

Nếu muốn professional domain:

1. Mua domain `pokercashflow.com` ($10/year)
2. Setup Route 53 DNS
3. Có URL đẹp: `https://app.pokercashflow.com`

---

**Hiện tại app đã hoạt động tốt với CloudFront HTTPS!**
