
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText, Check, UserPlus } from "lucide-react";

const PartnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Partner Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Partner Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your organization profile, services offered, and business details
              </p>
              <Button 
                onClick={() => navigate("/partner/profile")}
                className="w-full"
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Case Studies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Showcase your successful projects to attract potential clients
              </p>
              <Button 
                onClick={() => navigate("/partner/add-case-study")}
                className="w-full"
              >
                Add Case Study
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check your profile verification status to ensure visibility to enterprises
              </p>
              <Button 
                onClick={() => navigate("/partner/profile")}
                variant="outline"
                className="w-full"
              >
                Check Status
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 bg-muted/30 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <UserPlus className="h-10 w-10 text-fandoro-green mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Connect with Enterprises</h2>
              <p className="text-muted-foreground">
                Complete your profile to be visible to enterprises looking for sustainability partners.
                Add detailed case studies and ensure all required fields are filled to increase your chances 
                of being selected by organizations seeking your expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PartnerDashboard;
