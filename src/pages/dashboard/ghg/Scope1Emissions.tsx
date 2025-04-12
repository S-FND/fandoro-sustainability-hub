
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Scope1EmissionsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scope 1 Emissions</h1>
          <p className="text-muted-foreground">
            Manage direct greenhouse gas emissions from sources owned or controlled by your organization
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scope 1 Emissions Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Scope 1 emissions tracking and reporting tools will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Scope1EmissionsPage;
