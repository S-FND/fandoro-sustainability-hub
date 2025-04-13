
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "lucide-react";

// Define Training type with specific status values
type TrainingStatus = "not_started" | "in_progress" | "completed";

interface Training {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TrainingStatus;
  progress: number;
  assignedDate: string;
  type: string;
  completionDate?: string;
}

export const EmployeeTrainingList: React.FC = () => {
  // Sample training data that matches the Training type
  const initialTrainings: Training[] = [
    {
      id: "tr1",
      title: "Health & Safety at Work",
      description: "Essential health and safety guidelines for the workplace",
      dueDate: "2023-09-15",
      status: "in_progress",
      progress: 65,
      assignedDate: "2023-08-01",
      type: "Mandatory"
    },
    {
      id: "tr2",
      title: "Environmental Management Systems",
      description: "Introduction to ISO 14001 and environmental management",
      dueDate: "2023-10-30",
      status: "not_started",
      progress: 0,
      assignedDate: "2023-08-05",
      type: "Recommended"
    },
    {
      id: "tr3",
      title: "Data Protection & Privacy",
      description: "Guidelines for handling personal and sensitive data",
      dueDate: "2023-07-30",
      status: "completed",
      progress: 100,
      assignedDate: "2023-07-01",
      completionDate: "2023-07-25",
      type: "Mandatory"
    },
    {
      id: "tr4",
      title: "Sustainability Fundamentals",
      description: "Learn the basics of corporate sustainability and ESG initiatives",
      dueDate: "2023-11-15",
      status: "not_started",
      progress: 0,
      assignedDate: "2023-08-10",
      type: "Optional"
    }
  ];

  const [trainings, setTrainings] = useState<Training[]>(initialTrainings);

  const getStatusBadge = (status: TrainingStatus) => {
    switch(status) {
      case "not_started":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Not Started</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getTypeBadge = (type: string) => {
    switch(type) {
      case "Mandatory":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Mandatory</Badge>;
      case "Recommended":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Recommended</Badge>;
      case "Optional":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Optional</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const handleLaunchTraining = (id: string) => {
    // Here you would integrate with your LMS to launch the training
    // For now, we'll just simulate opening a new window
    alert(`Launching training: ${trainings.find(t => t.id === id)?.title}`);
    window.open("https://lms.fandoro.com", "_blank");
  };

  const handleRequestTraining = () => {
    // Here you would integrate with your LMS to request new trainings
    // For now, we'll just simulate opening a new window
    alert("Redirecting to LMS portal to request new trainings");
    window.open("https://lms.fandoro.com/request", "_blank");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Assigned Trainings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell className="font-medium">
                    <div>
                      {training.title}
                      <p className="text-xs text-muted-foreground mt-1">{training.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(training.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 opacity-70" />
                      <span className="text-sm">{training.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(training.status)}</TableCell>
                  <TableCell>
                    <div className="w-[100px]">
                      <Progress value={training.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{training.progress}% complete</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant={training.status === "completed" ? "outline" : "default"}
                      disabled={training.status === "completed"}
                      onClick={() => handleLaunchTraining(training.id)}
                    >
                      {training.status === "completed" ? "Review" : (training.status === "in_progress" ? "Continue" : "Start")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Need additional training?</h3>
        <Button onClick={handleRequestTraining}>
          Request Training
        </Button>
      </div>
    </div>
  );
};
