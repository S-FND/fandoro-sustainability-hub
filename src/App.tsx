import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './App.css';

// Dashboard pages
import EnterpriseDashboard from './pages/dashboard/Enterprise';
import EHSAudits from './pages/dashboard/EHSAudits';
import Stakeholders from './pages/dashboard/Stakeholders';
import Materiality from './pages/dashboard/Materiality';

// Admin pages
import AuditorAssignment from './pages/admin/AuditorAssignment';
import EHSTemplates from './pages/admin/EHSTemplates';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Other pages
import NotFound from './pages/NotFound';

/**
 * Main application component with routing configuration
 */
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Private routes that require authentication */}
      {user ? (
        <>
          {/* Routes based on user role */}
          {user.role === 'fandoro_admin' && (
            <>
              <Route path="/admin/dashboard" element={<EnterpriseDashboard />} />
              <Route path="/admin/enterprises" element={<EnterpriseDashboard />} />
              <Route path="/admin/users" element={<EnterpriseDashboard />} />
              <Route path="/admin/auditor-assignment" element={<AuditorAssignment />} />
              <Route path="/admin/ehs-templates" element={<EHSTemplates />} />
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            </>
          )}
          
          {user.role === 'enterprise' && (
            <>
              <Route path="/dashboard/enterprise" element={<EnterpriseDashboard />} />
              <Route path="/dashboard/ehs-audits" element={<EHSAudits />} />
              <Route path="/dashboard/stakeholders" element={<Stakeholders />} />
              <Route path="/dashboard/materiality" element={<Materiality />} />
              <Route path="/" element={<Navigate to="/dashboard/enterprise" replace />} />
            </>
          )}
          
          {user.role === 'auditor' && (
            <>
              <Route path="/auditor/dashboard" element={<EnterpriseDashboard />} />
              <Route path="/auditor/enterprises" element={<EnterpriseDashboard />} />
              <Route path="/auditor/ehs-audits" element={<EHSAudits />} />
              <Route path="/" element={<Navigate to="/auditor/dashboard" replace />} />
            </>
          )}
          
          {/* Default redirect based on role if no route matched */}
          <Route
            path="*"
            element={
              user.role === 'fandoro_admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : user.role === 'enterprise' ? (
                <Navigate to="/dashboard/enterprise" replace />
              ) : user.role === 'auditor' ? (
                <Navigate to="/auditor/dashboard" replace />
              ) : (
                <NotFound />
              )
            }
          />
        </>
      ) : (
        // Redirect to login if not authenticated
        <>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
