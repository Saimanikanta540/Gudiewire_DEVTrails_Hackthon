import { Card, Button, AlertBanner } from "../components";
import { Users, Gift, Share2, Copy, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { authAPI } from "../api/apiClient";

export function Community() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAPI.getProfile(user._id || user.id);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user._id, user.id]);

  const referralLink = `${window.location.origin}/signup?ref=${profile?.referralCode || 'PROMO'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
     return (
       <div className="flex items-center justify-center h-full">
         <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
       </div>
     );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Community & Referrals</h1>
        <p className="text-gray-600">
          Grow the network and lower premiums for everyone. Earn rewards for every friend who gets protected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated" className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none">
          <div className="flex flex-col items-center text-center p-4">
            <Gift className="w-12 h-12 mb-4 text-blue-200" />
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Referral Earnings</p>
            <p className="text-4xl font-bold my-2">₹{profile?.referralEarnings || 0}</p>
            <p className="text-blue-100 text-xs">Paid instantly on their 1st plan purchase</p>
          </div>
        </Card>

        <Card variant="elevated">
          <div className="flex flex-col items-center text-center p-4">
            <Users className="w-12 h-12 mb-4 text-blue-600" />
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Friends Invited</p>
            <p className="text-4xl font-bold my-2 text-gray-900">{profile?.referralCount || 0}</p>
            <p className="text-gray-500 text-xs">Active members in your network</p>
          </div>
        </Card>

        <Card variant="elevated">
          <div className="flex flex-col items-center text-center p-4">
            <Share2 className="w-12 h-12 mb-4 text-green-600" />
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Network Strength</p>
            <p className="text-4xl font-bold my-2 text-green-600">
              {Math.min((profile?.referralCount || 0) * 10, 100)}%
            </p>
            <p className="text-gray-500 text-xs">Unlocks lower premium rates at 100%</p>
          </div>
        </Card>
      </div>

      <Card title="Your Referral Link">
        <div className="space-y-6">
          <p className="text-gray-600">
            Share this link with other delivery partners. When they sign up and buy their first insurance plan, we'll credit <strong>₹200</strong> to your account.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 font-mono text-blue-600 break-all">
              {referralLink}
            </div>
            <Button 
              className="flex items-center gap-2 shrink-0 h-12"
              onClick={copyToClipboard}
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
             <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                   <Gift className="w-5 h-5 text-green-600" />
                </div>
                <div>
                   <h4 className="font-bold text-gray-900">Invite 5 Friends</h4>
                   <p className="text-sm text-gray-600">Earn ₹1,000 and unlock the "Community Hero" badge.</p>
                </div>
             </div>
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                   <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                   <h4 className="font-bold text-gray-900">Grow the Network</h4>
                   <p className="text-sm text-gray-600">Large communities help us negotiate lower base premiums for everyone.</p>
                </div>
             </div>
          </div>
        </div>
      </Card>

      <AlertBanner 
        type="warning"
        title="Fraud Prevention Alert"
        message="Creating fake accounts to earn referral bonuses will lead to permanent account suspension and loss of coverage. Our AI monitors GPS and activity patterns for fraud."
      />
    </div>
  );
}
