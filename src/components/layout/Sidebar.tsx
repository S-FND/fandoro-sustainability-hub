
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  FileText,
  Settings,
  Users,
  Building,
  FileCheck,
  TrendingUp,
  Sprout,
  ClipboardList,
  GraduationCap,
  ClipboardCheck,
  CheckSquare,
  User,
  Boxes,
  CloudRain,
  Leaf,
  Zap,
  Warehouse,
  LineChart,
} from "lucide-react";

export const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Define menu items based on user role
  let menuItems = [];

  if (user?.role === 'fandoro_admin') {
    menuItems = [
      {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: <BarChart3 size={18} />,
      },
      {
        name: 'Users Management',
        path: '/admin/users',
        icon: <Users size={18} />,
      },
      {
        name: 'Enterprises',
        path: '/admin/enterprises',
        icon: <Building size={18} />,
      },
      {
        name: 'EHS Trainings',
        path: '/admin/trainings',
        icon: <GraduationCap size={18} />,
      },
      {
        name: 'Supplier Sustainability',
        path: '/admin/supplier-sustainability',
        icon: <Boxes size={18} />,
      },
      {
        name: 'Platform Settings',
        path: '/admin/settings',
        icon: <Settings size={18} />,
      },
    ];
  } else if (user?.role === 'enterprise') {
    menuItems = [
      {
        name: 'Enterprise Dashboard',
        path: '/dashboard/enterprise',
        icon: <BarChart3 size={18} />,
      },
      {
        name: 'General Information',
        path: '/dashboard/general',
        icon: <FileText size={18} />,
      },
      {
        name: 'Document and Records',
        path: '/dashboard/documents',
        icon: <FileCheck size={18} />,
      },
      {
        name: 'Materiality',
        path: '/dashboard/materiality',
        icon: <TrendingUp size={18} />,
      },
      {
        name: 'ESG KPIs',
        path: '/dashboard/esg-kpis',
        icon: <LineChart size={18} />,
      },
      {
        name: 'SDGs',
        path: '/dashboard/sdgs',
        icon: <Sprout size={18} />,
      },
      {
        name: 'GHG Accounting',
        path: '/dashboard/ghg',
        icon: <CloudRain size={18} />,
        children: [
          {
            name: 'Scope 1 Emissions',
            path: '/dashboard/ghg/scope1',
            icon: <Warehouse size={18} />,
          },
          {
            name: 'Scope 2 Emissions',
            path: '/dashboard/ghg/scope2',
            icon: <Zap size={18} />,
          },
          {
            name: 'Scope 3 Emissions',
            path: '/dashboard/ghg/scope3',
            icon: <Leaf size={18} />,
          }
        ]
      },
      {
        name: 'Reporting',
        path: '/dashboard/reporting',
        icon: <ClipboardList size={18} />,
      },
      {
        name: 'Enterprise Setup',
        path: '/dashboard/setup',
        icon: <Settings size={18} />,
      },
      {
        name: 'Compliances',
        path: '/dashboard/compliances',
        icon: <CheckSquare size={18} />,
      },
      {
        name: 'ESGCAP',
        path: '/dashboard/esgcap',
        icon: <TrendingUp size={18} />,
      },
      {
        name: 'EHS Trainings',
        path: '/dashboard/ehs-trainings',
        icon: <GraduationCap size={18} />,
      },
      {
        name: 'EHS Audits',
        path: '/dashboard/ehs-audits',
        icon: <ClipboardCheck size={18} />,
      },
      {
        name: 'Supplier Sustainability',
        path: '/dashboard/supplier-audits',
        icon: <Boxes size={18} />,
      },
      {
        name: 'LMS',
        path: '/dashboard/lms',
        icon: <GraduationCap size={18} />,
      },
    ];
  } else if (user?.role === 'employee') {
    menuItems = [
      {
        name: 'Employee Profile',
        path: '/employee/profile',
        icon: <User size={18} />,
      },
      {
        name: 'LMS',
        path: '/employee/lms',
        icon: <GraduationCap size={18} />,
      },
      {
        name: 'EHS Trainings',
        path: '/employee/ehs-trainings',
        icon: <GraduationCap size={18} />,
      },
      {
        name: 'Personal GHG Accounting',
        path: '/employee/ghg-accounting',
        icon: <BarChart3 size={18} />,
      },
    ];
  } else if (user?.role === 'supplier') {
    menuItems = [
      {
        name: 'Company Profile',
        path: '/supplier/profile',
        icon: <Building size={18} />,
      },
      {
        name: 'Audits',
        path: '/supplier/audits',
        icon: <ClipboardCheck size={18} />,
      },
      {
        name: 'Documents',
        path: '/supplier/documents',
        icon: <FileText size={18} />,
      },
    ];
  }

  const isChildPathActive = (parentItem: any) => {
    if (!parentItem.children) return false;
    return parentItem.children.some((child: any) => location.pathname === child.path);
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-center">
          <h2 className="text-lg font-bold text-fandoro-green">Fandoro</h2>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path} className="space-y-1">
              <button
                onClick={() => !item.children && navigate(item.path)}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors ${
                  location.pathname === item.path || isChildPathActive(item)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-sidebar-accent'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </div>
                {item.children && (
                  <span className="text-xs">
                    {isChildPathActive(item) ? "▼" : "▶"}
                  </span>
                )}
              </button>
              
              {/* Render child menu items if present */}
              {item.children && (
                <div className={`ml-6 space-y-1 ${isChildPathActive(item) ? 'block' : 'hidden'}`}>
                  {item.children.map((child: any) => (
                    <button
                      key={child.path}
                      onClick={() => navigate(child.path)}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                        location.pathname === child.path
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-sidebar-accent'
                      }`}
                    >
                      {child.icon}
                      <span className="text-sm">{child.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="text-xs text-center text-muted-foreground">
          Fandoro Sustainability Hub
        </div>
      </div>
    </div>
  );
};
