import { Card, Button, AlertBanner } from "../components";
import { simulationScenarios } from "../data/mockData";
import { useState } from "react";
import { Zap, Cloud, AlertCircle } from "lucide-react";

export function Simulation() {
  const [simulating, setSimulating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [claimStatus, setClaimStatus] = useState(null);

  const handleSimulate = (scenario) => {
    setSelectedScenario(scenario);
    setSimulating(true);
    setClaimStatus("processing");

    // Simulate steps
    setTimeout(() => setClaimStatus("processing"), 500);
    setTimeout(() => setClaimStatus("generated"), 1500);
    setTimeout(() => setClaimStatus("verified"), 3000);
    setTimeout(() => {
      setClaimStatus("paid");
      setSimulationResult({
        lostHours: scenario.hourImpact,
        hourlyRate: 80,
        payout: scenario.hourImpact * 80,
        bonus: Math.floor(scenario.hourImpact * 80 * 0.1),
      });
    }, 4500);
  };

  const resetSimulation = () => {
    setSimulating(false);
    setSelectedScenario(null);
    setSimulationResult(null);
    setClaimStatus(null);
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Simulation Mode</h1>
        <p className="text-gray-600">
          Test how ClimateShield AI protects you during different scenarios
        </p>
      </div>

      {/* Alert */}
      <AlertBanner
        type="info"
        title="Simulation Mode Active"
        message="These are practice simulations. No actual claims will be created."
        persistent={true}
      />

      {/* Scenario Selection */}
      {!simulating && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Choose a Scenario
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulationScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                variant="interactive"
                className="cursor-pointer"
                onClick={() => handleSimulate(scenario)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{scenario.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {scenario.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Impact: ~{scenario.hourImpact}hrs
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Zap className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-gray-600 capitalize">
                          {scenario.severity} Severity
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button size="sm" variant="primary">
                      Simulate
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Simulation in Progress */}
      {simulating && selectedScenario && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="text-center">
              <p className="text-sm font-semibold text-blue-600 mb-2">
                SIMULATION IN PROGRESS
              </p>
              <p className="text-3xl mb-4">{selectedScenario.icon}</p>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedScenario.name} Detected
              </h2>
              <p className="text-gray-600">
                ClimateShield AI is processing your claim...
              </p>
            </div>
          </Card>

          {/* Status Steps */}
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">Claim Status</h3>
            <div className="space-y-3">
              {[
                { step: "Event Detection", key: "processing" },
                { step: "Claim Generated", key: "generated" },
                { step: "Verification", key: "verified" },
                { step: "Paid", key: "paid" },
              ].map((item) => {
                const isActive =
                  claimStatus === item.key ||
                  (claimStatus === "paid" &&
                    ["processing", "generated", "verified", "paid"].includes(
                      item.key
                    ));
                const isCompleted = claimStatus === "paid";

                return (
                  <div key={item.key} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        isActive || isCompleted
                          ? "bg-green-500 text-white scale-110"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? "✓" : isActive ? "⏳" : "·"}
                    </div>
                    <span
                      className={`font-semibold ${
                        isActive || isCompleted
                          ? "text-gray-800"
                          : "text-gray-500"
                      }`}
                    >
                      {item.step}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Results - Show when completed */}
          {simulationResult && (
            <>
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="text-center mb-6">
                  <p className="text-sm font-semibold text-green-600 mb-2">
                    ✅ CLAIM PROCESSED & PAID
                  </p>
                  <h3 className="text-2xl font-bold text-green-700">
                    Payout Successful!
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Lost Working Hours</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {simulationResult.lostHours} hrs
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                    <p className="text-3xl font-bold text-gray-800">
                      ₹{simulationResult.hourlyRate}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border-2 border-green-300">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-2">Base Payout</p>
                    <p className="text-4xl font-bold text-green-600">
                      ₹{simulationResult.payout}
                    </p>
                  </div>
                  <div className="border-t border-green-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Community Bonus (10%)</span>
                      <span className="font-semibold text-green-600">
                        +₹{simulationResult.bonus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-green-700 mt-3 pt-3 border-t border-green-200">
                      <span>Total Payout</span>
                      <span>₹{simulationResult.payout + simulationResult.bonus}</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600 mt-4">
                  💡 Amount will be transferred to your registered bank account
                  within 24 hours
                </p>
              </Card>

              {/* Key Insights */}
              <Card>
                <h3 className="font-semibold text-gray-800 mb-3">
                  📊 Simulation Insights
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>
                      At your current coverage level, {selectedScenario.name.toLowerCase()} events are
                      fully covered.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>
                      Upgrading to Premium would add accident coverage and 24/7
                      support.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>
                      Referral bonus: Get ₹200 for every successful referral
                      (max ₹5,000/month).
                    </span>
                  </li>
                </ul>
              </Card>
            </>
          )}

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={resetSimulation}
            >
              Run Another Simulation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
