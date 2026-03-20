import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar, Navbar } from "./components";
import {
  Dashboard,
  RiskAnalysis,
  Simulation,
  Claims,
  Community,
  Profile,
} from "./pages";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/risk-analysis" element={<RiskAnalysis />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/claims" element={<Claims />} />
                <Route path="/community" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

