
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Plus } from "lucide-react";
import { CaseStudy } from "@/types/partner";

interface CaseStudiesCardProps {
  caseStudies: CaseStudy[];
}

export const CaseStudiesCard: React.FC<CaseStudiesCardProps> = ({ caseStudies }) => {
  const navigate = useNavigate();
  
  return (
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
  );
};
