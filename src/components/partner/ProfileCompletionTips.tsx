
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CaseStudy } from "@/types/partner";

interface ProfileCompletionTipsProps {
  gstNumber?: string;
  website?: string;
  address?: string;
  servicesOffered?: string[];
  caseStudies: CaseStudy[];
}

export const ProfileCompletionTips: React.FC<ProfileCompletionTipsProps> = ({
  gstNumber,
  website,
  address,
  servicesOffered,
  caseStudies
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile Completion Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li className={`${gstNumber ? "text-green-600" : "text-muted-foreground"}`}>
            Add your GST number for verification
          </li>
          <li className={`${website ? "text-green-600" : "text-muted-foreground"}`}>
            Include your website for credibility
          </li>
          <li className={`${address ? "text-green-600" : "text-muted-foreground"}`}>
            Add your business address
          </li>
          <li className={`${servicesOffered && servicesOffered.length > 0 ? "text-green-600" : "text-muted-foreground"}`}>
            Select your services offered
          </li>
          <li className={`${caseStudies.length > 0 ? "text-green-600" : "text-muted-foreground"}`}>
            Add at least one case study
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
