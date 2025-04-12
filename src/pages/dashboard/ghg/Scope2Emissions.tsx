
import React, { useState } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { GHGEmissionsForm } from '@/components/ghg/GHGEmissionsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Scope2EmissionsPage = () => {
  const { user } = useAuth();
  const [industry, setIndustry] = useState<string>("Manufacturing");

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            GHG Accounting - Scope 2 Emissions
          </h1>
          <p className="text-muted-foreground">
            Record and manage your indirect emissions from purchased electricity, heat, and cooling.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Scope 2 Emissions</CardTitle>
            <CardDescription>
              Scope 2 emissions are indirect emissions from the consumption of purchased electricity, heat, steam, or cooling, such as:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Purchased electricity for facilities, operations, and data centers</li>
              <li>Purchased steam or heat</li>
              <li>District cooling</li>
              <li>Both location-based and market-based accounting methods should be considered</li>
            </ul>
          </CardContent>
        </Card>

        <Tabs defaultValue="manufacturing">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="manufacturing" onClick={() => setIndustry("Manufacturing")}>Manufacturing</TabsTrigger>
            <TabsTrigger value="technology" onClick={() => setIndustry("Technology")}>Technology</TabsTrigger>
            <TabsTrigger value="other" onClick={() => setIndustry("Other")}>Other Industries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manufacturing">
            <GHGEmissionsForm scopeType="scope2" industryCategory="Manufacturing" />
          </TabsContent>
          
          <TabsContent value="technology">
            <GHGEmissionsForm scopeType="scope2" industryCategory="Technology" />
          </TabsContent>
          
          <TabsContent value="other">
            <GHGEmissionsForm scopeType="scope2" industryCategory="Other" />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Scope2EmissionsPage;
