
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckSquare, ListChecks } from "lucide-react";

const AuditorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not an auditor
  if (!user || user.role !== 'auditor') {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="mt-2">You don't have permission to access this page.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EHS Auditor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage environmental, health, and safety audits for assigned enterprises
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer" onClick={() => navigate('/auditor/assigned-enterprises')}>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Assigned Enterprises
              </CardTitle>
              <CardDescription>
                View and manage enterprises assigned to you for EHS audits
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer" onClick={() => navigate('/auditor/pending-audits')}>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-amber-500" />
                Pending Audits
              </CardTitle>
              <CardDescription>
                Conduct and manage EHS audits that need your attention
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer" onClick={() => navigate('/auditor/completed-audits')}>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-green-500" />
                Completed Audits
              </CardTitle>
              <CardDescription>
                Review completed EHS audits and submitted actions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AuditorDashboard;
