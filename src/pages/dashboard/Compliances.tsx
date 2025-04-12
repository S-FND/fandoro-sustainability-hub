
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CompliancesPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance Management</h1>
          <p className="text-muted-foreground">
            Track and manage your ESG compliance requirements
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Compliance dashboard content will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CompliancesPage;
