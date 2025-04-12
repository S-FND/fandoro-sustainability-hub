
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AddCaseStudy = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [outcome, setOutcome] = useState("");
  const [year, setYear] = useState<number | string>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate year
      const yearNumber = typeof year === 'string' ? parseInt(year, 10) : year;
      const currentYear = new Date().getFullYear();
      
      if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > currentYear) {
        toast({
          title: "Invalid year",
          description: `Year must be between 1900 and ${currentYear}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create case study in Supabase
      const { error } = await supabase.from("partner_case_studies").insert({
        partner_id: user?.id,
        client_name: clientName,
        description: description,
        outcome: outcome || null,
        year: yearNumber,
      });

      if (error) throw error;

      toast({
        title: "Case study added",
        description: "Your case study has been added to your profile",
      });

      navigate('/partner/profile');
    } catch (error) {
      console.error("Error adding case study:", error);
      toast({
        title: "Error adding case study",
        description: "There was an issue saving your case study",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Add Case Study</h1>
            <Button variant="outline" onClick={() => navigate("/partner/profile")}>
              Cancel
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Case Study Details</CardTitle>
              <CardDescription>
                Share your successful client projects to showcase your expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name*</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="Name of the client organization"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={isLoading}
                    min={1900}
                    max={new Date().getFullYear()}
                    placeholder="Year of project completion"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description*</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="Describe the project, challenges, and your approach"
                    className="h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outcome">Outcome</Label>
                  <Textarea
                    id="outcome"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    disabled={isLoading}
                    placeholder="Describe the results, benefits, or impact of the project"
                    className="h-24"
                  />
                </div>

                <div className="pt-4 flex space-x-3">
                  <Button type="submit" className="flex-1" disabled={isLoading || !clientName || !description}>
                    {isLoading ? "Saving..." : "Save Case Study"}
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

export default AddCaseStudy;
