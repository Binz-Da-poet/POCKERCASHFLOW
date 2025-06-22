# 🚀 CI/CD Setup Guide - AWS S3 + CloudFront + GitHub Actions

## 🎯 **Tổng quan**

Setup này sẽ tạo **CI/CD pipeline hoàn toàn tự động** cho ứng dụng Poker Cash Flow của bạn:

- ✅ **Auto deploy** khi push code lên Git
- ✅ **GitHub Actions** miễn phí (2000 phút/tháng)
- ✅ **Build optimization** tự động
- ✅ **Cache invalidation** CloudFront
- ✅ **Chi phí cực thấp**: ~$1/tháng

---

## 🛠️ **Bước 1: Setup Infrastructure**

### **Chạy script setup:**

```bash
# Setup AWS S3 + CloudFront với CI/CD
./setup-cicd.sh
```

**Script này sẽ:**

1. ✅ Tạo S3 bucket với static website hosting
2. ✅ Tạo CloudFront distribution
3. ✅ Tạo IAM user với permissions tối thiểu
4. ✅ Generate GitHub Secrets configuration
5. ✅ Tạo GitHub Actions workflow

---

## 🔐 **Bước 2: Configure GitHub Secrets**

### **Sau khi chạy script, bạn sẽ có file `github-secrets.txt`:**

```bash
# Example nội dung file
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_BUCKET=pockercashflow-1234567890
CLOUDFRONT_DISTRIBUTION_ID=E1PA6795UKMFR9
CLOUDFRONT_DOMAIN=d111111abcdef8.cloudfront.net
```

### **Thêm secrets vào GitHub:**

1. **Mở repository GitHub của bạn**
2. **Vào Settings → Secrets and variables → Actions**
3. **Click "New repository secret"**
4. **Thêm từng secret một:**

| Secret Name                  | Value                      |
| ---------------------------- | -------------------------- |
| `AWS_ACCESS_KEY_ID`          | Từ file github-secrets.txt |
| `AWS_SECRET_ACCESS_KEY`      | Từ file github-secrets.txt |
| `S3_BUCKET`                  | Từ file github-secrets.txt |
| `CLOUDFRONT_DISTRIBUTION_ID` | Từ file github-secrets.txt |
| `CLOUDFRONT_DOMAIN`          | Từ file github-secrets.txt |

---

## 🔄 **Bước 3: GitHub Actions Workflow**

### **File `.github/workflows/deploy.yml` đã được tạo với nội dung:**

```yaml
name: Deploy to AWS S3 + CloudFront

on:
  push:
    branches: [main, master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-southeast-1

      - name: Deploy to S3
        run: |
          # Upload với cache optimization
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }}/ \
            --delete \
            --cache-control "max-age=31536000" \
            --exclude "index.html" \
            --exclude "*.html"

          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }}/ \
            --delete \
            --cache-control "no-cache" \
            --include "*.html"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

---

## 🚀 **Bước 4: Test CI/CD Pipeline**

### **Sau khi setup xong:**

1. **Commit và push code:**

```bash
git add .
git commit -m "Setup CI/CD pipeline"
git push origin main
```

2. **Monitor deployment:**

   - Vào **GitHub Actions tab** trong repository
   - Xem progress của workflow
   - Deployment thường mất **2-3 phút**

3. **Verify deployment:**

```bash
./verify-deployment.sh
```

---

## 📊 **CI/CD Workflow Process**

```mermaid
graph TD
    A[Push to Git] --> B[GitHub Actions Triggered]
    B --> C[Install Dependencies]
    C --> D[Build React App]
    D --> E[Deploy to S3]
    E --> F[Invalidate CloudFront]
    F --> G[Deployment Complete]
    G --> H[App Live in 2-3 mins]
```

---

## 💰 **Cost Breakdown với CI/CD**

### **Monthly Cost (~$1/month):**

| Service            | Cost            | Notes                 |
| ------------------ | --------------- | --------------------- |
| **S3 Storage**     | ~$0.025         | 1GB static files      |
| **S3 Requests**    | ~$0.005         | GET/PUT requests      |
| **CloudFront**     | ~$0.50-1.00     | CDN + data transfer   |
| **GitHub Actions** | **FREE**        | 2000 minutes/month    |
| **IAM User**       | **FREE**        | No charge for users   |
| **Total**          | **~$0.53-1.03** | 📈 95% savings vs EC2 |

---

## 🎯 **Advanced Features**

### **1. Multiple Environments**

```yaml
# Deploy to staging on develop branch
on:
  push:
    branches: [main, develop]
```

### **2. Build Notifications**

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
```

### **3. Custom Cache Headers**

```bash
# Long cache for assets
--cache-control "max-age=31536000, immutable"

# No cache for HTML (SPA routing)
--cache-control "no-cache, no-store, must-revalidate"
```

### **4. Performance Monitoring**

```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **❌ GitHub Actions fail:**

   - Check secrets configuration
   - Verify IAM permissions
   - Review build logs

2. **❌ S3 sync fails:**

   - Check bucket permissions
   - Verify AWS credentials
   - Check bucket name

3. **❌ CloudFront not updating:**
   - Invalidation takes 1-2 minutes
   - Check distribution ID
   - Verify permissions

### **Debug Commands:**

```bash
# Check AWS credentials
aws sts get-caller-identity

# Test S3 sync manually
aws s3 sync dist/ s3://YOUR_BUCKET_NAME/ --dry-run

# Check CloudFront status
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

---

## 🚀 **Next Steps**

### **After successful setup:**

1. **✅ Push code** → Auto deployment
2. **✅ Monitor** via GitHub Actions
3. **✅ Scale** as needed (all automatic)
4. **✅ Enjoy** extremely low costs!

### **Optional Enhancements:**

- Custom domain with Route 53
- SSL certificate with ACM
- Multiple environment setup
- Slack/Discord notifications
- Performance monitoring

---

## 📝 **Summary**

**🎉 Bạn đã có:**

- ✅ Fully automated CI/CD pipeline
- ✅ Cost-optimized AWS infrastructure
- ✅ Production-ready deployment process
- ✅ ~95% cost savings vs traditional hosting

**💡 Benefits:**

- **Developer friendly**: Push code → Deploy automatically
- **Cost effective**: ~$1/month total cost
- **Scalable**: Handle any traffic spikes
- **Reliable**: 99.99% uptime SLA
- **Fast**: Global CDN performance

**🚀 Result:** Professional deployment pipeline at minimal cost!
