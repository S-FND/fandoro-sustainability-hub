
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Scope2EmissionsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scope 2 Emissions</h1>
          <p className="text-muted-foreground">
            Track indirect greenhouse gas emissions from purchased electricity, steam, heating, and cooling
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scope 2 Emissions Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Scope 2 emissions tracking and reporting tools will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Scope2EmissionsPage;
