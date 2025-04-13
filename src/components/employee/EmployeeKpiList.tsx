
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, Clock, Edit, LineChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for KPIs assigned to the employee
const mockKpis = [
  {
    id: "1",
    name: "Carbon Footprint Reduction",
    category: "Environmental",
    description: "Track and reduce personal carbon footprint through various activities",
    dueDate: "2025-05-15",
    status: "pending",
    value: "",
    comments: "",
  },
  {
    id: "2",
    name: "Water Conservation",
    category: "Environmental",
    description: "Track water conservation efforts in your department",
    dueDate: "2025-05-20",
    status: "in_progress",
    value: "15%",
    comments: "Implemented water-saving fixtures",
  },
  {
    id: "3",
    name: "Diversity & Inclusion Survey",
    category: "Social",
    description: "Complete the annual D&I survey",
    dueDate: "2025-04-25",
    status: "completed",
    value: "Completed",
    comments: "Survey submitted on April 10, 2025",
  },
  {
    id: "4",
    name: "ESG Awareness",
    category: "Governance",
    description: "Track number of ESG training sessions completed",
    dueDate: "2025-06-30",
    status: "pending",
    value: "",
    comments: "",
  },
];

type KPI = {
  id: string;
  name: string;
  category: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  value: string;
  comments: string;
};

export const EmployeeKpiList = () => {
  const [kpis, setKpis] = useState<KPI[]>(mockKpis);
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null);
  const [kpiValue, setKpiValue] = useState("");
  const [kpiComments, setKpiComments] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditKpi = (kpi: KPI) => {
    setSelectedKpi(kpi);
    setKpiValue(kpi.value);
    setKpiComments(kpi.comments);
    setDialogOpen(true);
  };

  const handleSaveKpi = () => {
    if (!selectedKpi) return;

    const updatedKpis = kpis.map(kpi => {
      if (kpi.id === selectedKpi.id) {
        return {
          ...kpi,
          status: kpiValue ? (kpi.status === "pending" ? "in_progress" : kpi.status) : kpi.status,
          value: kpiValue,
          comments: kpiComments
        };
      }
      return kpi;
    });

    setKpis(updatedKpis);
    setDialogOpen(false);
    toast({
      title: "KPI Updated",
      description: "Your KPI data has been updated successfully.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-500">
            <Clock className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <AlertCircle className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <LineChart className="h-5 w-5 mr-2" />
            ESG KPIs Assigned To You
          </CardTitle>
          <CardDescription>
            Track and report on your assigned sustainability key performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KPI Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.map((kpi) => (
                <TableRow key={kpi.id}>
                  <TableCell className="font-medium">{kpi.name}</TableCell>
                  <TableCell>{kpi.category}</TableCell>
                  <TableCell>{new Date(kpi.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(kpi.status)}</TableCell>
                  <TableCell>{kpi.value || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditKpi(kpi)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            {kpis.filter(k => k.status === "completed").length} of {kpis.length} KPIs completed
          </p>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update KPI Data</DialogTitle>
          </DialogHeader>
          {selectedKpi && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-semibold">{selectedKpi.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedKpi.description}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input 
                  value={kpiValue} 
                  onChange={(e) => setKpiValue(e.target.value)} 
                  placeholder="Enter KPI value"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Comments</label>
                <Textarea 
                  value={kpiComments} 
                  onChange={(e) => setKpiComments(e.target.value)} 
                  placeholder="Add additional comments or notes"
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveKpi}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
