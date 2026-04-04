import { Card, Button, AlertBanner } from "../components";
import { simulationScenarios } from "../data/mockData";
import { Play, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { eventAPI } from "../api/apiClient";

export function Simulation() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSimulate = async (scenario) => {
    setIsSimulating(true);
    setActiveScenario(scenario);
    setSimulationResult(null);

    try {
      // Call backend to trigger parametric event
      const res = await eventAPI.triggerEvent({
        eventType: scenario.id.charAt(0).toUpperCase() + scenario.id.slice(1),
        value: scenario.id === 'rain' ? 50 : 250, // Mock values
        threshold: 20,
        location: {
          city: user.city || 'Hyderabad',
          zone: user.zone || 'KPHB',
          lat: 17.44,
          lng: 78.34
        },
        description: `Simulated ${scenario.name} for Phase 2 demo.`
      });

      setSimulationResult({
        success: true,
        message: `Event triggered! ${res.data.claimsCount} claims automatically generated and processed.`,
        details: res.data
      });
    } catch (err) {
      console.error("Simulation failed", err);
      setSimulationResult({
        success: false,
        message: "Simulation failed. Please check backend connection."
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Risk Simulation</h1>
        <p className="text-gray-600">
          Test our parametric triggers and zero-touch claim system by simulating external disruptions.
        </p>
      </div>

      {simulationResult && (
        <AlertBanner
          type={simulationResult.success ? "success" : "error"}
          title={simulationResult.success ? "Success" : "Error"}
          message={simulationResult.message}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {simulationScenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className={`cursor-pointer transition-all border-2 ${
              activeScenario?.id === scenario.id
                ? "border-blue-600 bg-blue-50"
                : "border-transparent hover:border-gray-200"
            }`}
            onClick={() => setActiveScenario(scenario)}
          >
            <div className="flex flex-col items-center text-center p-4">
              <span className="text-5xl mb-4">{scenario.icon}</span>
              <h3 className="font-bold text-gray-900 mb-1">{scenario.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Estimated impact: {scenario.hourImpact} hours
              </p>
              <div
                className={`text-xs font-bold uppercase px-2 py-1 rounded mb-4 ${
                  scenario.severity === "high"
                    ? "bg-red-100 text-red-700"
                    : scenario.severity === "medium"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {scenario.severity} Severity
              </div>
            </div>
          </Card>
        ))}
      </div>

      {activeScenario && (
        <Card className="bg-white border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Scenario: {activeScenario.name}
              </h3>
              <p className="text-gray-600">
                This will trigger our parametric engine to detect {activeScenario.name.toLowerCase()} in your current zone.
                If your policy covers this event, a claim will be auto-generated and paid instantly.
              </p>
            </div>
            <div className="flex gap-4">
               <Button
                variant="secondary"
                onClick={() => {
                  setActiveScenario(null);
                  setSimulationResult(null);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={isSimulating}
                onClick={() => handleSimulate(activeScenario)}
                className="flex items-center gap-2"
              >
                {isSimulating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Run Simulation
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="bg-blue-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">How Zero-Touch Claims Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold">Parametric Detection</h3>
            <p className="text-blue-100 text-sm">Our AI monitors weather stations and AQI sensors in real-time across your work zones.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold">Automated Verification</h3>
            <p className="text-blue-100 text-sm">Once a threshold is crossed (e.g. &gt;10mm rain), the system verifies your policy coverage automatically.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">3</div>
            <h3 className="font-bold">Instant Payout</h3>
            <p className="text-blue-100 text-sm">Claim is generated, fraud checks run in milliseconds, and money is sent to your wallet immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
