
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PartnerProfile as ProfileType, CaseStudy, ProfileStatus, PartnerType } from "@/types/partner";
import { Pencil } from "lucide-react";
import { ProfileLoadingState, EmptyProfileState } from "@/components/partner/ProfileLoadingState";
import { OrganizationProfileCard } from "@/components/partner/OrganizationProfileCard";
import { CaseStudiesCard } from "@/components/partner/CaseStudiesCard";
import { ProfileStatusCard } from "@/components/partner/ProfileStatusCard";
import { ProfileCompletionTips } from "@/components/partner/ProfileCompletionTips";

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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <ProfileLoadingState />
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <EmptyProfileState />
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
            <OrganizationProfileCard profile={profile} />

            {/* Case Studies Card */}
            <CaseStudiesCard caseStudies={caseStudies} />
          </div>

          <div className="space-y-6">
            {/* Profile Status Card */}
            <ProfileStatusCard profileStatus={profile.profile_status} />
            
            {/* Profile Completion Tips */}
            <ProfileCompletionTips 
              gstNumber={profile.gst_number}
              website={profile.website}
              address={profile.address}
              servicesOffered={profile.services_offered}
              caseStudies={caseStudies}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PartnerProfile;
