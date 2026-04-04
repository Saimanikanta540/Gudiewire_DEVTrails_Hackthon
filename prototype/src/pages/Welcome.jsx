import { Link, Navigate } from 'react-router-dom';
import { Shield, Zap, CloudLightning, Clock, CheckCircle } from 'lucide-react';

export function Welcome() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">ClimateShield</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600 font-semibold px-4 py-2 transition-colors">
            Login
          </Link>
          <Link to="/signup" className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase mb-2 border border-blue-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            Phase 2 Prototype Live
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            AI-Powered Income Protection for <span className="text-blue-600">Gig Workers</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get paid instantly when bad weather, pollution, or external disruptions stop you from working. No manual claims required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link to="/signup" className="bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:-translate-y-1">
               Get Covered Now <Zap className="w-5 h-5 fill-current" />
            </Link>
            <Link to="/login" className="bg-white text-gray-800 text-lg font-bold px-8 py-4 rounded-xl hover:bg-gray-50 border-2 border-gray-200 transition-all flex items-center justify-center">
               Sign in to Dashboard
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-medium pt-8">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> ₹30,000 Max Coverage</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Zero-Touch Payouts</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Dynamic AI Pricing</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24">
           <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 text-left hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                 <CloudLightning className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Parametric Triggers</h3>
              <p className="text-gray-600 leading-relaxed">Smart sensors and APIs detect rain, pollution, and traffic to automatically monitor your working conditions in real-time.</p>
           </div>
           <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 text-left hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                 <Zap className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Zero-Touch Claims</h3>
              <p className="text-gray-600 leading-relaxed">Say goodbye to tedious paperwork. Our AI auto-verifies disruptions and approves your claims instantly without human intervention.</p>
           </div>
           <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 text-left hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 border border-purple-100">
                 <Clock className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Payouts</h3>
              <p className="text-gray-600 leading-relaxed">Funds are deposited directly into your linked bank account or wallet within seconds of a severe weather event being verified.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
