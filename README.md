# 🃏 Poker Cash Flow Tracker

**Professional poker cash game management tool** với global CDN deployment và ultra-low cost optimization.

[![Live Demo](https://img.shields.io/badge/🌍_Live_Demo-HTTPS-green)](https://d1vp9iofpvfkkg.cloudfront.net)
[![Cost](https://img.shields.io/badge/💰_Monthly_Cost-$0.05-brightgreen)](./AWS-COST-OPTIMIZATION.md)
[![Deployment](https://img.shields.io/badge/🚀_Auto_Deploy-GitHub_Actions-blue)](./CI-CD-SETUP.md)

## 🎯 **Features**

- 🏆 **Player Management** - Setup multiple players & buy-ins
- 💰 **Chip Values** - Configurable poker chip denominations
- 🎮 **Live Game Tracking** - Real-time chip transfers & transactions
- 📊 **Final Results** - Win/loss calculations & profit distribution
- 📱 **Responsive Design** - Works on desktop, tablet, mobile
- ⚡ **Single Page App** - Fast React-based interface
- 🔒 **HTTPS Security** - CloudFront SSL deployment

## 🏗️ **Tech Stack**

| Layer        | Technology            | Purpose                    |
| ------------ | --------------------- | -------------------------- |
| **Frontend** | React 18 + TypeScript | Modern UI framework        |
| **Styling**  | Tailwind CSS          | Utility-first CSS          |
| **Build**    | Vite                  | Lightning-fast bundler     |
| **Hosting**  | AWS S3                | Static website hosting     |
| **CDN**      | AWS CloudFront        | Global performance + HTTPS |
| **CI/CD**    | GitHub Actions        | Auto-deployment            |

## 🚀 **Quick Start**

### **Development**

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/poker-cashflow.git
cd poker-cashflow

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Production Build**

```bash
# Build for production
npm run build

# Deploy to AWS (manual)
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

## 🌍 **Live Application**

**🔗 HTTPS URL:** https://d1vp9iofpvfkkg.cloudfront.net

### **Game Flow:**

1. **Setup Players** - Add player names and buy-in amounts
2. **Configure Chips** - Set chip values and initial distributions
3. **Track Game** - Record chip transfers between players
4. **Final Results** - View profit/loss calculations

## 📁 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── AnimatedCard.tsx
│   ├── ChipDisplay.tsx
│   └── ChipTransferModal.tsx
├── pages/              # Game phase screens
│   ├── BuyinSetupPage.tsx
│   ├── ChipValuesSetupPage.tsx
│   ├── GamePlayingPage.tsx
│   └── FinalResultsPage.tsx
├── hooks/              # Custom React hooks
│   └── useGameState.tsx
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

## 🌩️ **AWS Architecture**

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Browser   │───▶│  CloudFront  │───▶│   S3 Bucket │
│  (Users)    │    │  (Global CDN)│    │  (Static)   │
└─────────────┘    └──────────────┘    └─────────────┘
      HTTPS              HTTPS              Private
   d1vp9iofpvfkkg.cloudfront.net    pockercashflow-xxx
```

### **Benefits:**

- ⚡ **Global Performance** - ~100ms loading worldwide
- 🔒 **HTTPS Security** - Free SSL certificate
- 💰 **Ultra-low Cost** - $0.05/month for low traffic
- 🛡️ **DDoS Protection** - CloudFront built-in security
- 📈 **Auto-scaling** - Handles traffic spikes

## 💰 **Cost Optimization**

| Service     | Monthly Cost | Usage              |
| ----------- | ------------ | ------------------ |
| S3 Storage  | $0.023       | ~1GB storage       |
| S3 Requests | $0.004       | ~1,000 requests    |
| CloudFront  | $0.085       | ~1GB transfer      |
| **Total**   | **$0.05**    | **1-2 visits/day** |

**📊 99.7% savings** compared to traditional EC2 hosting!

**📋 Detailed analysis:** [AWS-COST-OPTIMIZATION.md](./AWS-COST-OPTIMIZATION.md)

## 🚀 **Deployment Options**

### **1. Manual Deployment**

```bash
# One-time setup required
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

### **2. Auto-Deploy with CI/CD**

```bash
# Setup GitHub Actions (one-time)
# See: CI-CD-SETUP.md

git push origin main  # Triggers auto-deployment
```

### **3. Alternative Platforms**

- **AWS Amplify** - Easier setup, slightly higher cost
- **Vercel** - Zero config, free tier available
- **Netlify** - Free tier with build optimization

## 📚 **Documentation**

| Guide                                            | Description                            |
| ------------------------------------------------ | -------------------------------------- |
| [🏗️ Setup Guide](./S3-CLOUDFRONT-SETUP-GUIDE.md) | Complete AWS S3 + CloudFront setup     |
| [💰 Cost Analysis](./AWS-COST-OPTIMIZATION.md)   | Detailed cost breakdown & optimization |
| [🚀 CI/CD Setup](./CI-CD-SETUP.md)               | GitHub Actions auto-deployment         |
| [🔒 HTTPS Setup](./HTTPS-ONLY-GUIDE.md)          | Secure HTTPS-only configuration        |
| [🌐 Custom Domain](./CUSTOM-DOMAIN-GUIDE.md)     | Add your own domain name               |
| [⚡ Quick Start](./QUICK-START.md)               | Get running in 5 minutes               |

## 🛠️ **Development**

### **Requirements**

- Node.js 18+
- npm or yarn
- AWS CLI (for deployment)

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 **Roadmap**

- [ ] **Database Integration** - Persistent game history
- [ ] **Multi-table Support** - Track multiple games simultaneously
- [ ] **Player Statistics** - Long-term profit/loss tracking
- [ ] **Export Features** - PDF reports, Excel export
- [ ] **Real-time Sync** - Multi-device synchronization
- [ ] **Mobile App** - Native iOS/Android versions

## 📞 **Support**

- **🐛 Bug Reports:** [GitHub Issues](https://github.com/YOUR_USERNAME/poker-cashflow/issues)
- **💡 Feature Requests:** [GitHub Discussions](https://github.com/YOUR_USERNAME/poker-cashflow/discussions)
- **📧 Contact:** your.email@domain.com

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ for the poker community

</div>
