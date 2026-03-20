// User Profile Data
export const userProfile = {
  id: 1,
  name: "Badari",
  role: "Delivery Partner",
  city: "ongole",
  zone: "ongole",
  avatar: "👨‍💼",
  dailyIncome: 1100,
  workHours: 14,
  avgIncome: 1050,
  coveragePlan: "medium",
};

// Dashboard Overview
export const dashboardData = {
  riskScore: 65,
  riskLevel: "Medium Risk",
  todayEarnings: 620,
  activeCoverage: true,
  coverageAmount: "₹15,000",
  weatherAlert: {
    active: true,
    message: "Heavy Rain Expected 🌧️",
    severity: "high",
    affectedHours: 4,
  },
};

// Weekly Earnings Chart Data
export const weeklyEarningsData = [
  { day: "Mon", earnings: 850, disruptions: 2 },
  { day: "Tue", earnings: 920, disruptions: 1 },
  { day: "Wed", earnings: 650, disruptions: 5 },
  { day: "Thu", earnings: 800, disruptions: 2 },
  { day: "Fri", earnings: 1100, disruptions: 0 },
  { day: "Sat", earnings: 950, disruptions: 3 },
  { day: "Sun", earnings: 780, disruptions: 4 },
];

// Risk Analysis Data
export const riskAnalysisData = {
  overallScore: 65,
  weather: {
    score: 72,
    risk: "High",
    description: "Heavy monsoon season approaching",
    impact: "Rain can reduce your working hours by 40-50%",
  },
  pollution: {
    score: 45,
    risk: "Medium",
    description: "Air quality index moderate",
    impact: "May cause mild discomfort during peak hours",
  },
  urban: {
    score: 58,
    risk: "Medium",
    description: "High traffic during peak hours",
    impact: "Can cause 10-20% delay in deliveries",
  },
  expectedIncomeLoss: {
    min: 300,
    max: 500,
    probability: 0.65,
  },
  aiExplanation:
    "Based on historical data, weather conditions pose the highest risk to your income stability. Our AI recommends prioritizing coverage during monsoon season.",
};

// Claims History
export const claimsHistory = [
  {
    id: 1,
    date: "2025-03-15",
    event: "Heavy Rain",
    eventIcon: "🌧️",
    lostHours: 5,
    hourlyRate: 80,
    payout: 400,
    status: "paid",
    statusLabel: "Paid",
    txnId: "CLM-2025-001",
  },
  {
    id: 2,
    date: "2025-03-10",
    event: "Urban Traffic Jam",
    eventIcon: "🚗",
    lostHours: 3,
    hourlyRate: 80,
    payout: 240,
    status: "paid",
    statusLabel: "Paid",
    txnId: "CLM-2025-002",
  },
  {
    id: 3,
    date: "2025-03-05",
    event: "Heatwave Alert",
    eventIcon: "☀️",
    lostHours: 4,
    hourlyRate: 80,
    payout: 320,
    status: "processing",
    statusLabel: "Processing",
    txnId: "CLM-2025-003",
  },
  {
    id: 4,
    date: "2025-02-28",
    event: "Flooding",
    eventIcon: "🌊",
    lostHours: 8,
    hourlyRate: 80,
    payout: 640,
    status: "paid",
    statusLabel: "Paid",
    txnId: "CLM-2025-004",
  },
];

// Detailed Claim (Featured)
export const detailedClaim = {
  id: 1,
  date: "2025-03-15",
  event: "Heavy Rain",
  eventIcon: "🌧️",
  description: "Severe rainfall in KPHB area caused work disruption",
  lostHours: 5,
  hourlyRate: 80,
  basePayout: 400,
  bonus: 50,
  totalPayout: 450,
  status: "paid",
  statusSteps: [
    { step: "Event Detected", completed: true },
    { step: "Claim Generated", completed: true },
    { step: "Verified", completed: true },
    { step: "Paid", completed: true },
  ],
  paidDate: "2025-03-16",
  txnId: "CLM-2025-001",
};

// Community Data
export const communityData = {
  referrals: {
    active: 12,
    totalEarned: 2400,
    bonus: 200,
  },
  networkStrength: {
    current: 45,
    target: 100,
    description: "Network strength affects your premium rates",
  },
  benefits:
    "More users → lower premiums → better coverage for everyone in your community",
  referralLink: "https://climateshield.ai/refer/RAHUL2025",
  fraudWarning:
    "⚠️ Fake or duplicate referrals will be invalid. Only genuine referrals count.",
};

// Coverage Plans
export const coveragePlans = [
  {
    id: "low",
    name: "Basic",
    premium: 299,
    coverage: 5000,
    description: "Essential coverage for occasional disruptions",
    features: ["Rain Coverage", "Basic Support", "Monthly Payouts"],
  },
  {
    id: "medium",
    name: "Essential",
    premium: 599,
    coverage: 15000,
    description: "Best for most delivery partners",
    features: [
      "Rain + Heatwave Coverage",
      "Priority Support",
      "Weekly Payouts",
      "Community Bonus",
    ],
  },
  {
    id: "high",
    name: "Premium",
    premium: 999,
    coverage: 30000,
    description: "Maximum protection and benefits",
    features: [
      "All Weather Coverage",
      "24/7 Support",
      "Instant Payouts",
      "Community + AI Benefits",
      "Accident Coverage",
    ],
  },
];

// Simulation Data
export const simulationScenarios = [
  {
    id: "rain",
    name: "Rain Event",
    icon: "🌧️",
    hourImpact: 5,
    severity: "high",
  },
  {
    id: "heat",
    name: "Heatwave",
    icon: "☀️",
    hourImpact: 4,
    severity: "high",
  },
  {
    id: "traffic",
    name: "Traffic Jam",
    icon: "🚗",
    hourImpact: 3,
    severity: "medium",
  },
  {
    id: "pollution",
    name: "High Pollution",
    icon: "💨",
    hourImpact: 2,
    severity: "low",
  },
];
