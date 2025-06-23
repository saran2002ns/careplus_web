import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import ReceptionistLogin from "./pages/ReceptionistLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import ReceptionistManagement from "./pages/ReceptionistManagement";
import AppoinmentManagement from "./pages/appoinmentManagement";
import DoctorManagement from "./pages/DoctorManagement";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/receptionist-login" element={<ReceptionistLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorManagement />} />
        <Route path="/receptionist-management" element={<ReceptionistManagement />} />
        <Route path="/appointment-oversight" element={<AppoinmentManagement />} />
      </Routes>
    </BrowserRouter>
  );
}
