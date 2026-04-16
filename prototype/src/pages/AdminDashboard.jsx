import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components';
import apiClient from '../api/apiClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [claims, setClaims] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, eventsRes, claimsRes, leaderboardRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/users'),
        apiClient.get('/admin/events'),
        apiClient.get('/admin/claims'),
        apiClient.get('/admin/referrals/leaderboard')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setClaims(claimsRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleProcessClaim = async (claimId, status) => {
    try {
      await apiClient.post('/admin/process-claim', { claimId, status });
      alert(`Claim ${status} successfully!`);
      fetchAdminData(); // Refresh data
    } catch (err) {
      alert('Failed to process claim: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading Admin Dashboard...</div>;
  }

  const pendingClaims = claims.filter(c => c.status === 'Processing' || c.status === 'Fraud Flagged');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Command Center</h1>
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm overflow-x-auto">
          {['overview', 'users', 'pending', 'claims', 'events', 'referrals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'pending' ? `Approvals (${pendingClaims.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Total Users" className="bg-white">
              <div className="text-3xl font-bold text-blue-600">{stats?.totalUsers}</div>
              <p className="text-sm text-gray-500">Active Gig Workers</p>
            </Card>
            <Card title="Total Payouts" className="bg-white">
              <div className="text-3xl font-bold text-green-600">₹{stats?.totalPayout}</div>
              <p className="text-sm text-gray-500">Claims Distributed</p>
            </Card>
            <Card title="Active Policies" className="bg-white">
              <div className="text-3xl font-bold text-purple-600">{stats?.totalPolicies}</div>
              <p className="text-sm text-gray-500">Enrolled Members</p>
            </Card>
            <Card title="Climate Triggers" className="bg-white">
              <div className="text-3xl font-bold text-orange-600">{stats?.totalEvents}</div>
              <p className="text-sm text-gray-500">Automated Detections</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Pending Approvals" className="bg-white">
               <div className="space-y-4">
                  {pendingClaims.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-8">No pending claims to review.</p>
                  ) : (
                    pendingClaims.slice(0, 5).map(claim => (
                      <div key={claim._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-yellow-400">
                        <div>
                          <p className="font-semibold text-gray-800">{claim.userId?.name}</p>
                          <p className="text-xs text-gray-500">{claim.event} • ₹{claim.payout}</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('pending')}
                          className="text-blue-600 text-sm font-bold hover:underline"
                        >
                          Review
                        </button>
                      </div>
                    ))
                  )}
                  {pendingClaims.length > 5 && (
                     <button onClick={() => setActiveTab('pending')} className="w-full text-center text-sm text-gray-500 hover:text-blue-600">
                        View all {pendingClaims.length} pending
                     </button>
                  )}
               </div>
            </Card>
            
            <Card title="System Growth" className="bg-white">
               <div className="h-48 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-600">+{((stats?.referredUsers / stats?.totalUsers) * 100 || 0).toFixed(1)}%</p>
                    <p className="text-gray-500">Referral-led Growth</p>
                  </div>
               </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'pending' && (
        <Card title="Pending Claim Approvals" className="bg-white overflow-x-auto">
          {pendingClaims.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <p className="text-xl">All clear! 🛡️</p>
              <p>No claims are currently awaiting approval.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event & Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingClaims.map((claim) => (
                  <tr key={claim._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{claim.userId?.name}</div>
                      <div className="text-xs text-gray-500">{claim.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{claim.event}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{claim.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₹{claim.payout}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        claim.status === 'Fraud Flagged' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleProcessClaim(claim._id, 'Paid')}
                        className="text-green-600 hover:text-green-900 font-bold"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleProcessClaim(claim._id, 'Rejected')}
                        className="text-red-600 hover:text-red-900 font-bold"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {activeTab === 'users' && (
        <Card title="User Directory" className="bg-white overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Segment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral Stats</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{user.avatar}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{user.city}, {user.zone}</div>
                    <div className="text-xs text-blue-600 font-mono">{user.referralCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{user.workType}</div>
                    <div className="text-xs font-semibold">{user.vehicleType} • {user.experienceLevel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-bold">{user.referralCount} Invites</div>
                    <div className="text-green-600">₹{user.referralEarnings} Earned</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'claims' && (
        <Card title="Full Claims Audit Trail" className="bg-white overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {claim.userId?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {claim.event}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ₹{claim.payout}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      claim.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                      claim.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">
                    {claim.txnId || '---'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'events' && (
        <Card title="Climate Event Logs" className="bg-white">
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="border-l-4 border-blue-500 p-4 bg-gray-50 rounded-r-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{event.eventType} Detection</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="mt-2 flex space-x-4 text-xs text-gray-500">
                      <span>📍 {event.location.city}, {event.location.zone}</span>
                      <span>⏰ {new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">{event.value}</span>
                    <p className="text-[10px] text-gray-400">Threshold: {event.threshold}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'referrals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Referral Leaderboard" className="bg-white">
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-bold ${
                      index === 0 ? 'bg-yellow-400 text-white' : 
                      index === 1 ? 'bg-gray-300 text-white' : 
                      index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{user.referralCount} referrals</p>
                    <p className="text-xs text-green-600">Earned: ₹{user.referralEarnings}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card title="Network Growth" className="bg-white">
             <div className="h-64 flex items-center justify-center">
                <div className="text-center p-6 bg-blue-50 rounded-full border-4 border-blue-200">
                  <p className="text-sm font-bold text-blue-800">Community Protection Rate</p>
                  <p className="text-5xl font-black text-blue-600">{((stats?.referredUsers / stats?.totalUsers) * 100 || 0).toFixed(1)}%</p>
                  <p className="text-xs text-blue-400 mt-2">Organic Peer-to-Peer Scaling</p>
                </div>
             </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
