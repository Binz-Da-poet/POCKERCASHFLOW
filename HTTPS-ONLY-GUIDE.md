# 🔒 HTTPS-Only Access Setup Guide

## 🎯 **Mục tiêu:**

- ✅ **HTTPS only:** https://d1vp9iofpvfkkg.cloudfront.net
- ❌ **Block HTTP:** No S3 direct access

## 🔧 **Method 1: Simple Block (Recommended)**

### Step 1: Run Script

```bash
.\https-only-setup.bat
```

### Step 2: Update CloudFront Origin (Manual)

1. Go to **AWS Console → CloudFront → Distribution E3GUYCNLRRQECZ**
2. **Origins tab → Edit origin**
3. **Change Origin domain from:**
   ```
   FROM: pockercashflow-1750603012.85526.s3-website-ap-northeast-1.amazonaws.com
   TO:   pockercashflow-1750603012.85526.s3.ap-northeast-1.amazonaws.com
   ```
4. **Origin access:** Origin access control settings (recommended)
5. **Create OAC** if needed
6. **Save changes**

### Step 3: Update S3 Bucket Policy

CloudFront will suggest the bucket policy - copy and apply it.

## 🔧 **Method 2: Keep Current Setup**

### Simple approach:

1. **Don't change anything**
2. **CloudFront already redirects HTTP → HTTPS**
3. **S3 direct access** is less secure but still HTTP

## 📊 **Comparison:**

| Method         | HTTPS Access                             | HTTP Block             | Complexity |
| -------------- | ---------------------------------------- | ---------------------- | ---------- |
| **Current**    | ✅ https://d1vp9iofpvfkkg.cloudfront.net | ❌ S3 still accessible | Simple     |
| **HTTPS-only** | ✅ https://d1vp9iofpvfkkg.cloudfront.net | ✅ S3 blocked          | Medium     |

## 🚀 **Benefits of HTTPS-only:**

- 🔒 **Better Security** - No HTTP access points
- 🚫 **Single Entry Point** - Only CloudFront
- ⚡ **Performance** - CDN caching only
- 🛡️ **DDoS Protection** - CloudFront built-in

## ⚠️ **Considerations:**

- **Setup complexity** - Requires Origin Access Control
- **Troubleshooting** - More complex if issues arise
- **Deploy script** - May need updates

---

**Recommendation:** Try Method 1 first. If issues arise, can always revert with `.\restore-permissions.bat`
