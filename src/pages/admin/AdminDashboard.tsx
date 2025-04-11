
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, LineChart, BarChart, Users, Building, GraduationCap, CalendarCheck, ActivitySquare } from "lucide-react";
import { ResponsiveContainer, LineChart as ReLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, BarChart as ReBarChart, Bar, PieChart as RePieChart, Pie, Cell } from "recharts";

// Sample data for charts
const userGrowthData = [
  { month: "Jan", users: 25 },
  { month: "Feb", users: 40 },
  { month: "Mar", users: 80 },
  { month: "Apr", users: 120 },
  { month: "May", users: 170 },
  { month: "Jun", users: 250 },
  { month: "Jul", users: 310 },
];

const trainingCompletionData = [
  { name: "Completed", value: 68 },
  { name: "In Progress", value: 22 },
  { name: "Not Started", value: 10 },
];

const enterprisesByIndustryData = [
  { name: "Technology", count: 45 },
  { name: "Manufacturing", count: 30 },
  { name: "Healthcare", count: 25 },
  { name: "Finance", count: 20 },
  { name: "Retail", count: 15 },
  { name: "Others", count: 25 },
];

const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#9C27B0", "#FF5722", "#795548"];

const AdminDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Fandoro Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of platform usage and sustainability metrics
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Enterprises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="h-6 w-6 text-fandoro-green mr-2" />
                <span className="text-2xl font-bold">160</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                12 new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-6 w-6 text-fandoro-green mr-2" />
                <span className="text-2xl font-bold">3,248</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                145 active today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Trainings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <GraduationCap className="h-6 w-6 text-fandoro-green mr-2" />
                <span className="text-2xl font-bold">426</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                32 scheduled this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarCheck className="h-6 w-6 text-fandoro-green mr-2" />
                <span className="text-2xl font-bold">89</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                14 in progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Platform Growth</CardTitle>
                <ActivitySquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>
                Monthly growth in registered enterprises
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#2E7D32"
                    strokeWidth={2}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Enterprises by Industry</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>
                Distribution of registered enterprises by sector
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={enterprisesByIndustryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976D2">
                    {enterprisesByIndustryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Training Completion</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>
                Overall EHS training completion status
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={trainingCompletionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {trainingCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Trainings</CardTitle>
              <CardDescription>
                Next scheduled EHS trainings across all enterprises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    client: "TechSolutions Inc",
                    training: "Fire Safety & Evacuation",
                    date: "2023-08-18",
                    attendees: 24,
                  },
                  {
                    client: "GreenEnergy Ltd",
                    training: "Hazardous Material Handling",
                    date: "2023-08-22",
                    attendees: 12,
                  },
                  {
                    client: "MediHealth Systems",
                    training: "First Aid Training",
                    date: "2023-08-25",
                    attendees: 18,
                  },
                  {
                    client: "BuildWell Construction",
                    training: "Heights Safety",
                    date: "2023-08-28",
                    attendees: 32,
                  },
                ].map((training, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{training.client}</h3>
                      <p className="text-sm text-muted-foreground">
                        {training.training}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{training.date}</div>
                      <div className="text-xs text-muted-foreground">
                        {training.attendees} attendees
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
