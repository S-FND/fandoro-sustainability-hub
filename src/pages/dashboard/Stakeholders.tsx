
import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { StakeholdersList } from "@/components/dashboard/StakeholdersList";

const StakeholdersPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stakeholder Management</h1>
          <p className="text-muted-foreground">
            Manage your organization's stakeholders and their engagement in ESG processes
          </p>
        </div>
        
        <StakeholdersList />
      </div>
    </AppLayout>
  );
};

export default StakeholdersPage;
