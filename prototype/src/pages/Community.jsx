import { Card, Button, AlertBanner } from "../components";
import { communityData } from "../data/mockData";
import { Users, Link as LinkIcon, TrendingUp, Award } from "lucide-react";
import { useState } from "react";

export function Community() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(communityData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const networkPercentage = (communityData.networkStrength.current / communityData.networkStrength.target) * 100;

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">
          Grow your network and unlock better coverage for everyone
        </p>
      </div>

      {/* Key Message */}
      <Card variant="elevated" className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <div className="flex items-start gap-4">
          <Users className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-green-900 mb-2">
              {communityData.benefits}
            </h2>
            <p className="text-green-800">
              By referring other gig workers, you help build a stronger, more resilient community while enjoying lower premiums and better coverage.
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referrals Card */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Active Referrals</p>
              <p className="text-4xl font-bold text-blue-600">
                {communityData.referrals.active}
              </p>
            </div>
            <Award className="w-8 h-8 text-blue-500" />
          </div>
          <div className="bg-blue-50 rounded p-3 mb-3">
            <p className="text-sm text-gray-700">
              <strong>Referral Earnings:</strong>
            </p>
            <p className="text-lg font-bold text-blue-600 mt-1">
              ₹{communityData.referrals.totalEarned}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              This month bonus: +₹{communityData.referrals.bonus}
            </p>
          </div>
        </Card>

        {/* Network Strength */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Network Strength</p>
              <p className="text-4xl font-bold text-blue-600">
                {communityData.networkStrength.current}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${networkPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600">
            {communityData.networkStrength.target - communityData.networkStrength.current} more referrals until next level
          </p>
        </Card>
      </div>

      {/* Referral Program Benefits */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Referral Program</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-gray-800">Share Your Link</p>
              <p className="text-sm text-gray-600">
                Send your unique referral link to friends and other delivery partners
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-gray-800">They Sign Up</p>
              <p className="text-sm text-gray-600">
                They create an account using your referral link on ClimateShield AI
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold text-gray-800">Get Bonus</p>
              <p className="text-sm text-gray-600">
                Earn ₹200 for every successful referral (max ₹5,000/month)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
              4
            </div>
            <div>
              <p className="font-semibold text-gray-800">Unlock Benefits</p>
              <p className="text-sm text-gray-600">
                Every 5 referrals = 1% discount on your premium (max 15%)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Referral Link */}
      <Card variant="elevated">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Referral Link</h2>
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-blue-300 mb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <LinkIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <code className="text-sm text-gray-700 truncate font-mono bg-white px-2 py-1 rounded">
                {communityData.referralLink}
              </code>
            </div>
            <Button
              size="sm"
              onClick={handleCopyLink}
              className="flex-shrink-0"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Share this link on WhatsApp, Facebook, Instagram, or email to refer others. Tracking is automatic!
        </p>
      </Card>

      {/* Fraud Warning */}
      <AlertBanner
        type="warning"
        title="⚠️ Fraud Protection"
        message={communityData.fraudWarning}
        persistent={true}
      />

      {/* Leaderboard Preview */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Top Referrers</h2>
        <div className="space-y-3">
          {[
            { rank: 1, name: "Priya M.", referrals: 45, earnings: 9000 },
            { rank: 2, name: "Amit K.", referrals: 38, earnings: 7600 },
            { rank: 3, name: "Neha S.", referrals: 32, earnings: 6400 },
            { rank: 4, name: "You", referrals: 12, earnings: 2400, isYou: true },
          ].map((referrer) => (
            <div
              key={referrer.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                referrer.isYou
                  ? "bg-blue-50 border border-blue-300"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-white">
                  {referrer.rank === 1 ? "🥇" : referrer.rank === 2 ? "🥈" : referrer.rank === 3 ? "🥉" : referrer.rank}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{referrer.name}</p>
                  <p className="text-xs text-gray-600">{referrer.referrals} referrals</p>
                </div>
              </div>
              <p className="font-bold text-gray-800">₹{referrer.earnings}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Call to Action */}
      <Card variant="elevated" className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Grow?</h2>
        <p className="text-gray-600 mb-4">
          Start referring today and help your community thrive
        </p>
        <Button size="lg" onClick={handleCopyLink}>
          Copy & Share Your Link
        </Button>
      </Card>
    </div>
  );
}
