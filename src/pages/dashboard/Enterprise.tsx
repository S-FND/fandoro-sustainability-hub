
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ComplianceIssues } from '@/components/dashboard/ComplianceIssues';
import { ESGRisks } from '@/components/dashboard/ESGRisks';
import { SDGProgress } from '@/components/dashboard/SDGProgress';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Users, CalendarCheck, Clock } from 'lucide-react';

const EnterpriseDashboard = () => {
  // Mock KPIs
  const kpis = [
    { title: "Carbon Footprint", value: "1,245", unit: "tonnes CO2e", change: "-8.5%" },
    { title: "Energy Consumption", value: "3,458", unit: "MWh", change: "-3.2%" },
    { title: "Water Usage", value: "42,120", unit: "kL", change: "+1.5%" },
    { title: "Waste Generated", value: "125", unit: "tonnes", change: "-12.4%" },
  ];

  const upcomingEvents = [
    { id: 1, title: "ISO 14001 Annual Audit", date: "Apr 25, 2025", type: "Audit" },
    { id: 2, title: "ESG Report Submission", date: "May 15, 2025", type: "Report" },
    { id: 3, title: "Board ESG Review", date: "Jun 02, 2025", type: "Meeting" },
  ];
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enterprise Dashboard</h1>
          <p className="text-muted-foreground">
            Your ESG performance overview and key sustainability metrics
          </p>
        </div>
        
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value} <span className="text-xs font-normal">{kpi.unit}</span></div>
                <p className={`text-xs ${kpi.change.startsWith("-") ? "text-green-600" : "text-red-600"}`}>
                  {kpi.change} from last year
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ESG Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">ESG Performance chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-start gap-3 p-2 border-b last:border-b-0">
                      <div className="rounded-md bg-primary/10 p-2 mt-0.5">
                        <CalendarCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{event.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <ESGRisks />
          <ComplianceIssues />
        </div>
        
        <SDGProgress />
      </div>
    </AppLayout>
  );
};

export default EnterpriseDashboard;
