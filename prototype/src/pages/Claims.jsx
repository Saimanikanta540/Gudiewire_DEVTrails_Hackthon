import { Card, Button, ChartComponent } from "../components";
import { Loader2, CheckCircle, Clock, AlertTriangle, ExternalLink, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { claimAPI } from "../api/apiClient";

export function Claims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [formData, setFormData] = useState({
    event: 'Rain',
    lostHours: 2,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchClaims = async () => {
    try {
      const res = await claimAPI.getClaims(user._id || user.id);
      setClaims(res.data);
    } catch (err) {
      console.error("Failed to fetch claims", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [user._id, user.id]);

  const handleManualClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await claimAPI.requestClaim({
        userId: user._id || user.id,
        event: formData.event,
        lostHours: Number(formData.lostHours),
        description: formData.description
      });
      setShowModal(false);
      setFormData({ event: 'Rain', lostHours: 2, description: '' });
      fetchClaims(); // Refresh the list
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowDetails = (claim) => {
    setSelectedClaim(claim);
    setShowDetailsModal(true);
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'fraud flagged': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Zero-Touch Claims</h1>
          <p className="text-gray-600">
            Real-time status of your automated insurance payouts.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
          <Button variant="secondary" onClick={() => setShowModal(true)} className="flex items-center gap-2 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
            <Plus className="w-4 h-4" /> File Manual Query
          </Button>
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-blue-700 text-sm font-medium">
             Total Payouts: ₹{claims.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.payout, 0)}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="max-w-md w-full relative z-50 bg-white">
            <h2 className="text-2xl font-bold mb-4">File Manual Claim</h2>
            <p className="text-sm text-gray-600 mb-6">If the system missed a disruption, you can file a query for manual review.</p>
            <form onSubmit={handleManualClaim} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disruption Type</label>
                <select 
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  value={formData.event}
                  onChange={(e) => setFormData({...formData, event: e.target.value})}
                >
                  <option value="Rain">Rain</option>
                  <option value="Pollution">Pollution</option>
                  <option value="Curfew">Curfew</option>
                  <option value="Traffic">Traffic Jam</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours Lost</label>
                <input 
                  type="number" 
                  min="1" max="16"
                  required
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  value={formData.lostHours}
                  onChange={(e) => setFormData({...formData, lostHours: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description & Location</label>
                <textarea 
                  required
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 h-24"
                  placeholder="Explain the issue and specific location..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Query"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showDetailsModal && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6">
          <Card className="max-w-2xl w-full relative z-50 bg-white max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-full flex items-center justify-center text-2xl sm:text-3xl shrink-0">
                  {selectedClaim.eventIcon || '📝'}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedClaim.event}</h2>
                  <p className="text-xs sm:text-sm text-gray-500">{new Date(selectedClaim.date).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <span className={`text-xs uppercase font-bold px-3 py-1 rounded-full ${getStatusStyle(selectedClaim.status)}`}>
                  {selectedClaim.status}
                </span>
                {selectedClaim.txnId && (
                   <p className="text-[10px] text-gray-400 mt-2 font-mono break-all">{selectedClaim.txnId}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-6">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase mb-1">Lost Hours</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{selectedClaim.lostHours.toFixed(1)} hrs</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase mb-1">Hourly Rate</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">₹{selectedClaim.hourlyRate}</p>
              </div>
              <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-100 col-span-2 sm:col-span-1">
                <p className="text-[10px] sm:text-xs text-blue-500 font-bold uppercase mb-1">Total Payout</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">₹{selectedClaim.payout}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase mb-2">Claim Description</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 leading-relaxed italic">
                "{selectedClaim.description}"
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase mb-3">Automation Timeline</h3>
              <div className="space-y-3">
                {selectedClaim.steps?.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {step.completed ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : <Clock className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </div>
                    <div className="flex-1 border-b border-gray-50 pb-2">
                       <p className={`text-xs sm:text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.step}</p>
                       <p className="text-[9px] sm:text-[10px] text-gray-400">{step.completed ? 'Success' : 'Pending'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t mt-auto">
              <Button onClick={() => setShowDetailsModal(false)} className="w-full sm:w-auto">Close Details</Button>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 relative z-10">
        {claims.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-gray-500">
             <Clock className="w-12 h-12 mb-4 opacity-20" />
             <p>No claims found. They will appear here automatically when events are triggered.</p>
          </Card>
        ) : (
          claims.map((claim) => (
            <Card key={claim._id} className="hover:border-blue-200 transition-colors">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                    {claim.eventIcon || '⚠️'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{claim.event}</h3>
                    <p className="text-xs text-gray-500">{new Date(claim.date).toLocaleDateString()} • {claim.lostHours.toFixed(1)} hours lost</p>
                  </div>
                </div>

                <div className="flex-1 md:px-10">
                   <div className="flex gap-2 mb-2">
                      {claim.steps?.map((step, idx) => (
                        <div 
                          key={idx} 
                          className={`h-1.5 flex-1 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`}
                          title={step.step}
                        />
                      ))}
                   </div>
                   <p className="text-[10px] text-gray-400 uppercase font-bold text-center">
                      Automation Pipeline Status
                   </p>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₹{claim.payout}</p>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getStatusStyle(claim.status)}`}>
                      {claim.status}
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => handleShowDetails(claim)} className="flex items-center gap-1">
                    Details <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              {claim.fraudAlerts?.length > 0 && (
                <div className="mt-4 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600 flex items-center gap-2">
                   <AlertTriangle className="w-3 h-3" />
                   <span>Security Alert: {claim.fraudAlerts[0]}</span>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
         <Card title="How we verify claims">
            <div className="space-y-4">
               <p className="text-sm text-gray-600">
                  Our Zero-Touch system uses "Oracles" (trusted data feeds) to verify environmental conditions.
               </p>
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                     <CheckCircle className="w-4 h-4 text-green-500" />
                     <span>GPS Geofencing (Verified)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                     <CheckCircle className="w-4 h-4 text-green-500" />
                     <span>Weather Station Data (Verified)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                     <CheckCircle className="w-4 h-4 text-green-500" />
                     <span>AQI Sensor Network (Verified)</span>
                  </div>
               </div>
            </div>
         </Card>
         <Card title="Payout Speed">
            <div className="flex items-center gap-8 py-4">
               <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">2.4s</p>
                  <p className="text-xs text-gray-500">Detection to Claim</p>
               </div>
               <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">15ms</p>
                  <p className="text-xs text-gray-500">Fraud Check</p>
               </div>
               <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">Instant</p>
                  <p className="text-xs text-gray-500">Payout Trigger</p>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
