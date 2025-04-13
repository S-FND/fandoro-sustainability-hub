
import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// Define KPI type with specific status values
type KPIStatus = "pending" | "in_progress" | "completed";

interface KPI {
  id: string;
  name: string;
  category: string;
  description: string;
  dueDate: string;
  status: KPIStatus;
  value: string;
  comments: string;
}

export const EmployeeKpiList: React.FC = () => {
  // Sample KPI data that matches the KPI type
  const initialKpis: KPI[] = [
    {
      id: "kpi1",
      name: "Carbon Emissions Reduction",
      category: "Environmental",
      description: "Measure and report your personal carbon footprint reduction",
      dueDate: "2023-09-30",
      status: "in_progress",
      value: "15%",
      comments: "Currently tracking personal commute changes"
    },
    {
      id: "kpi2",
      name: "Diversity & Inclusion Training",
      category: "Social",
      description: "Complete assigned D&I trainings",
      dueDate: "2023-08-15",
      status: "completed",
      value: "100%",
      comments: "All required modules completed"
    },
    {
      id: "kpi3",
      name: "Ethics Compliance",
      category: "Governance",
      description: "Annual ethics policy review and signature",
      dueDate: "2023-10-01",
      status: "pending",
      value: "0%",
      comments: ""
    }
  ];

  const [kpis, setKpis] = useState<KPI[]>(initialKpis);
  const [editingKpi, setEditingKpi] = useState<string | null>(null);
  const [kpiValues, setKpiValues] = useState<Record<string, string>>({});
  const [kpiComments, setKpiComments] = useState<Record<string, string>>({});

  const handleEditKpi = (id: string) => {
    setEditingKpi(id);
    const kpi = kpis.find(k => k.id === id);
    if (kpi) {
      setKpiValues({...kpiValues, [id]: kpi.value});
      setKpiComments({...kpiComments, [id]: kpi.comments});
    }
  };

  const handleSaveKpi = (id: string) => {
    setKpis(kpis.map(kpi => 
      kpi.id === id ? 
        {...kpi, value: kpiValues[id] || kpi.value, comments: kpiComments[id] || kpi.comments} : 
        kpi
    ));
    setEditingKpi(null);
  };

  const getStatusBadge = (status: KPIStatus) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Your ESG KPIs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>KPI Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kpis.map((kpi) => (
              <TableRow key={kpi.id}>
                <TableCell className="font-medium">
                  <div>
                    {kpi.name}
                    <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                  </div>
                </TableCell>
                <TableCell>{kpi.category}</TableCell>
                <TableCell>{getStatusBadge(kpi.status)}</TableCell>
                <TableCell>{kpi.dueDate}</TableCell>
                <TableCell>
                  {editingKpi === kpi.id ? (
                    <Input 
                      value={kpiValues[kpi.id] || kpi.value}
                      onChange={(e) => setKpiValues({...kpiValues, [kpi.id]: e.target.value})}
                      className="w-20" 
                    />
                  ) : kpi.value}
                </TableCell>
                <TableCell>
                  {editingKpi === kpi.id ? (
                    <Button size="sm" onClick={() => handleSaveKpi(kpi.id)}>Save</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEditKpi(kpi.id)}>Update</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {editingKpi && (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-sm font-medium mb-2">Additional Comments</h3>
            <Textarea 
              value={kpiComments[editingKpi] || kpis.find(k => k.id === editingKpi)?.comments || ''}
              onChange={(e) => setKpiComments({...kpiComments, [editingKpi]: e.target.value})}
              placeholder="Add your comments here..."
              className="h-20"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
