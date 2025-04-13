
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { ComplianceIssues } from "@/components/dashboard/ComplianceIssues";
import { ESGRisks } from "@/components/dashboard/ESGRisks";
import { SDGProgress } from "@/components/dashboard/SDGProgress";
import { SDGManagement } from "@/components/dashboard/SDGManagement";
import { ApprovalsInbox } from "@/components/dashboard/ApprovalsInbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Building, CloudRain, Scale, AlertCircle, BarChartHorizontal, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EnterpriseDashboard = () => {
  const { user } = useAuth();
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Enterprise Sustainability Dashboard
          </h1>
          <p className="text-muted-foreground">
            Your comprehensive view of ESG performance, compliance status, and sustainability goals.
          </p>
        </div>
        
        {/* ESG Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Environmental</CardTitle>
              <CloudRain className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72/100</div>
              <p className="text-xs text-muted-foreground">
                +4 points from last quarter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Social</CardTitle>
              <AlertCircle className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68/100</div>
              <p className="text-xs text-muted-foreground">
                +2 points from last quarter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Governance</CardTitle>
              <Scale className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85/100</div>
              <p className="text-xs text-muted-foreground">
                +1 point from last quarter
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Action Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/dashboard/stakeholders">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-primary" />
                  Manage Stakeholders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Add, edit, and organize your organization's stakeholders
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/dashboard/materiality">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChartHorizontal className="h-5 w-5 mr-2 text-primary" />
                  Materiality Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Identify and prioritize ESG topics that matter most
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/compliances">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Scale className="h-5 w-5 mr-2 text-primary" />
                  View Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Monitor and manage ESG compliance requirements
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* Company Overview and Data Management */}
        <Card className="h-auto">
          <CardHeader>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="data-approval">Data Approvals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                      <Building className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user?.organization || "Your Enterprise"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.role === "enterprise" ? "Enterprise Account" : "Organization"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Industry</p>
                      <p className="text-sm">Manufacturing</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Size</p>
                      <p className="text-sm">250-500 employees</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">ESG Rating</p>
                      <p className="text-sm">B+ (Improving)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">SDGs Tracked</p>
                      <p className="text-sm">5 goals</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="data-approval">
                <ApprovalsInbox />
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col space-y-6">
            <ComplianceIssues />
            <ESGRisks />
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col space-y-6">
            <AIAssistant />
            
            <Card>
              <CardHeader>
                <Tabs defaultValue="sdg-progress">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="sdg-progress">SDG Progress</TabsTrigger>
                      <TabsTrigger value="sdg-management">SDG Management</TabsTrigger>
                    </TabsList>
                  </div>
                
                  <TabsContent value="sdg-progress" className="mt-0">
                    <div className="p-6">
                      <SDGProgress />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sdg-management" className="mt-0">
                    <div className="p-6">
                      <SDGManagement />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EnterpriseDashboard;
