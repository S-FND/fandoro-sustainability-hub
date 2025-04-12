
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileStatus } from "@/types/partner";

interface ProfileStatusCardProps {
  profileStatus: ProfileStatus;
}

export const getProfileStatusBadge = (status: ProfileStatus) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending Review</Badge>;
  }
};

export const ProfileStatusCard: React.FC<ProfileStatusCardProps> = ({ profileStatus }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Current Status:</p>
            <div className="mt-1">
              {getProfileStatusBadge(profileStatus)}
            </div>
          </div>
          
          {profileStatus === "pending" && (
            <p className="text-sm text-muted-foreground">
              Your profile is under review. Once approved, you will be visible to enterprises seeking sustainability partners.
            </p>
          )}
          
          {profileStatus === "rejected" && (
            <p className="text-sm text-red-500">
              Your profile has been rejected. Please contact support for more information.
            </p>
          )}
          
          {profileStatus === "approved" && (
            <p className="text-sm text-green-600">
              Your profile is approved and visible to enterprises.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
