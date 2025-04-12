import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PartnerType } from "@/types/partner";

const SERVICES = [
  { id: "esg_consultation", label: "ESG Consultation" },
  { id: "carbon_accounting", label: "Carbon Accounting" },
  { id: "sustainability_training", label: "Sustainability Training" },
  { id: "ehs_auditing", label: "EHS Auditing" },
  { id: "sdg_implementation", label: "SDG Implementation" },
  { id: "reporting_assurance", label: "Reporting & Assurance" },
  { id: "environmental_compliance", label: "Environmental Compliance" },
  { id: "social_responsibility", label: "Social Responsibility" },
  { id: "governance_advisory", label: "Governance Advisory" },
];

const PartnerOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [organizationName, setOrganizationName] = useState(user?.organization || "");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((current) => {
      if (current.includes(serviceId)) {
        return current.filter((id) => id !== serviceId);
      } else {
        return [...current, serviceId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create partner profile in Supabase
      const { error } = await supabase.from("partner_profiles").insert({
        id: user?.id,
        organization_name: organizationName,
        gst_number: gstNumber || null,
        address: address || null,
        website: website || null,
        services_offered: selectedServices,
        partner_type: user?.partnerType as PartnerType || "solution_provider",
      });

      if (error) throw error;

      toast({
        title: "Profile created",
        description: "Your partner profile has been submitted for review",
      });

      navigate('/partner/profile');
    } catch (error) {
      console.error("Error creating partner profile:", error);
      toast({
        title: "Error creating profile",
        description: "There was an issue submitting your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Complete Your Partner Profile</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Partner Profile</CardTitle>
              <CardDescription>
                Provide details about your organization to create your partner profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name*</Label>
                  <Input
                    id="organizationName"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    disabled={isLoading}
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isLoading}
                    placeholder="Optional"
                    className="h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    disabled={isLoading}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Services Offered</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {SERVICES.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                          disabled={isLoading}
                        />
                        <Label htmlFor={service.id} className="cursor-pointer">
                          {service.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isLoading || !organizationName}>
                    {isLoading ? "Submitting..." : "Submit Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default PartnerOnboarding;
