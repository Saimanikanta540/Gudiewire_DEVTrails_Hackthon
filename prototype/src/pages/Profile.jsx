import { Card, Button, AlertBanner } from "../components";
import { userProfile, coveragePlans } from "../data/mockData";
import { useState } from "react";
import { Save, Edit2, Check } from "lucide-react";

export function Profile() {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const [selectedPlan, setSelectedPlan] = useState(userProfile.coveragePlan);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = () => {
    setEditing(false);
    // In a real app, this would save to backend
    alert("Profile updated successfully!");
  };

  const getPlanColor = (planId) => {
    return selectedPlan === planId
      ? "bg-blue-50 border-2 border-blue-500"
      : "bg-white border border-gray-200";
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and coverage details</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {editing ? (
            <>
              <Check className="w-4 h-4" />
              Done
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit
            </>
          )}
        </button>
      </div>

      {/* Profile Header */}
      <Card variant="elevated">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-5xl">
            {formData.avatar}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold text-gray-900"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600"
                  disabled
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
                <p className="text-gray-600">{formData.role}</p>
              </>
            )}
            <div className="mt-3 text-sm text-gray-600">
              Member since March 2025 • Verified ✓
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🆔</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">{formData.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Zone
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.zone}
                onChange={(e) => handleInputChange("zone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">{formData.zone}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Average Daily Income (₹)
              </label>
              {editing ? (
                <input
                  type="number"
                  value={formData.avgIncome}
                  onChange={(e) =>
                    handleInputChange("avgIncome", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-800">₹{formData.avgIncome}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Daily Working Hours
              </label>
              {editing ? (
                <input
                  type="number"
                  value={formData.workHours}
                  onChange={(e) =>
                    handleInputChange("workHours", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-800">{formData.workHours} hours</p>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave} variant="primary">
              Save Changes
            </Button>
            <Button
              onClick={() => {
                setFormData(userProfile);
                setEditing(false);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        )}
      </Card>

      {/* Coverage Plan Selection */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Coverage Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coveragePlans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all ${getPlanColor(plan.id)} ${
                selectedPlan === plan.id ? "scale-105 shadow-xl" : ""
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
                {selectedPlan === plan.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="mb-4 py-3 border-y border-gray-200">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-gray-800">
                    ₹{plan.premium}
                  </span>
                  <span className="text-sm text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-700">
                  Coverage: <strong>₹{plan.coverage.toLocaleString()}</strong>
                </p>
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {selectedPlan === plan.id && (
                <Button variant="primary" size="sm" className="w-full">
                  Current Plan
                </Button>
              )}
              {selectedPlan !== plan.id && (
                <Button variant="secondary" size="sm" className="w-full">
                  Upgrade
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Digital Twin Info */}
      <Card variant="elevated">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🤖</span> Your Digital Twin
        </h2>
        <p className="text-gray-700 mb-4">
          We use your profile data to generate AI-powered insights about income protection needs and personalized recommendations.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            <strong>Impact:</strong> Your zone (KPHB-North) has a 65% weather risk during monsoon. We recommend maintaining premium coverage from June–September.
          </p>
        </div>
      </Card>

      {/* Account Settings */}
      <Card>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h2>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <p className="font-semibold text-gray-800">Security</p>
            <p className="text-sm text-gray-600">Change password or enable 2FA</p>
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <p className="font-semibold text-gray-800">Bank Details</p>
            <p className="text-sm text-gray-600">Manage payout accounts</p>
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <p className="font-semibold text-gray-800">Notifications</p>
            <p className="text-sm text-gray-600">Email & SMS preferences</p>
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <p className="font-semibold text-gray-800">Help & Support</p>
            <p className="text-sm text-gray-600">FAQs and contact support</p>
          </button>
        </div>
      </Card>
    </div>
  );
}
