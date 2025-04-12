
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Link, Building, Briefcase } from "lucide-react";
import { PartnerProfile, PartnerType } from "@/types/partner";
import { getProfileStatusBadge } from "./ProfileStatusCard";

interface OrganizationProfileCardProps {
  profile: PartnerProfile;
}

export const getServiceLabel = (serviceId: string) => {
  const serviceMap: Record<string, string> = {
    esg_consultation: "ESG Consultation",
    carbon_accounting: "Carbon Accounting",
    sustainability_training: "Sustainability Training",
    ehs_auditing: "EHS Auditing",
    sdg_implementation: "SDG Implementation",
    reporting_assurance: "Reporting & Assurance",
    environmental_compliance: "Environmental Compliance",
    social_responsibility: "Social Responsibility",
    governance_advisory: "Governance Advisory",
  };
  
  return serviceMap[serviceId] || serviceId;
};

export const OrganizationProfileCard: React.FC<OrganizationProfileCardProps> = ({ profile }) => {
  const getPartnerTypeLabel = (type: PartnerType) => {
    switch (type) {
      case "solution_provider":
        return "Solution Provider";
      case "training_provider":
        return "Training Provider";
      case "auditor":
        return "Auditor";
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{profile.organization_name}</CardTitle>
            <CardDescription className="mt-1">
              {getPartnerTypeLabel(profile.partner_type)}
            </CardDescription>
          </div>
          {getProfileStatusBadge(profile.profile_status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profile.address && (
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm">{profile.address}</p>
            </div>
          )}
          
          {profile.website && (
            <div className="flex items-center">
              <Link className="h-5 w-5 mr-2 text-muted-foreground" />
              <a 
                href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {profile.website}
              </a>
            </div>
          )}
          
          {profile.gst_number && (
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-2 text-muted-foreground" />
              <p className="text-sm">GST Number: {profile.gst_number}</p>
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Services Offered
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {profile.services_offered && profile.services_offered.length > 0 ? (
              profile.services_offered.map((service) => (
                <Badge key={service} variant="secondary">
                  {getServiceLabel(service)}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No services specified</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
