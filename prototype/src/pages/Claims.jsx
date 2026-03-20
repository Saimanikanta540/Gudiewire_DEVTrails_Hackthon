import { Card, Button } from "../components";
import { claimsHistory, detailedClaim } from "../data/mockData";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Calendar,
  DollarSign,
} from "lucide-react";

export function Claims() {
  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return (
          <CheckCircle className="w-5 h-5 text-green-600" />
        );
      case "processing":
        return (
          <Clock className="w-5 h-5 text-blue-600 animate-spin" />
        );
      case "rejected":
        return (
          <AlertCircle className="w-5 h-5 text-red-600" />
        );
      default:
        return null;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-50";
      case "processing":
        return "bg-blue-50";
      case "rejected":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Claims History</h1>
        <p className="text-gray-600">
          Track all your submitted claims and payouts
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="success">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Claims</p>
            <p className="text-3xl font-bold text-green-600">{claimsHistory.length}</p>
            <p className="text-xs text-gray-600 mt-2">All time</p>
          </div>
        </Card>

        <Card variant="success">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Paid</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{claimsHistory.reduce((sum, c) => (c.status === "paid" ? sum + c.payout : sum), 0)}
            </p>
            <p className="text-xs text-gray-600 mt-2">From successful claims</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Processing</p>
            <p className="text-3xl font-bold text-blue-600">
              {claimsHistory.filter((c) => c.status === "processing").length}
            </p>
            <p className="text-xs text-gray-600 mt-2">Active claims</p>
          </div>
        </Card>
      </div>

      {/* Featured Detailed Claim */}
      <Card variant="elevated">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Latest Claim Details
            </h2>
            <p className="text-sm text-gray-600">
              Claim ID: {detailedClaim.txnId}
            </p>
          </div>
          <span className="text-3xl">{detailedClaim.eventIcon}</span>
        </div>

        {/* Claim Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Date</p>
            <p className="font-semibold text-gray-800">
              {new Date(detailedClaim.date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Event</p>
            <p className="font-semibold text-gray-800">{detailedClaim.event}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Lost Hours</p>
            <p className="font-semibold text-gray-800">{detailedClaim.lostHours} hrs</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <div className="flex items-center gap-1">
              {getStatusIcon(detailedClaim.status)}
              <span className="font-semibold text-gray-800">
                {detailedClaim.status.charAt(0).toUpperCase() +
                  detailedClaim.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Steps */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Claim Progress</h3>
          <div className="flex items-center justify-between">
            {detailedClaim.statusSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.completed ? "✓" : index + 1}
                </div>
                <p className="text-xs text-center font-semibold text-gray-700 justify-self-end">
                  {step.step}
                </p>
                {index < detailedClaim.statusSteps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 mt-4 ${
                      step.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                    style={{ width: "40px" }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payout Details */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Payout Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Base Payout</span>
              <span className="font-semibold">₹{detailedClaim.basePayout}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Community Bonus</span>
              <span className="font-semibold text-green-600">+₹{detailedClaim.bonus}</span>
            </div>
            <div className="border-t border-green-200 pt-2 flex justify-between items-center text-lg font-bold text-green-700">
              <span>Total</span>
              <span>₹{detailedClaim.totalPayout}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Paid on</p>
            <p className="font-semibold text-gray-800">{detailedClaim.paidDate}</p>
          </div>
          <Button variant="secondary">Download Receipt</Button>
        </div>
      </Card>

      {/* Claims List */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Claims</h2>
        <div className="space-y-3">
          {claimsHistory.map((claim) => (
            <Card
              key={claim.id}
              variant="interactive"
              className={getStatusBg(claim.status)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-3xl">{claim.eventIcon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{claim.event}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(claim.date).toLocaleDateString()} • {claim.lostHours}
                      hrs lost
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800 mb-1">
                    ₹{claim.payout}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-sm font-semibold">
                    {getStatusIcon(claim.status)}
                    <span
                      className={
                        claim.status === "paid"
                          ? "text-green-600"
                          : claim.status === "processing"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }
                    >
                      {claim.statusLabel}
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
