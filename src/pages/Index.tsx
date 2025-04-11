
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Auto-redirect logged in users to appropriate dashboard
    if (user) {
      if (user.role === 'fandoro_admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'enterprise') {
        navigate('/dashboard/general');
      } else if (user.role === 'employee') {
        navigate('/employee/profile');
      } else if (user.role === 'supplier') {
        navigate('/supplier/profile');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-fandoro-green">
            Fandoro Sustainability Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive platform for managing Environmental, Social, and Governance (ESG) metrics and sustainability initiatives
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <Button
            className="text-lg px-8 py-6"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            className="text-lg px-8 py-6"
            variant="outline"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-14 w-14 bg-fandoro-green/10 text-fandoro-green rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m22 12-4-2-1-4.5M15.6 10a4 4 0 1 0-7.2 0"></path>
                <path d="M15 5.2A4 4 0 1 0 8 9m-1 8v-4a3 3 0 0 1 6 0v4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">ESG Due Diligence</h3>
            <p className="text-gray-600">
              Comprehensive assessment of Environmental, Social, and Governance factors for enterprises at any investment stage
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-14 w-14 bg-fandoro-blue/10 text-fandoro-blue rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">EHS Trainings</h3>
            <p className="text-gray-600">
              Manage and schedule Environmental Health and Safety trainings for your organization
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="h-14 w-14 bg-fandoro-earth/10 text-fandoro-earth rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 9V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"></path>
                <path d="M6 9h12"></path>
                <path d="M12 9v12"></path>
                <path d="M12 16h9"></path>
                <path d="M9 21V9"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Supplier Audits</h3>
            <p className="text-gray-600">
              Create, distribute, and analyze sustainability audit checklists for your supplier network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
