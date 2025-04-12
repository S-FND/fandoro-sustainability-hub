
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CloudRain, 
  UserAlert, 
  Scale, 
  Building2 
} from 'lucide-react';

// Mock data (will be replaced with Supabase data)
const mockESGRisks = [
  {
    id: '1',
    risk_category: 'Environmental',
    risk_description: 'Water stress in manufacturing facilities',
    likelihood: 'high',
    impact: 'high',
    risk_score: 16
  },
  {
    id: '2',
    risk_category: 'Social',
    risk_description: 'Labor rights issues in supply chain',
    likelihood: 'medium',
    impact: 'critical',
    risk_score: 12
  },
  {
    id: '3',
    risk_category: 'Governance',
    risk_description: 'Insufficient board diversity',
    likelihood: 'medium',
    impact: 'medium',
    risk_score: 9
  },
  {
    id: '4',
    risk_category: 'Environmental',
    risk_description: 'Carbon pricing regulatory risk',
    likelihood: 'high',
    impact: 'medium',
    risk_score: 12
  }
];

export const ESGRisks = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Environmental':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'Social':
        return <UserAlert className="h-5 w-5 text-purple-500" />;
      case 'Governance':
        return <Scale className="h-5 w-5 text-amber-500" />;
      default:
        return <Building2 className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 15) return 'bg-red-100 text-red-800';
    if (score >= 10) return 'bg-orange-100 text-orange-800';
    if (score >= 5) return 'bg-amber-100 text-amber-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ESG Risks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockESGRisks.map((risk) => (
            <div key={risk.id} className="flex items-center gap-4 p-3 border rounded-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                {getCategoryIcon(risk.risk_category)}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h4 className="font-medium">{risk.risk_description}</h4>
                  <Badge className={getRiskScoreColor(risk.risk_score)}>
                    Score: {risk.risk_score}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>
                    {risk.risk_category} | Impact: {risk.impact}
                  </span>
                  <span>Likelihood: {risk.likelihood}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
