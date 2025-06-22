# 💰 AWS Cost Optimization Guide - Poker Cash Flow App

## 📊 **Current vs Optimized Cost Analysis**

### 🔴 **Current EC2 Setup (Monthly Cost: ~$15-25)**

```
- EC2 t3.micro: ~$8.5/month (running 24/7)
- EBS 8GB: ~$1/month
- Data Transfer: ~$1-3/month
- Public IP: ~$3.6/month
- Total: ~$13.5-16/month
```

### 🟢 **Optimized S3 + CloudFront (Monthly Cost: ~$1-3)**

```
- S3 Storage (1GB): ~$0.025/month
- S3 Requests (1000 requests): ~$0.0004/month
- CloudFront (1GB transfer): ~$0.085/month
- CloudFront Requests (10k): ~$0.0075/month
- Total: ~$0.12-3/month (depending on usage)
```

**💡 Tiết kiệm: 80-95% chi phí!**

---

## 🎯 **Recommended Architecture for Low Traffic (1-2 visits/day)**

### **Option 1: S3 + CloudFront (RECOMMENDED) 🏆**

```
Internet → CloudFront CDN → S3 Static Website
```

**Pros:**

- ✅ Cực kỳ rẻ (~$1-3/month)
- ✅ Auto-scaling không giới hạn
- ✅ Global CDN performance
- ✅ 99.99% uptime SLA
- ✅ Không cần maintain server
- ✅ HTTPS miễn phí

**Cons:**

- ❌ Chỉ phù hợp static sites (OK cho React SPA)
- ❌ Không thể chạy server-side logic

### **Option 2: AWS Amplify**

```
Git Repository → Amplify → Global CDN
```

**Cost: ~$3-5/month**

- Tự động CI/CD
- Dễ setup nhất
- SSL certificate miễn phí

### **Option 3: Lambda + API Gateway (Nếu cần backend)**

```
CloudFront → S3 (Frontend) + Lambda (API)
```

**Cost: ~$1-5/month**

- Chỉ trả tiền khi có request
- Serverless scaling
- Phù hợp cho API đơn giản

---

## 🛠️ **Setup Instructions**

### **Bước 1: Cài đặt AWS CLI**

```bash
# Windows
curl "https://awscli.amazonaws.com/AWSCLIV2.msi" -o "AWSCLIV2.msi"
msiexec /i AWSCLIV2.msi

# Cấu hình credentials
aws configure
```

### **Bước 2: Chạy setup script**

```bash
chmod +x aws-s3-setup.sh
./aws-s3-setup.sh
```

### **Bước 3: Deploy updates sau này**

```bash
./deploy-to-s3.sh
```

---

## 💡 **Advanced Cost Optimization Tips**

### **1. S3 Storage Class Optimization**

```bash
# Sử dụng S3 Standard-IA cho files không thường truy cập
aws s3api put-object --bucket BUCKET_NAME --key assets/ --storage-class STANDARD_IA
```

### **2. CloudFront Caching Strategy**

```javascript
// Cache static assets lâu hơn
Cache-Control: max-age=31536000  // 1 year for JS/CSS/images
Cache-Control: no-cache          // No cache for HTML
```

### **3. Gzip Compression**

```bash
# Enable gzip cho all text files
Content-Encoding: gzip
```

### **4. Scheduled Scaling (Nếu dùng EC2)**

```bash
# Tắt instance vào ban đêm (tiết kiệm 50% chi phí)
# Cron job để tắt/bật EC2 theo lịch
```

---

## 📈 **Monitoring & Cost Alerts**

### **Setup Cost Alerts**

```bash
# Tạo budget alert khi chi phí > $5/month
aws budgets create-budget --account-id YOUR_ACCOUNT_ID --budget '{
    "BudgetName": "PockerCashFlow-Monthly",
    "BudgetLimit": {
        "Amount": "5.0",
        "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
}'
```

### **CloudWatch Metrics**

- S3 requests count
- CloudFront cache hit ratio
- Data transfer costs

---

## 🔄 **Migration Plan từ EC2 sang S3**

### **Phase 1: Setup S3 + CloudFront**

1. Chạy `aws-s3-setup.sh`
2. Test trên CloudFront URL
3. Kiểm tra tất cả chức năng

### **Phase 2: Update DNS**

1. Cập nhật DNS records
2. Monitoring traffic
3. Confirm stability

### **Phase 3: Decommission EC2**

1. Backup data cuối cùng
2. Terminate EC2 instance
3. Delete EBS volumes
4. Release Elastic IP

---

## 📊 **Cost Comparison Table**

| Service   | EC2 Setup       | S3 + CloudFront  | Savings             |
| --------- | --------------- | ---------------- | ------------------- |
| Compute   | $8.5/month      | $0               | $8.5                |
| Storage   | $1/month        | $0.025/month     | $0.975              |
| Network   | $4.6/month      | $0.1/month       | $4.5                |
| **Total** | **$14.1/month** | **$0.125/month** | **$14/month (99%)** |

---

## ⚠️ **Important Notes**

### **Limitations of S3 Static Hosting:**

- Không thể chạy server-side code
- Không có database built-in
- Rate limiting phụ thuộc vào CloudFront

### **When to use EC2 instead:**

- Cần real-time features (WebSocket)
- Cần database với complex queries
- Cần server-side processing
- Traffic cao (>10k requests/day)

### **Free Tier Benefits:**

- S3: 5GB storage miễn phí
- CloudFront: 50GB transfer miễn phí
- Lambda: 1M requests miễn phí

---

## 🚀 **Next Steps**

1. **Immediate:** Chạy setup script
2. **Testing:** Verify app functionality
3. **DNS:** Point domain to CloudFront
4. **Monitoring:** Setup cost alerts
5. **Optimization:** Fine-tune caching

**Expected Result:** Giảm 95% chi phí AWS từ ~$15/month xuống ~$1/month! 🎉
