
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import { HorizontalTabs } from "./HorizontalTabs";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative w-64 h-full transition-transform duration-200 ease-in-out z-40 md:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b shadow-sm z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-fandoro-green">
                Fandoro Sustainability Hub
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {user && (
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2 hidden sm:inline-block">
                    {user.name} ({user.role})
                  </span>
                  <Button variant="outline" size="icon" onClick={handleLogout}>
                    <LogOut size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Horizontal Tabs - Only for Enterprise and specific roles */}
          {user && ['enterprise', 'fandoro_admin'].includes(user.role) && (
            <HorizontalTabs />
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto px-4 py-6">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
