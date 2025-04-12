
import React, { useState } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { GHGEmissionsForm } from '@/components/ghg/GHGEmissionsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Scope1EmissionsPage = () => {
  const { user } = useAuth();
  const [industry, setIndustry] = useState<string>("Manufacturing");

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            GHG Accounting - Scope 1 Emissions
          </h1>
          <p className="text-muted-foreground">
            Record and manage your direct greenhouse gas emissions from owned or controlled sources.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Scope 1 Emissions</CardTitle>
            <CardDescription>
              Scope 1 emissions are direct emissions from owned or controlled sources, such as:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Stationary combustion: Boilers, furnaces, and other on-site fuel combustion</li>
              <li>Mobile combustion: Company-owned or leased vehicles</li>
              <li>Process emissions: Emissions released during manufacturing processes</li>
              <li>Fugitive emissions: Unintentional leaks from equipment (e.g., refrigeration, air conditioning)</li>
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
            <GHGEmissionsForm scopeType="scope1" industryCategory="Manufacturing" />
          </TabsContent>
          
          <TabsContent value="technology">
            <GHGEmissionsForm scopeType="scope1" industryCategory="Technology" />
          </TabsContent>
          
          <TabsContent value="other">
            <GHGEmissionsForm scopeType="scope1" industryCategory="Other" />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Scope1EmissionsPage;
