
import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { MaterialityAssessment } from "@/components/dashboard/MaterialityAssessment";

const MaterialityPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Materiality Assessment</h1>
          <p className="text-muted-foreground">
            Identify and prioritize ESG topics that matter most to your business and stakeholders
          </p>
        </div>
        
        <MaterialityAssessment />
      </div>
    </AppLayout>
  );
};

export default MaterialityPage;
