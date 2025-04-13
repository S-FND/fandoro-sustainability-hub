
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import EnterpriseDashboard from "@/pages/dashboard/EnterpriseDashboard";
import GeneralDashboard from "@/pages/dashboard/GeneralDashboard";
import CompliancesPage from "@/pages/dashboard/Compliances";
import Scope1EmissionsPage from "@/pages/dashboard/ghg/Scope1Emissions";
import Scope2EmissionsPage from "@/pages/dashboard/ghg/Scope2Emissions";
import Scope3EmissionsPage from "@/pages/dashboard/ghg/Scope3Emissions";
import EHSAudits from "@/pages/dashboard/EHSAudits";
import EHSTrainings from "@/pages/dashboard/EHSTrainings";
import EnterpriseSetup from "@/pages/dashboard/EnterpriseSetup";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import EHSTemplates from "@/pages/admin/EHSTemplates";
import EHSChecklist from "@/pages/admin/EHSChecklist";
import AuditorAssignment from "@/pages/admin/AuditorAssignment";
import AuditorDashboard from "@/pages/auditor/AuditorDashboard";
import Stakeholders from "@/pages/dashboard/Stakeholders";
import Materiality from "@/pages/dashboard/Materiality";
import EmployeeProfile from "@/features/employee/pages/Profile";

function App() {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-react-theme"
    >
      <AuthProvider>
        <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Enterprise User Routes */}
              <Route path="/dashboard/enterprise" element={<EnterpriseDashboard />} />
              <Route path="/dashboard/general" element={<GeneralDashboard />} />
              <Route path="/dashboard/stakeholders" element={<Stakeholders />} />
              <Route path="/dashboard/materiality" element={<Materiality />} />
              <Route path="/dashboard/compliances" element={<CompliancesPage />} />
              <Route path="/dashboard/ghg/scope1" element={<Scope1EmissionsPage />} />
              <Route path="/dashboard/ghg/scope2" element={<Scope2EmissionsPage />} />
              <Route path="/dashboard/ghg/scope3" element={<Scope3EmissionsPage />} />
              <Route path="/dashboard/ehs-audits" element={<EHSAudits />} />
              <Route path="/dashboard/ehs-trainings" element={<EHSTrainings />} />
              <Route path="/dashboard/setup" element={<EnterpriseSetup />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/ehs-templates" element={<EHSTemplates />} />
              <Route path="/admin/ehs-checklist" element={<EHSChecklist />} />
              <Route path="/admin/auditor-assignment" element={<AuditorAssignment />} />
              
              {/* Auditor Routes */}
              <Route path="/auditor/dashboard" element={<AuditorDashboard />} />
              
              {/* Employee Routes */}
              <Route path="/employee/profile" element={<EmployeeProfile />} />
              
              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
