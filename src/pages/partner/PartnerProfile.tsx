
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PartnerProfile as ProfileType, CaseStudy, PartnerType, ProfileStatus } from "@/types/partner";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Briefcase, Building, MapPin, Link, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        // Fetch partner profile
        const { data: profileData, error: profileError } = await supabase
          .from("partner_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }
        
        if (profileData) {
          // Cast the profile data to ensure type safety
          const typedProfileData: ProfileType = {
            ...profileData,
            partner_type: profileData.partner_type as PartnerType,
            profile_status: profileData.profile_status as ProfileStatus
          };
          
          setProfile(typedProfileData);
          
          // Fetch case studies
          const { data: caseStudiesData, error: caseStudiesError } = await supabase
            .from("partner_case_studies")
            .select("*")
            .eq("partner_id", user.id);
            
          if (caseStudiesError) throw caseStudiesError;
          
          setCaseStudies(caseStudiesData || []);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error fetching profile",
          description: "There was an issue loading your profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user?.id, toast]);
  
  const getServiceLabel = (serviceId: string) => {
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
  
  const getProfileStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending Review</Badge>;
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

  if (!profile) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
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
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Partner Profile</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/partner/edit-profile")}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Organization Profile Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{profile.organization_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {profile.partner_type === "solution_provider" && "Solution Provider"}
                      {profile.partner_type === "training_provider" && "Training Provider"}
                      {profile.partner_type === "auditor" && "Auditor"}
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

            {/* Case Studies Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    <CardTitle>Case Studies</CardTitle>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate("/partner/add-case-study")}
                  >
                    <Plus className="h-4 w-4 mr-2" /> 
                    Add Case Study
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {caseStudies.length > 0 ? (
                  <div className="space-y-4">
                    {caseStudies.map((study) => (
                      <Card key={study.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{study.client_name}</h3>
                            {study.year && <span className="text-sm text-muted-foreground">{study.year}</span>}
                          </div>
                          <p className="text-sm mt-2">{study.description}</p>
                          {study.outcome && (
                            <>
                              <Separator className="my-2" />
                              <div>
                                <p className="text-sm font-medium">Outcome:</p>
                                <p className="text-sm">{study.outcome}</p>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No case studies added yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigate("/partner/add-case-study")}
                    >
                      <Plus className="h-4 w-4 mr-2" /> 
                      Add Your First Case Study
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Profile Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Current Status:</p>
                    <div className="mt-1">
                      {getProfileStatusBadge(profile.profile_status)}
                    </div>
                  </div>
                  
                  {profile.profile_status === "pending" && (
                    <p className="text-sm text-muted-foreground">
                      Your profile is under review. Once approved, you will be visible to enterprises seeking sustainability partners.
                    </p>
                  )}
                  
                  {profile.profile_status === "rejected" && (
                    <p className="text-sm text-red-500">
                      Your profile has been rejected. Please contact support for more information.
                    </p>
                  )}
                  
                  {profile.profile_status === "approved" && (
                    <p className="text-sm text-green-600">
                      Your profile is approved and visible to enterprises.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Profile Completion Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Completion Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li className={`${profile.gst_number ? "text-green-600" : "text-muted-foreground"}`}>
                    Add your GST number for verification
                  </li>
                  <li className={`${profile.website ? "text-green-600" : "text-muted-foreground"}`}>
                    Include your website for credibility
                  </li>
                  <li className={`${profile.address ? "text-green-600" : "text-muted-foreground"}`}>
                    Add your business address
                  </li>
                  <li className={`${profile.services_offered && profile.services_offered.length > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                    Select your services offered
                  </li>
                  <li className={`${caseStudies.length > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                    Add at least one case study
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PartnerProfile;
