import { Bell, User, LogOut } from "lucide-react";
import { userProfile } from "../data/mockData";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || userProfile;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/welcome');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-blue-600">ClimateShield AI</h1>
          <span className="text-2xl">🌧️</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="font-semibold text-gray-800">{user.name || userProfile.name}</p>
              <p className="text-sm text-gray-600">{user.role || userProfile.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
              👨‍💼
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 border border-transparent hover:border-red-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
