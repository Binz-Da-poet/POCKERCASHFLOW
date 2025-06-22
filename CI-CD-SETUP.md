# 🚀 CI/CD Setup với GitHub Actions

## ✅ **GitHub Actions đã có sẵn!**

Workflow file đã được cập nhật với thông tin mới:

- **File:** `.github/workflows/deploy.yml`
- **Trigger:** Push to `main` or `master` branch
- **Auto-deploy:** S3 + CloudFront invalidation

## 🔧 **Setup Steps:**

### **Step 1: Setup GitHub Repository**

```bash
# Initialize git (nếu chưa có)
git init

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/poker-cashflow.git

# Add all files
git add .

# Commit
git commit -m "Initial commit with AWS deployment setup"
```

### **Step 2: Setup GitHub Secrets**

1. **Vào GitHub repository settings**
2. **Secrets and variables → Actions**
3. **Add repository secrets:**

```
AWS_ACCESS_KEY_ID: [Your AWS Access Key]
AWS_SECRET_ACCESS_KEY: [Your AWS Secret Key]
```

### **Step 3: Get AWS Credentials**

```bash
# Check current credentials
aws sts get-caller-identity

# Hoặc tạo IAM user mới với permissions:
# - S3FullAccess
# - CloudFrontFullAccess
```

### **Step 4: Push Code**

```bash
# Push to main branch
git push -u origin main
```

## 🎯 **Auto-Deployment Flow:**

### **Trigger:**

- ✅ Push to `main` branch
- ✅ Pull request to `main`

### **Actions:**

1. **Checkout code**
2. **Setup Node.js 18**
3. **Install dependencies** (`npm ci`)
4. **Build app** (`npm run build`)
5. **Deploy to S3** (with optimized caching)
6. **Invalidate CloudFront**
7. **Success notification**

### **Result:**

- 🚀 **Auto-deploy** on every push
- ⚡ **~3-5 minutes** deploy time
- 🌍 **Live at:** https://d1vp9iofpvfkkg.cloudfront.net

## 📊 **Benefits:**

| Feature         | Manual Deploy           | CI/CD                    |
| --------------- | ----------------------- | ------------------------ |
| **Deploy time** | Manual run `deploy.ps1` | Auto on push             |
| **Consistency** | Local environment       | Clean Ubuntu             |
| **Rollback**    | Manual revert           | Git revert + auto-deploy |
| **Team work**   | Individual setup        | Shared workflow          |

## 🔒 **Security:**

- ✅ **AWS credentials** trong GitHub Secrets
- ✅ **No hardcoded secrets** trong code
- ✅ **IAM permissions** limited scope

## 🛠️ **Troubleshooting:**

### **Common Issues:**

1. **403 on S3:** Check AWS credentials permissions
2. **Build fails:** Check Node.js version compatibility
3. **CloudFront invalidation fails:** Check distribution ID

### **Debug:**

- **GitHub Actions logs:** Repository → Actions tab
- **Local test:** Run `deploy.ps1` manual

---

## 🎉 **Ready to go!**

**Next steps:**

1. Setup GitHub repo
2. Add AWS secrets
3. Push code
4. Watch magic happen! ✨
