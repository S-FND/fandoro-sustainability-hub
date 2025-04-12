
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EnterpriseOnboarding from "./pages/onboarding/EnterpriseOnboarding";

// Enterprise Dashboard Pages
import EnterpriseDashboard from "./pages/dashboard/EnterpriseDashboard";
import GeneralDashboard from "./pages/dashboard/GeneralDashboard";
import EnterpriseSetup from "./pages/dashboard/EnterpriseSetup";
import EHSTrainings from "./pages/dashboard/EHSTrainings";

// GHG Accounting Pages
import Scope1EmissionsPage from "./pages/dashboard/ghg/Scope1Emissions";
import Scope2EmissionsPage from "./pages/dashboard/ghg/Scope2Emissions";
import Scope3EmissionsPage from "./pages/dashboard/ghg/Scope3Emissions";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Default & Error Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === 'fandoro_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === 'enterprise') {
      return <Navigate to="/dashboard/enterprise" replace />;
    }
    if (user.role === 'employee') {
      return <Navigate to="/employee/profile" replace />;
    }
    // Default fallback
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Onboarding */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute allowedRoles={['enterprise']}>
                  <EnterpriseOnboarding />
                </ProtectedRoute>
              } 
            />
            
            {/* Enterprise Dashboard Routes */}
            <Route 
              path="/dashboard/enterprise" 
              element={
                <ProtectedRoute allowedRoles={['enterprise']}>
                  <EnterpriseDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/general" 
              element={
                <ProtectedRoute allowedRoles={['enterprise']}>
                  <GeneralDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/setup" 
              element={
                <ProtectedRoute allowedRoles={['enterprise']}>
                  <EnterpriseSetup />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/ehs-trainings" 
              element={
                <ProtectedRoute allowedRoles={['enterprise']}>
                  <EHSTrainings />
                </ProtectedRoute>
              } 
            />
            
            {/* GHG Accounting Routes */}
            <Route 
              path="/dashboard/ghg/scope1" 
              element={
                <ProtectedRoute allowedRoles={['enterprise']}>
                  <Scope1EmissionsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/ghg/scope2" 
              element={
                <ProtectedRoute allowedRoles={['enterprise']}>
                  <Scope2EmissionsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard/ghg/scope3" 
              element={
                <ProtectedRoute allowedRoles={['enterprise']}>
                  <Scope3EmissionsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['fandoro_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catchall route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
