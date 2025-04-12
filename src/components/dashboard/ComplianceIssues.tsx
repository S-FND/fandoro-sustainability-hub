
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Mock data (will be replaced with Supabase data)
const mockComplianceIssues = [
  {
    id: '1',
    compliance_type: 'Environmental',
    description: 'Annual emissions reporting due',
    status: 'pending',
    due_date: '2025-05-15',
    severity: 'high'
  },
  {
    id: '2',
    compliance_type: 'Social',
    description: 'Employee diversity report not submitted',
    status: 'non_compliant',
    due_date: '2025-03-30',
    severity: 'medium'
  },
  {
    id: '3',
    compliance_type: 'Governance',
    description: 'Board meeting minutes documentation complete',
    status: 'compliant',
    due_date: '2025-04-01',
    severity: 'low'
  },
  {
    id: '4',
    compliance_type: 'Environmental',
    description: 'Waste management plan update required',
    status: 'pending',
    due_date: '2025-06-01',
    severity: 'medium'
  }
];

export const ComplianceIssues = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'non_compliant':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Compliance Issues</span>
          <Badge variant="outline" className="ml-2">
            {mockComplianceIssues.length} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockComplianceIssues.map((issue) => (
            <div key={issue.id} className="flex items-center gap-3 p-3 border rounded-md">
              <div className="flex-shrink-0">
                {getStatusIcon(issue.status)}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h4 className="font-medium">{issue.description}</h4>
                  <Badge className={`${getSeverityColor(issue.severity)}`}>
                    {issue.severity}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{issue.compliance_type}</span>
                  <span>Due: {new Date(issue.due_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
