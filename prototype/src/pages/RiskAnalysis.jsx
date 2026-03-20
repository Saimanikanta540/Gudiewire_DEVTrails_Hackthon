import { Card, AlertBanner } from "../components";
import { riskAnalysisData } from "../data/mockData";
import { AlertCircle, TrendingUp, Cloud, Wind } from "lucide-react";

export function RiskAnalysis() {
  const getRiskColor = (score) => {
    if (score >= 70) return "text-red-600";
    if (score >= 50) return "text-orange-600";
    return "text-green-600";
  };

  const getRiskBg = (score) => {
    if (score >= 70) return "bg-red-50";
    if (score >= 50) return "bg-orange-50";
    return "bg-green-50";
  };

  const getRiskBorder = (score) => {
    if (score >= 70) return "border-red-200";
    if (score >= 50) return "border-orange-200";
    return "border-green-200";
  };

  const Circle = ({ score, label, icon, description }) => (
    <div className="flex flex-col items-center">
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${getRiskColor(score)} mb-3 relative`}
      >
        <div
          className={`w-24 h-24 rounded-full absolute ${getRiskBg(score)} border-4 ${getRiskBorder(score)} flex items-center justify-center`}
        >
          <div className="text-3xl">{icon}</div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-gray-800">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${getRiskColor(score)}`}>{score}</p>
        <p className="text-xs text-gray-600 mt-2 w-24">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Analysis</h1>
        <p className="text-gray-600">
          AI-powered analysis of factors affecting your income stability
        </p>
      </div>

      {/* Overall Risk Score - Large Circle */}
      <Card variant="elevated" className="text-center py-8">
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-blue-300 flex items-center justify-center">
              {/* Inner circle */}
              <div className="w-32 h-32 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">
                    {riskAnalysisData.overallScore}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Risk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Medium Risk</h2>
        <p className="text-gray-600">
          Your income has moderate exposure to weather-related disruptions
        </p>
      </Card>

      {/* Risk Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex justify-center">
          <Circle
            score={riskAnalysisData.weather.score}
            label="Weather Risk"
            icon="🌧️"
            description="Heavy rain & monsoon"
          />
        </div>
        <div className="flex justify-center">
          <Circle
            score={riskAnalysisData.pollution.score}
            label="Pollution Risk"
            icon="💨"
            description="Air quality index"
          />
        </div>
        <div className="flex justify-center">
          <Circle
            score={riskAnalysisData.urban.score}
            label="Urban Risk"
            icon="🚗"
            description="Traffic & congestion"
          />
        </div>
      </div>

      {/* Detailed Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Risk Details */}
        <Card variant="warning">
          <div className="flex items-start gap-3 mb-3">
            <Cloud className="w-6 h-6 text-orange-600 flex-shrink-0" />
            <h3 className="font-semibold text-gray-800">Weather Risk</h3>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            {riskAnalysisData.weather.description}
          </p>
          <div className="bg-white rounded p-2 mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">Impact:</p>
            <p className="text-sm text-gray-700">{riskAnalysisData.weather.impact}</p>
          </div>
          <p className="text-xs text-orange-600 font-semibold">
            ⚠️ High Risk Factor
          </p>
        </Card>

        {/* Pollution Risk Details */}
        <Card>
          <div className="flex items-start gap-3 mb-3">
            <Wind className="w-6 h-6 text-gray-600 flex-shrink-0" />
            <h3 className="font-semibold text-gray-800">Pollution Risk</h3>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            {riskAnalysisData.pollution.description}
          </p>
          <div className="bg-blue-50 rounded p-2 mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">Impact:</p>
            <p className="text-sm text-gray-700">{riskAnalysisData.pollution.impact}</p>
          </div>
          <p className="text-xs text-gray-600 font-semibold">ℹ️ Medium Risk Factor</p>
        </Card>

        {/* Urban Risk Details */}
        <Card>
          <div className="flex items-start gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-gray-600 flex-shrink-0" />
            <h3 className="font-semibold text-gray-800">Urban Risk</h3>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            {riskAnalysisData.urban.description}
          </p>
          <div className="bg-blue-50 rounded p-2 mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">Impact:</p>
            <p className="text-sm text-gray-700">{riskAnalysisData.urban.impact}</p>
          </div>
          <p className="text-xs text-gray-600 font-semibold">ℹ️ Medium Risk Factor</p>
        </Card>
      </div>

      {/* Income Loss Prediction */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-2">Expected Income Loss</h3>
            <p className="text-3xl font-bold text-red-600 mb-2">
              ₹{riskAnalysisData.expectedIncomeLoss.min} – ₹
              {riskAnalysisData.expectedIncomeLoss.max}
            </p>
            <p className="text-sm text-red-800 mb-3">
              Probability of occurrence: {(riskAnalysisData.expectedIncomeLoss.probability * 100).toFixed(0)}%
            </p>
            <div className="bg-white rounded p-3">
              <p className="text-sm text-gray-700">
                Based on historical weather patterns in your area, there's a{" "}
                <strong>
                  {(riskAnalysisData.expectedIncomeLoss.probability * 100).toFixed(0)}%
                </strong>{" "}
                chance of losing ₹{riskAnalysisData.expectedIncomeLoss.min}–₹
                {riskAnalysisData.expectedIncomeLoss.max} this month.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Explanation */}
      <Card variant="elevated">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-lg">🤖</span> AI Insight
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {riskAnalysisData.aiExplanation}
        </p>
        <p className="text-sm text-blue-600 mt-4 font-semibold">
          💡 Recommendation: Activate your premium coverage plan to protect ₹400+ per weather event.
        </p>
      </Card>
    </div>
  );
}
