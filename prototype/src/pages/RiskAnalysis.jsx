import { Card, Button, AlertBanner } from "../components";
import { coveragePlans } from "../data/mockData";
import { Shield, Info, Loader2, CheckCircle, MapPin, CloudRain, Wind } from "lucide-react";
import { useState, useEffect } from "react";
import { policyAPI } from "../api/apiClient";

export function RiskAnalysis() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [premiumData, setPremiumData] = useState({});
  const [policyCreated, setPolicyCreated] = useState(false);
  const [baselineRisk, setBaselineRisk] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch baseline AI risk on page load
  useEffect(() => {
    const fetchBaselineRisk = async () => {
      try {
        const res = await policyAPI.calculatePremium({
          userId: user._id || user.id,
          planName: 'Essential'
        });
        setBaselineRisk(res.data);
      } catch (err) {
        console.error("Failed to fetch baseline risk", err);
      }
    };
    fetchBaselineRisk();
  }, [user._id, user.id]);

  const calculatePremium = async (plan) => {
    setLoading(true);
    try {
      const res = await policyAPI.calculatePremium({
        userId: user._id || user.id,
        planName: plan.name
      });
      setPremiumData(prev => ({ ...prev, [plan.id]: res.data }));
      setSelectedPlan(plan);
    } catch (err) {
      console.error("Failed to calculate premium", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const pData = premiumData[selectedPlan.id];
      await policyAPI.createPolicy({
        userId: user._id || user.id,
        planName: selectedPlan.name,
        coverageAmount: selectedPlan.coverage,
        weeklyPremium: pData.weeklyPremium,
        coveredEvents: selectedPlan.id === 'low' ? ['Rain'] : selectedPlan.id === 'medium' ? ['Rain', 'Pollution'] : ['Rain', 'Pollution', 'Curfew', 'Traffic'],
        riskScore: pData.riskScore
      });
      setPolicyCreated(true);
    } catch (err) {
      console.error("Failed to create policy", err);
      alert("Policy creation failed");
    } finally {
      setLoading(false);
    }
  };

  if (policyCreated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Policy Activated!</h1>
        <p className="text-gray-600 text-center max-w-md">
          Your parametric insurance is now live. Any detected disruptions will automatically trigger payouts to your account.
        </p>
        <Button onClick={() => window.location.href = '/'}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Actuarial Pricing & Risk Analysis</h1>
        <p className="text-gray-600">
          Our AI calculates your weekly premium based on real-time environmental data and your personal risk profile.
        </p>
      </div>

      {baselineRisk && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-200 col-span-1 md:col-span-4 flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
               <MapPin className="text-blue-600 w-6 h-6" />
               <div>
                 <p className="text-sm font-bold text-blue-900">Live AI Analysis for {user.city}</p>
                 <p className="text-xs text-blue-700">TensorFlow Neural Network Prediction</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-2xl font-bold text-blue-700">{baselineRisk.riskScore}/100</p>
               <p className="text-xs font-bold uppercase text-blue-600">Overall Risk Score</p>
            </div>
          </Card>
          
          <Card className="p-4 border-l-4 border-l-blue-500">
             <div className="flex justify-between items-start mb-2">
                <CloudRain className="w-5 h-5 text-blue-500" />
             </div>
             <p className="text-2xl font-bold text-gray-900">{(baselineRisk.factors.rainProb * 100).toFixed(0)}%</p>
             <p className="text-xs text-gray-500 font-medium uppercase">Rain Probability</p>
          </Card>
          
          <Card className="p-4 border-l-4 border-l-gray-500">
             <div className="flex justify-between items-start mb-2">
                <Wind className="w-5 h-5 text-gray-500" />
             </div>
             <p className="text-2xl font-bold text-gray-900">{baselineRisk.factors.pollutionIndex}</p>
             <p className="text-xs text-gray-500 font-medium uppercase">Current AQI</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-orange-500">
             <div className="flex justify-between items-start mb-2">
                <span className="text-lg">🚗</span>
             </div>
             <p className="text-2xl font-bold text-gray-900">{baselineRisk.factors.trafficLevel}/100</p>
             <p className="text-xs text-gray-500 font-medium uppercase">Traffic Congestion</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-red-500">
             <div className="flex justify-between items-start mb-2">
                <Shield className="w-5 h-5 text-red-500" />
             </div>
             <p className="text-2xl font-bold text-gray-900">{baselineRisk.factors.zoneRisk}/10</p>
             <p className="text-xs text-gray-500 font-medium uppercase">Historical Zone Risk</p>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {coveragePlans.map((plan) => {
          const pData = premiumData[plan.id];
          return (
            <Card
              key={plan.id}
              className={`flex flex-col h-full border-2 transition-all ${
                selectedPlan?.id === plan.id
                  ? "border-blue-600 ring-4 ring-blue-50"
                  : "border-transparent"
              }`}
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  {plan.id === "medium" && (
                    <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-1">Weekly Premium</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{pData ? pData.weeklyPremium : plan.premium}
                    </span>
                    <span className="text-gray-500">/week</span>
                  </div>
                  {pData && (
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                       Risk Score: {pData.riskScore} (Updated via AI)
                    </p>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0">
                <Button
                  variant={selectedPlan?.id === plan.id ? "primary" : "secondary"}
                  fullWidth
                  onClick={() => calculatePremium(plan)}
                  disabled={loading}
                >
                  {loading && selectedPlan?.id === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Select Plan"
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedPlan && premiumData[selectedPlan.id] && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex flex-col md:flex-row gap-8 p-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Plan Summary: {selectedPlan.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Coverage</p>
                  <p className="font-bold text-gray-900">₹{selectedPlan.coverage}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Rain Risk</p>
                  <p className="font-bold text-gray-900">{(premiumData[selectedPlan.id].factors.rainProb * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">AQI Index</p>
                  <p className="font-bold text-gray-900">{premiumData[selectedPlan.id].factors.pollutionIndex}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Payouts</p>
                  <p className="font-bold text-gray-900">Instant</p>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Button onClick={handlePurchase} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm & Pay"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Our Actuarial Model</h2>
          <p className="text-gray-600">
            We use a transparent pricing model where your premium directly reflects the probability of a claim.
          </p>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
             <code className="block text-sm bg-gray-100 p-2 rounded">
               expected_loss = P(Event) * Avg_Income_Loss
             </code>
             <code className="block text-sm bg-gray-100 p-2 rounded">
               premium = expected_loss + profit_margin
             </code>
             <p className="text-xs text-gray-500 italic">
               *This ensures we can always pay out your claims even during major city-wide disruptions.
             </p>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Exclusions</h2>
          <p className="text-gray-600">
            To keep premiums affordable for all gig workers, we exclude certain rare or extreme events.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {['War & Conflict', 'Global Pandemics', 'Terrorism', 'Self-inflicted Fraud'].map((ex, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-600 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                 <Info className="w-4 h-4 text-gray-400" />
                 <span className="text-sm font-medium">{ex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
