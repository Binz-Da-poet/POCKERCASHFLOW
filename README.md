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
├── components/ # Reusable UI components
│ ├── AnimatedCard.tsx
│ ├── ChipDisplay.tsx
│ └── ChipTransferModal.tsx
├── pages/ # Game phase screens
│ ├── BuyinSetupPage.tsx
│ ├── ChipValuesSetupPage.tsx
│ ├── GamePlayingPage.tsx
│ └── FinalResultsPage.tsx
├── hooks/ # Custom React hooks
│ └── useGameState.tsx
├── types/ # TypeScript definitions
└── utils/ # Helper functions

```

## 🌩️ **AWS Architecture**

```

┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ Browser │───▶│ CloudFront │───▶│ S3 Bucket │
│ (Users) │ │ (Global CDN)│ │ (Static) │
└─────────────┘ └──────────────┘ └─────────────┘
HTTPS HTTPS Private
d1vp9iofpvfkkg.cloudfront.net pockercashflow-xxx

````

### **2. Auto-Deploy with CI/CD**

```bash
# Setup GitHub Actions (one-time)
# See: CI-CD-SETUP.md

git push origin main  # Triggers auto-deployment
````

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

## 📞 **Support**

- **📧 Contact:** trannhanhau12061998@gmail.com

---
