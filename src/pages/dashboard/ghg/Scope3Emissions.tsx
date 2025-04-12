
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Scope3EmissionsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scope 3 Emissions</h1>
          <p className="text-muted-foreground">
            Monitor and report on all other indirect emissions in your value chain
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scope 3 Emissions Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Scope 3 emissions tracking and reporting tools will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Scope3EmissionsPage;
