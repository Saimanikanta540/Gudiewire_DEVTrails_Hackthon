# ClimateShield AI - Income Protection Platform for Gig Workers

A production-style React.js web application designed to protect gig workers' income from weather-related disruptions. Built with modern UI/UX principles and fintech design patterns.

## 🎯 Project Overview

ClimateShield AI is an AI-powered income protection platform that helps delivery partners and gig workers like Rahul mitigate income loss from weather events, traffic disruptions, and urban hazards.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── Navbar.jsx      # Top navigation bar
│   ├── Card.jsx        # Reusable card component
│   ├── Button.jsx      # Button with variants
│   ├── AlertBanner.jsx # Alert/notification banner
│   ├── Chart.jsx       # Chart components (Recharts)
│   └── index.js        # Component exports
│
├── pages/              # Page components
│   ├── Dashboard.jsx       # Main dashboard overview
│   ├── RiskAnalysis.jsx    # AI-powered risk analysis
│   ├── Simulation.jsx      # Event simulation testing
│   ├── Claims.jsx          # Claims history and details
│   ├── Community.jsx       # Referral and network features
│   ├── Profile.jsx         # User profile and settings
│   └── index.js            # Page exports
│
├── data/
│   └── mockData.js     # Mock data and static content
│
├── App.jsx             # Main app with routing
├── App.css             # App-level styles
├── index.css           # Global styles & Tailwind
└── main.jsx            # Entry point
```

## 🌐 Pages

### 1. **Dashboard**
- Overview cards: Risk Score, Today's Earnings, Active Coverage
- Weather alert banner
- Weekly earnings vs disruptions chart
- Toggle between Live and Simulation modes

### 2. **Risk Analysis**
- Large circular risk score visualization
- Breakdown of risk factors:
  - Weather Risk (72/100)
  - Pollution Risk (45/100)
  - Urban Risk (58/100)
- Expected income loss prediction
- AI-powered insights

### 3. **Simulation**
- Interactive scenario testing
- Real-time claim status tracking
- Simulated payout calculations
- Visual processing steps

### 4. **Claims**
- Complete claims history with status
- Detailed claim breakdown and payout information
- Claims summary statistics
- Receipt download functionality

### 5. **Community**
- Referral program overview
- Network strength progress tracker
- Leaderboard of top referrers
- Fraud protection warnings
- Easy referral link sharing

### 6. **Profile**
- Editable personal information
- Coverage plan selector
- Digital twin AI insights
- Account settings

## 🎨 Design System

- **Primary Color**: Blue (#2563eb)
- **Success Color**: Green
- **Warning Color**: Orange/Red
- **Font**: System UI, Segoe UI, Roboto, sans-serif
- **Spacing**: Tailwind's spacing system
- **Components**: Card-based layout with shadows and rounded corners

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library (300+ SVG icons)
- **Recharts** - Data visualization library
- **PostCSS & Autoprefixer** - CSS processing

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The application runs on `http://localhost:5173/`

## 💰 User Profile (Mock Data)

- **Name**: Rahul
- **Role**: Delivery Partner
- **Location**: Hyderabad, KPHB-North Zone
- **Daily Income**: ₹800 (avg ₹750)
- **Work Hours**: 9 hours/day
- **Risk Score**: 65 (Medium Risk)

## 📊 Key Features

### Interactive Elements
- ✅ Real-time risk score calculation
- ✅ Weather alert notifications
- ✅ Event simulation with animated status tracking
- ✅ Claims processing workflow visualization
- ✅ Editable user profile
- ✅ Coverage plan selection

### Data Visualization
- ✅ Weekly earnings chart (bar chart)
- ✅ Risk assessment visualizations (circular progress)
- ✅ Network strength progress bar
- ✅ Claims status timeline

### User Experience
- ✅ Responsive sidebar navigation
- ✅ Smooth hover and transition effects
- ✅ Alert/notification system
- ✅ Loading states
- ✅ Mode toggle (Live/Simulation)

## 🎯 Use Cases

1. **Dashboard Check-in**: User opens the app to see their daily earnings and current risk level
2. **Risk Assessment**: User explores risk analysis to understand income loss probability
3. **Claim Simulation**: User tests what happens if rain occurs using simulation mode
4. **Claim History**: User reviews past claims and payouts
5. **Referral Growth**: User shares referral link to earn bonuses
6. **Profile Update**: User updates their information and selects coverage plan

## 📝 Mock Data Overview

All data is hardcoded in `src/data/mockData.js`:
- User profile with Rahul's information
- Dashboard overview metrics
- Risk analysis scores
- Weekly earnings chart data
- Claims history (6 claims)
- Community referral data
- Coverage plans

No backend required for demo purposes.

## 🚀 Production Build

```bash
npm run build
```

The optimized build will be in the `dist/` directory, ready for deployment.

## 🔐 Security Notes

- No backend integration required
- No personal data storage
- No authentication system
- Mock data only for demonstration
- Production version would require backend API

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎮 Interactive Demo Features

1. **Simulation Mode**: Test rain event scenarios
2. **Live Mode**: View real-time (mock) data
3. **Profile Editing**: Update user information
4. **Coverage Selection**: Choose different plans
5. **Referral Copying**: Share referral links

## 📄 Component API

### Card Component
```jsx
<Card variant="default|elevated|warning|success|interactive">
  Content here
</Card>
```

### Button Component
```jsx
<Button 
  variant="primary|secondary|success|warning|danger|ghost"
  size="sm|md|lg|xl"
  loading={false}
  onClick={handler}
/>
```

### AlertBanner Component
```jsx
<AlertBanner 
  type="info|success|warning|error"
  title="Title"
  message="Message"
  onClose={handler}
  persistent={false}
/>
```

## 🤝 Contributing

This is a demonstration project for investors and hackathon judges.

## 📄 License

Unlicensed - Demonstration Project

## 🎯 Status

✅ **MVP Ready** - Fully functional demonstration of ClimateShield AI platform
- All 6 pages implemented
- Full routing and navigation  
- Responsive design
- Interactive simulations
- Beautiful fintech UI

---

**Built for**: Investors, Hackathon Judges, Startup Enthusiasts
**Created with**: React + Vite + Tailwind CSS
