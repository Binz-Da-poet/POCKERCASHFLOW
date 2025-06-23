# 🃏 Poker Cash Flow Tracker

**Professional poker cash game management tool** - Ứng dụng quản lý game poker cash flow
[![Live Demo](https://img.shields.io/badge/🌍_Live_Demo-HTTPS-green)](https://d1vp9iofpvfkkg.cloudfront.net)
[![GitHub Actions](https://img.shields.io/badge/🚀_Auto_Deploy-GitHub_Actions-blue)](./.github/workflows/deploy.yml)

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
git clone https://github.com/Binz-Da-poet/POCKERCASHFLOW.git
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

# Preview production build
npm run preview
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
├── components/           # Reusable UI components
│   ├── AnimatedCard.tsx
│   ├── ChipDisplay.tsx
│   ├── ChipTransferModal.tsx
│   └── NotificationToast.tsx
├── pages/               # Game phase screens
│   ├── BuyinSetupPage.tsx
│   ├── ChipValuesSetupPage.tsx
│   ├── PlayersSetupPage.tsx
│   ├── GamePlayingPage.tsx
│   ├── FinalChipsInputPage.tsx
│   └── FinalResultsPage.tsx
├── hooks/               # Custom React hooks
│   └── useGameState.tsx
├── types/               # TypeScript definitions
│   ├── gameState.tsx
│   ├── playerTypes.tsx
│   ├── chipTypes.tsx
│   └── transactionTypes.tsx
├── utils/               # Helper functions
│   └── formatters.tsx
├── layouts/             # Layout components
│   └── MainLayout.tsx
├── routes/              # Routing configuration
│   └── index.tsx
└── assets/              # Static assets
    ├── chip/            # Chip images
    └── background/      # Background images
```

## 🌩️ **AWS Architecture**

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Browser   │───▶│  CloudFront  │───▶│  S3 Bucket  │
│   (Users)   │    │ (Global CDN) │    │  (Static)   │
└─────────────┘    └──────────────┘    └─────────────┘
     HTTPS              HTTPS             Private
d1vp9iofpvfkkg.cloudfront.net    pockercashflow-xxx
```

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

### **Key Components**

- **useGameState Hook** - Centralized state management for game data
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **TypeScript** - Full type safety throughout the application
- **Vite** - Fast development and optimized production builds

## 🎮 **Game Phases**

1. **Buy-in Setup** - Set initial buy-in amounts
2. **Players Setup** - Add player names and details
3. **Chip Values** - Configure chip denominations
4. **Game Playing** - Track live chip transfers
5. **Final Chips** - Input final chip counts
6. **Results** - Calculate and display final profits/losses

## 🚀 **Deployment**

The application is automatically deployed to AWS S3 + CloudFront via GitHub Actions when code is pushed to the main branch.

**Live URL:** https://d1vp9iofpvfkkg.cloudfront.net

## 📞 **Support**

- **📧 Contact:** trannhanhau12061998@gmail.com

---

**Made with ❤️ for poker enthusiasts**
