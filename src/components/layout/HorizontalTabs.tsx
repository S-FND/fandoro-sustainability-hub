
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const HorizontalTabs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define tabs based on user role
  let tabs = [];
  
  if (user?.role === 'enterprise') {
    tabs = [
      { name: 'General Information', path: '/dashboard/general' },
      { name: 'Document and Records', path: '/dashboard/documents' },
      { name: 'Materiality', path: '/dashboard/materiality' },
      { name: 'ESG KPIs', path: '/dashboard/esg-kpis' },
      { name: 'SDGs', path: '/dashboard/sdgs' },
      { name: 'Reporting', path: '/dashboard/reporting' },
    ];
  } else if (user?.role === 'fandoro_admin') {
    tabs = [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Users', path: '/admin/users' },
      { name: 'Enterprises', path: '/admin/enterprises' },
      { name: 'Trainings', path: '/admin/trainings' },
      { name: 'Audits', path: '/admin/audits' },
    ];
  }

  return (
    <div className="fandoro-tabs overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => navigate(tab.path)}
          className={`fandoro-tab whitespace-nowrap ${
            location.pathname === tab.path ? 'fandoro-tab-active' : ''
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};
