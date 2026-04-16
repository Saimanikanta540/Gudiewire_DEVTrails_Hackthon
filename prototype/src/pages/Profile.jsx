import { Card, Button } from "../components";
import { User, MapPin, Briefcase, TrendingUp, Shield, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { authAPI } from "../api/apiClient";

export function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || (!user._id && !user.id)) {
          setError("No user found in local storage. Please log in again.");
          setLoading(false);
          return;
        }
        const res = await authAPI.getProfile(user._id || user.id);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("User profile not found. Your session may have expired due to a database reset. Please log out and log in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?._id, user?.id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(user._id || user.id, profile);
      setProfile(res.data);
      localStorage.setItem('user', JSON.stringify(res.data)); // Update local storage
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Error</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button onClick={() => {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}>Log Out and Try Again</Button>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gig Worker Profile</h1>
          <p className="text-gray-600">
            Manage your personal details and risk modeling factors.
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col items-center justify-center py-10 text-center">
           <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl mb-4">
              👨‍💼
           </div>
           <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
           <p className="text-gray-500">{profile.email}</p>
           <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
              <Shield className="w-4 h-4" /> Account Verified
           </div>
        </Card>

        <Card className="md:col-span-2">
           <h3 className="text-xl font-bold text-gray-900 border-b pb-4 mb-4">Work & Actuarial Data</h3>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" /> Platform
                 </label>
                 {isEditing ? (
                    <select name="workType" value={profile.workType} onChange={handleChange} className="w-full p-2 border rounded">
                       <option value="Swiggy">Swiggy</option>
                       <option value="Zomato">Zomato</option>
                       <option value="Amazon">Amazon</option>
                    </select>
                 ) : (
                    <p className="text-gray-900 bg-gray-50 p-2 rounded border border-transparent">{profile.workType}</p>
                 )}
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> Work Zone
                 </label>
                 {isEditing ? (
                    <input type="text" name="zone" value={profile.zone} onChange={handleChange} className="w-full p-2 border rounded" />
                 ) : (
                    <p className="text-gray-900 bg-gray-50 p-2 rounded border border-transparent">{profile.city}, {profile.zone}</p>
                 )}
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" /> Avg Daily Income (₹)
                 </label>
                 {isEditing ? (
                    <input type="number" name="avgIncome" value={profile.avgIncome} onChange={handleChange} className="w-full p-2 border rounded" />
                 ) : (
                    <p className="text-gray-900 bg-gray-50 p-2 rounded border border-transparent">₹{profile.avgIncome}</p>
                 )}
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" /> Avg Daily Hours
                 </label>
                 {isEditing ? (
                    <input type="number" name="workHours" value={profile.workHours} onChange={handleChange} className="w-full p-2 border rounded" />
                 ) : (
                    <p className="text-gray-900 bg-gray-50 p-2 rounded border border-transparent">{profile.workHours} hours/day</p>
                 )}
              </div>
           </div>

           <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2">How this affects your policy:</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                 Your <strong>Work Zone ({profile.zone})</strong> determines which API data (OpenWeather, AQI) we use for parametric triggers. 
                 Your <strong>Avg Daily Income (₹{profile.avgIncome})</strong> is used by our Actuarial Service to calculate your Expected Loss and Premium Pricing.
              </p>
           </div>
        </Card>
      </div>
    </div>
  );
}
