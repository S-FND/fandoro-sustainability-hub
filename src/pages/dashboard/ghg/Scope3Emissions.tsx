
import React, { useState } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { GHGEmissionsForm } from '@/components/ghg/GHGEmissionsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Scope3EmissionsPage = () => {
  const { user } = useAuth();
  const [industry, setIndustry] = useState<string>("Manufacturing");

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            GHG Accounting - Scope 3 Emissions
          </h1>
          <p className="text-muted-foreground">
            Record and manage all indirect emissions that occur in your company's value chain.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Scope 3 Emissions</CardTitle>
            <CardDescription>
              Scope 3 emissions include all indirect emissions that occur in a company's value chain, including:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Upstream activities: Purchased goods and services, capital goods, fuel and energy-related activities, transportation and distribution, waste, business travel, employee commuting, leased assets</li>
              <li>Downstream activities: Transportation and distribution, processing of sold products, use of sold products, end-of-life treatment, franchises, investments</li>
              <li>These typically represent the largest source of emissions for most organizations</li>
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
            <GHGEmissionsForm scopeType="scope3" industryCategory="Manufacturing" />
          </TabsContent>
          
          <TabsContent value="technology">
            <GHGEmissionsForm scopeType="scope3" industryCategory="Technology" />
          </TabsContent>
          
          <TabsContent value="other">
            <GHGEmissionsForm scopeType="scope3" industryCategory="Other" />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Scope3EmissionsPage;
