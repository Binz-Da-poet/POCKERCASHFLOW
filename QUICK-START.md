# ⚡ Quick Start Guide - AWS S3 + CloudFront

## 🎯 **Tóm tắt 30 giây**

Setup **AWS S3 + CloudFront** cho ứng dụng React của bạn với:

- 💰 **Chi phí**: ~$1/tháng (95% tiết kiệm vs EC2)
- ⚡ **Thời gian**: 10-15 phút setup
- 🚀 **Hiệu suất**: Global CDN + Auto scaling

---

## 🚀 **Option 1: Quick Setup (Recommended)**

### **Cho Windows:**

```powershell
# 1. Download và install AWS CLI
# https://awscli.amazonaws.com/AWSCLIV2.msi

# 2. Configure AWS credentials
aws configure

# 3. Run setup script
powershell -ExecutionPolicy Bypass -File setup-s3-cloudfront.ps1
```

### **Cho Linux/Mac:**

```bash
# 1. Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# 2. Configure AWS credentials
aws configure

# 3. Run setup script
chmod +x setup-cicd.sh
./setup-cicd.sh
```

---

## 🛠️ **Option 2: Manual Setup**

### **Step 1: Build App**

```bash
npm install
npm run build
```

### **Step 2: Create S3 Bucket**

```bash
BUCKET_NAME="your-app-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME --region ap-southeast-1
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html
```

### **Step 3: Upload Files**

```bash
# Upload assets with long cache
aws s3 sync dist/ s3://$BUCKET_NAME/ --cache-control "max-age=31536000" --exclude "*.html"

# Upload HTML with no cache
aws s3 sync dist/ s3://$BUCKET_NAME/ --cache-control "no-cache" --include "*.html"
```

### **Step 4: Setup CloudFront**

```bash
# Create distribution (takes 10-15 minutes)
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

---

## 📋 **Required Prerequisites**

### **1. AWS Account**

- ✅ Free tier eligible
- ✅ Credit card required (but cost ~$1/month)

### **2. AWS CLI**

- **Windows**: Download `.msi` từ AWS
- **Linux/Mac**: `curl` command từ AWS docs

### **3. IAM Permissions**

Cần quyền:

- `s3:*` (S3 full access)
- `cloudfront:*` (CloudFront full access)
- `iam:CreateUser` (nếu setup CI/CD)

---

## 💰 **Cost Breakdown**

```
📊 Monthly Cost Estimate (1-2 visits/day):

S3 Storage (1GB):        $0.025
S3 Requests (1000):      $0.0004
CloudFront (1GB):        $0.085
CloudFront Requests:     $0.0075
Total:                   ~$0.12-1.00/month

vs EC2 t3.micro:         ~$15/month
Savings:                 95%+ ✨
```

---

## 🔄 **CI/CD Setup (Optional)**

### **GitHub Actions**

1. Run setup script với CI/CD option
2. Copy GitHub Secrets từ `github-secrets.txt`
3. Add secrets to repo: Settings → Secrets → Actions
4. Push code → Auto deploy! 🎉

### **Required Secrets:**

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
CLOUDFRONT_DOMAIN
```

---

## 📱 **Testing & Verification**

### **After Setup:**

```bash
# Test S3 direct
curl -I http://YOUR_BUCKET.s3-website-ap-southeast-1.amazonaws.com

# Test CloudFront (wait 10-15 minutes first)
curl -I https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net

# Performance test
curl -w '%{time_total}' -o /dev/null -s https://YOUR_CLOUDFRONT_DOMAIN
```

### **Expected Results:**

- ✅ S3: HTTP 200, HTML content
- ✅ CloudFront: HTTPS redirect, faster response
- ✅ Load time: <2 seconds globally

---

## 🚀 **Future Deployments**

### **Manual:**

```bash
# Windows
powershell -ExecutionPolicy Bypass -File deploy.ps1

# Linux/Mac
./deploy.sh
```

### **CI/CD:**

```bash
git add .
git commit -m "Update app"
git push origin main
# Auto deployment trong 2-3 phút!
```

---

## 🆘 **Troubleshooting**

### **Common Issues:**

| Problem                 | Solution                                  |
| ----------------------- | ----------------------------------------- |
| ❌ **S3 Access Denied** | Check bucket policy, enable public read   |
| ❌ **CloudFront 404**   | Wait 10-15 mins, check error pages config |
| ❌ **Build Failed**     | Run `npm install`, check `dist/` folder   |
| ❌ **AWS CLI Error**    | Run `aws configure`, check credentials    |

### **Debug Commands:**

```bash
# Check AWS credentials
aws sts get-caller-identity

# Check S3 bucket
aws s3 ls s3://YOUR_BUCKET_NAME

# Check CloudFront status
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

---

## 📚 **Documentation**

| Document                       | Purpose            |
| ------------------------------ | ------------------ |
| `S3-CLOUDFRONT-SETUP-GUIDE.md` | Chi tiết từng bước |
| `CICD-SETUP-GUIDE.md`          | Hướng dẫn CI/CD    |
| `AWS-COST-OPTIMIZATION.md`     | Tối ưu chi phí     |

---

## 🎉 **Success Checklist**

- [ ] ✅ AWS CLI installed & configured
- [ ] ✅ React app builds successfully (`npm run build`)
- [ ] ✅ S3 bucket created & public read enabled
- [ ] ✅ Files uploaded to S3 with proper caching
- [ ] ✅ CloudFront distribution created (wait 10-15 mins)
- [ ] ✅ App accessible via HTTPS CloudFront URL
- [ ] ✅ Deploy script works for future updates
- [ ] ✅ (Optional) CI/CD pipeline setup

**🎯 Result:** Professional hosting infrastructure at $1/month! 🚀
