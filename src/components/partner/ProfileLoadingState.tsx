
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ProfileLoadingState: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-64 bg-gray-200 rounded"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
};

export const EmptyProfileState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="py-8">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-medium">Complete Your Partner Profile</h2>
          <p className="text-muted-foreground">
            You need to complete your profile to access partner features
          </p>
          <Button onClick={() => navigate("/partner/onboarding")}>
            Create Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
