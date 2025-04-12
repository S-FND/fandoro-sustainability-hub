
import React, { useEffect, useState } from "react";
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
import { PartnerProfile } from "@/types/partner";

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

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [organizationName, setOrganizationName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("partner_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setOrganizationName(data.organization_name || "");
          setGstNumber(data.gst_number || "");
          setAddress(data.address || "");
          setWebsite(data.website || "");
          setSelectedServices(data.services_offered || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error loading profile",
          description: "Unable to load your profile data",
          variant: "destructive",
        });
        navigate('/partner/profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user?.id, navigate, toast]);

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
    setIsSaving(true);

    try {
      // Update partner profile in Supabase
      const { error } = await supabase
        .from("partner_profiles")
        .update({
          organization_name: organizationName,
          gst_number: gstNumber || null,
          address: address || null,
          website: website || null,
          services_offered: selectedServices,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your partner profile has been updated successfully",
      });

      navigate('/partner/profile');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "There was an issue updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Edit Partner Profile</h1>
            <Button variant="outline" onClick={() => navigate("/partner/profile")}>
              Cancel
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your organization details and services offered
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
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    disabled={isSaving}
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isSaving}
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
                    disabled={isSaving}
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
                          disabled={isSaving}
                        />
                        <Label htmlFor={service.id} className="cursor-pointer">
                          {service.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isSaving || !organizationName}>
                    {isSaving ? "Saving Changes..." : "Save Changes"}
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

export default EditProfile;
