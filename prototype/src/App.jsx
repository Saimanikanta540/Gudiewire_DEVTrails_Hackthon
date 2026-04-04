import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar, Navbar } from "./components";
import {
  Dashboard,
  RiskAnalysis,
  Simulation,
  Claims,
  Community,
  Profile,
  Welcome,
} from "./pages";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
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
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
