import { Card, AlertBanner, Button, ChartComponent } from "../components";
import { weeklyEarningsData } from "../data/mockData";
import { TrendingUp, Umbrella, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { analyticsAPI, policyAPI, authAPI } from "../api/apiClient";

export function Dashboard() {
  const [mode, setMode] = useState("live");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || { _id: "dummy-id-for-hackathon" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user._id || user.id;
        if (!userId || userId === "dummy-id-for-hackathon") {
           // Not logged in or mock user
           setLoading(false);
           return;
        }

        const [analyticsRes, policyRes, riskRes] = await Promise.all([
          analyticsAPI.getWorkerAnalytics(userId).catch(err => {
            if (err.response?.status === 404) throw err;
            return { data: null };
          }),
          policyAPI.getActivePolicy(userId).catch(() => ({ data: null })),
          authAPI.getRiskScore(userId).catch(() => ({ data: null }))
        ]);
        setData(analyticsRes.data);
        setPolicy(policyRes.data);
        setRiskData(riskRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        if (err.response?.status === 404) {
          setError("User session invalid. Please log out and log in again.");
        }
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

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto mt-10 p-10 text-center">
        <div className="text-red-500 mb-4 text-5xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Error</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button onClick={() => {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}>Log Out and Try Again</Button>
      </Card>
    );
  }

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
      {(riskData?.riskLevel === 'HIGH' || riskData?.riskLevel === 'CRITICAL') && mode === "live" && (
        <AlertBanner
          type="warning"
          title="Severe Conditions Expected 🌧️"
          message="Parametric triggers are active. Income loss due to extreme conditions will be automatically covered."
          persistent={true}
        />
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RiskPulse AI Card */}
        <Card variant="elevated">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-600 font-bold">RiskPulse AI™</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    riskData?.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 
                    riskData?.riskLevel === 'CRITICAL' ? 'bg-red-500 text-white' :
                    riskData?.riskLevel === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {riskData?.riskLevel || 'LOW'} RISK
                  </span>
                </div>
                <p className="text-4xl font-bold text-blue-600 mb-1">
                  {riskData?.stabilityScore || 0}<span className="text-lg text-gray-500 font-normal">/100</span>
                </p>
                <p className="text-sm text-gray-500 font-medium">Stability Score</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm font-medium mb-1">Expected Loss</p>
                <p className="text-2xl font-bold text-red-500">₹{riskData?.expectedLoss || 0}</p>
              </div>
            </div>
            {riskData?.suggestion && (
              <div className={`p-2 rounded-lg text-xs font-medium mt-auto ${
                riskData?.riskLevel === 'HIGH' || riskData?.riskLevel === 'CRITICAL' 
                  ? 'bg-red-50 text-red-700 border border-red-100' 
                  : 'bg-blue-50 text-blue-700 border border-blue-100'
              }`}>
                💡 {riskData.suggestion}
              </div>
            )}
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
