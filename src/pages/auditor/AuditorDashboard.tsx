
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuditorDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auditor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track audits, assignments, and compliance verification
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your assigned audit tasks will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AuditorDashboard;
