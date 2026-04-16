import {
  LayoutDashboard,
  BarChart3,
  Zap,
  FileText,
  Users,
  User,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  const menuItems = useMemo(() => {
    if (user?.role === 'Admin') {
      return [
        { path: "/admin", icon: ShieldCheck, label: "Admin Panel" },
        { path: "/profile", icon: User, label: "Profile" },
      ];
    }

    return [
      { path: "/", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/risk-analysis", icon: BarChart3, label: "Risk Analysis" },
      { path: "/simulation", icon: Zap, label: "Simulation" },
      { path: "/claims", icon: FileText, label: "Claims" },
      { path: "/community", icon: Users, label: "Community" },
      { path: "/profile", icon: User, label: "Profile" },
    ];
  }, [user]);

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`bg-gray-900 text-white transition-all duration-300 h-screen sticky top-0 overflow-y-auto ${isOpen ? "w-64" : "w-20"}`}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {isOpen && <h2 className="text-lg font-bold">Menu</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          ☰
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm font-semibold mb-2">💡 Tip</p>
          <p className="text-xs text-gray-300">
            Active coverage protects you from weather disruptions.
          </p>
        </div>
      )}
    </aside>
  );
}
