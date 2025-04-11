
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { BarChart, LineChart, PieChart, MapPin, Users, Calendar, Building } from "lucide-react";
import { ResponsiveContainer, LineChart as ReLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, BarChart as ReBarChart, Bar } from "recharts";

// Mock data
const energyData = [
  { month: "Jan", usage: 65 },
  { month: "Feb", usage: 59 },
  { month: "Mar", usage: 80 },
  { month: "Apr", usage: 81 },
  { month: "May", usage: 56 },
  { month: "Jun", usage: 55 },
  { month: "Jul", usage: 40 },
];

const waterData = [
  { month: "Jan", usage: 28 },
  { month: "Feb", usage: 48 },
  { month: "Mar", usage: 40 },
  { month: "Apr", usage: 19 },
  { month: "May", usage: 86 },
  { month: "Jun", usage: 27 },
  { month: "Jul", usage: 90 },
];

const diversityData = [
  { name: "Male", value: 65 },
  { name: "Female", value: 35 },
];

const GeneralDashboard = () => {
  const { user } = useAuth();
  const [investmentRound, setInvestmentRound] = useState<string>("seed");

  useEffect(() => {
    // Fetch the user's data - for demo we're simulating
    // In a real app, this would be an API call
    if (user) {
      // Just for simulation
      const rounds = ["seed", "pre_series_a", "series_a", "series_b_plus"];
      setInvestmentRound(rounds[Math.floor(Math.random() * rounds.length)]);
    }
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your sustainability metrics and upcoming activities.
          </p>
        </div>

        {/* Enterprise Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="h-6 w-6 text-fandoro-green mr-2" />
                <span className="text-2xl font-bold">3</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Across 2 locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-6 w-6 text-fandoro-green mr-2" />
                <span className="text-2xl font-bold">124</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                From 5 departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-fandoro-green mr-2" />
                <span className="text-2xl font-bold">2</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Mumbai, Bangalore
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Trainings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-fandoro-green mr-2" />
                <span className="text-2xl font-bold">5</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Next on Aug 15, 2023
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visualization Dashboard - Different based on investment round */}
        {["series_a", "series_b_plus"].includes(investmentRound) ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>ESG Risk Assessment</CardTitle>
                <CardDescription>
                  Breakdown of key risk areas
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#4CAF50" />
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>SDG Progress</CardTitle>
                <CardDescription>
                  Sustainability goals tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={waterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#2196F3"
                      strokeWidth={2}
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Energy Management</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>
                  Monthly energy consumption (kWh)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#2196F3"
                      strokeWidth={2}
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Water Management</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>
                  Monthly water usage (kL)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={waterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#4CAF50" />
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Diversity & Inclusion</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>
                  Employee gender distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="h-72 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-8 w-full">
                  {diversityData.map((entry, index) => (
                    <div key={`diversity-${index}`} className="flex flex-col items-center">
                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center ${
                          index === 0 ? "bg-blue-100" : "bg-pink-100"
                        }`}
                      >
                        <span className="text-2xl font-bold">
                          {entry.value}%
                        </span>
                      </div>
                      <span className="mt-2 text-sm font-medium">
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default GeneralDashboard;
