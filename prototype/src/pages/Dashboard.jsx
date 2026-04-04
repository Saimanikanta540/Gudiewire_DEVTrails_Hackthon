import { Card, AlertBanner, Button, ChartComponent } from "../components";
import { weeklyEarningsData } from "../data/mockData";
import { TrendingUp, Umbrella, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { analyticsAPI, policyAPI } from "../api/apiClient";

export function Dashboard() {
  const [mode, setMode] = useState("live");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, policyRes] = await Promise.all([
          analyticsAPI.getWorkerAnalytics(user._id || user.id),
          policyAPI.getActivePolicy(user._id || user.id)
        ]);
        setData(analyticsRes.data);
        setPolicy(policyRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id, user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const riskLevel = data?.riskScore > 70 ? "High Risk" : data?.riskScore > 30 ? "Medium Risk" : "Low Risk";

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
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Live Mode
          </button>
          <button
            onClick={() => setMode("simulation")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              mode === "simulation"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Simulation Mode
          </button>
        </div>
      </div>

      {/* Sandbox Warning Banner */}
      {mode === "simulation" && (
        <AlertBanner
          type="info"
          title="🧪 Sandbox Environment Active"
          message="You are in Simulation Mode. Use this environment to safely trigger extreme weather events and test the zero-touch automated payout pipeline without affecting real financial ledgers."
          persistent={true}
        />
      )}

      {/* Weather Alert */}
      {data?.riskScore > 60 && mode === "live" && (
        <AlertBanner
          type="warning"
          title="Heavy Rain Expected 🌧️"
          message="Parametric triggers are active. Income loss will be automatically covered."
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
                {data?.riskScore || 0}
              </p>
              <p className="text-sm text-gray-600">{riskLevel}</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
          </div>
        </Card>

        {/* Earnings Protected Card */}
        <Card variant="success">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Earnings Protected</p>
              <p className="text-4xl font-bold text-green-600 mb-2">
                ₹{data?.earningsProtected || 0}
              </p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>{data?.claimsCount || 0} Auto-claims paid</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </Card>

        {/* Coverage Status Card */}
        <Card variant={policy ? "success" : "warning"}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">
                Weekly Premium
              </p>
              <p className="text-4xl font-bold text-green-600 mb-2">
                ₹{policy?.weeklyPremium || 0}
              </p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Status: {policy ? 'Active' : 'No Policy'}</span>
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
          data={data?.weeklyEarnings || weeklyEarningsData}
          height={350}
        />
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mode === "live" ? (
           <Card className="flex items-center justify-between">
             <div>
               <h3 className="font-semibold text-gray-800 mb-2">Coverage Details</h3>
               <p className="text-sm text-gray-600">
                 Plan: {policy?.planName || 'Not Selected'}
               </p>
             </div>
             <Button onClick={() => window.location.href='/risk-analysis'}>Upgrade Plan</Button>
           </Card>
        ) : (
           <Card className="flex items-center justify-between border-purple-200 bg-purple-50">
             <div>
               <h3 className="font-semibold text-purple-900 mb-2">Run Sandbox Test</h3>
               <p className="text-sm text-purple-700">
                 Trigger a simulated rain or pollution event.
               </p>
             </div>
             <Button onClick={() => window.location.href='/simulation'} className="bg-purple-600 hover:bg-purple-700">Test Triggers</Button>
           </Card>
        )}

        <Card className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Recent Activity</h3>
            <p className="text-sm text-gray-600">Check your zero-touch claim history</p>
          </div>
          <Button variant="secondary" onClick={() => window.location.href='/claims'}>View Claims</Button>
        </Card>
      </div>
    </div>
  );
}
