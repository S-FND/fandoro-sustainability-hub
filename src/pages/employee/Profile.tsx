
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, UserCircle, Landmark, Calendar, School, LineChart, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { EmployeeKpiList } from "@/components/employee/EmployeeKpiList";
import { EmployeeTrainingList } from "@/components/employee/EmployeeTrainingList";
import { EmployeeUser } from "@/types/user";

const EmployeeProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // Check if the user is an employee
  useEffect(() => {
    if (user && user.role !== 'employee') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Cast the user to EmployeeUser type
  const employeeUser = user as EmployeeUser;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile, ESG KPIs, and training modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Profile sidebar */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  Employee
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Landmark className="h-4 w-4" />
                  <span>Department: {employeeUser.department || "Not specified"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <UserCircle className="h-4 w-4" />
                  <span>Designation: {employeeUser.designation || "Not specified"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Joined: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => window.open("https://lms.fandoro.com", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                LMS Portal
              </Button>
            </CardContent>
          </Card>

          {/* Main content */}
          <div className="md:col-span-3 space-y-6">
            <Tabs 
              defaultValue="profile" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="kpis">ESG KPIs</TabsTrigger>
                <TabsTrigger value="trainings">Trainings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your profile information and corporate details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Full Name</h3>
                        <p className="text-sm mt-1">{user.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Email Address</h3>
                        <p className="text-sm mt-1">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Department</h3>
                        <p className="text-sm mt-1">{employeeUser.department || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Designation</h3>
                        <p className="text-sm mt-1">{employeeUser.designation || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Employee ID</h3>
                        <p className="text-sm mt-1">{user.id.substring(0, 8)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Gender</h3>
                        <p className="text-sm mt-1">{employeeUser.gender || "Not specified"}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h3 className="text-sm font-medium mb-2">Enterprise Details</h3>
                      <div>
                        <h4 className="text-xs text-muted-foreground">Organization ID</h4>
                        <p className="text-sm">{employeeUser.enterpriseId}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kpis">
                <EmployeeKpiList />
              </TabsContent>

              <TabsContent value="trainings">
                <EmployeeTrainingList />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EmployeeProfile;
