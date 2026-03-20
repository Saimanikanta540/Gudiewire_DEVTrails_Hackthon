import { Card, AlertBanner, Button, ChartComponent } from "../components";
import {
  dashboardData,
  weeklyEarningsData,
  userProfile,
} from "../data/mockData";
import { TrendingUp, Umbrella, CheckCircle } from "lucide-react";
import { useState } from "react";

export function Dashboard() {
  const [mode, setMode] = useState("live");

  return (
    <div className="space-y-6 pb-8">
      {/* Mode Toggle */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("live")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              mode === "live"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Live Mode
          </button>
          <button
            onClick={() => setMode("simulation")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              mode === "simulation"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Simulation Mode
          </button>
        </div>
      </div>

      {/* Weather Alert */}
      {dashboardData.weatherAlert.active && (
        <AlertBanner
          type="warning"
          title={dashboardData.weatherAlert.message}
          message={`Expected to impact your work for about ${dashboardData.weatherAlert.affectedHours} hours today`}
          persistent={true}
        />
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <Card variant="elevated">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Risk Score</p>
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {dashboardData.riskScore}
              </p>
              <p className="text-sm text-gray-600">{dashboardData.riskLevel}</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
          </div>
        </Card>

        {/* Today's Earnings Card */}
        <Card variant="success">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Today's Earnings</p>
              <p className="text-4xl font-bold text-green-600 mb-2">
                ₹{dashboardData.todayEarnings}
              </p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+5% from average</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </Card>

        {/* Coverage Status Card */}
        <Card variant="success">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">
                Active Coverage
              </p>
              <p className="text-4xl font-bold text-green-600 mb-2">
                {dashboardData.coverageAmount}
              </p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Status: Active</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🛡️</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <ChartComponent
          type="bar"
          title="Weekly Earnings vs Disruptions"
          data={weeklyEarningsData}
          height={350}
        />
        <p className="text-sm text-gray-600 mt-4 border-t border-gray-200 pt-4">
          💡 Your earnings vary based on weather and traffic conditions. Higher disruptions correlate with lower daily income.
        </p>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Coverage Update</h3>
            <p className="text-sm text-gray-600">
              Your plan renews on March 25, 2025
            </p>
          </div>
          <Button>View Plan</Button>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Recent Claim</h3>
            <p className="text-sm text-gray-600">March 15 - Heavy Rain - ₹450</p>
          </div>
          <Button variant="secondary">Details</Button>
        </Card>
      </div>
    </div>
  );
}
