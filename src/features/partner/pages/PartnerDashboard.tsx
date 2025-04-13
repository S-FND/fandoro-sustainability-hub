
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const PartnerDashboard = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partner Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your partner account and services
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is the partner dashboard. Partner-specific functionality will be added here.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PartnerDashboard;
