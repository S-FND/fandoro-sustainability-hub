import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, BookOpen, Calendar, CheckCircle, Clock, School, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type Training = {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  status?: "not_started" | "in_progress" | "completed";
  progress?: number;
  assignedDate?: string;
  completionDate?: string;
  duration?: string;
  type: string;
  level?: string;
};

// Mock data for assigned trainings
const assignedTrainings: Training[] = [
  {
    id: "1",
    title: "ESG Fundamentals",
    description: "Introduction to Environmental, Social, and Governance concepts",
    dueDate: "2025-05-10",
    status: "in_progress",
    progress: 60,
    assignedDate: "2025-03-25",
    type: "Online",
  },
  {
    id: "2",
    title: "Carbon Footprint Calculation",
    description: "Learn how to calculate carbon footprint for your activities",
    dueDate: "2025-04-30",
    status: "completed",
    progress: 100,
    assignedDate: "2025-03-20",
    type: "Workshop",
    completionDate: "2025-04-15",
  },
  {
    id: "3",
    title: "Fire Safety Training",
    description: "Annual refresher for fire safety protocols",
    dueDate: "2025-05-20",
    status: "not_started",
    progress: 0,
    assignedDate: "2025-04-10",
    type: "In-person",
  },
  {
    id: "4",
    title: "Sustainable Development Goals",
    description: "Understanding the UN SDGs and their implementation",
    dueDate: "2025-06-15",
    status: "not_started",
    progress: 0,
    assignedDate: "2025-04-05",
    type: "Online",
  },
];

// Mock data for available trainings
const availableTrainings: Training[] = [
  {
    id: "5",
    title: "Diversity & Inclusion Best Practices",
    description: "Creating an inclusive workplace environment",
    duration: "4 hours",
    type: "Online",
    level: "Intermediate",
  },
  {
    id: "6",
    title: "Sustainable Supply Chain Management",
    description: "Principles and practices for sustainable sourcing",
    duration: "8 hours",
    type: "Workshop",
    level: "Advanced",
  },
  {
    id: "7",
    title: "ESG Reporting Standards",
    description: "Overview of GRI, SASB, TCFD and other reporting frameworks",
    duration: "6 hours",
    type: "Online",
    level: "Advanced",
  },
  {
    id: "8",
    title: "Environmental Compliance",
    description: "Understanding environmental regulations and compliance requirements",
    duration: "3 hours",
    type: "Online",
    level: "Beginner",
  },
];

export const EmployeeTrainingList = () => {
  const [trainings, setTrainings] = useState<Training[]>(assignedTrainings);
  const [availableCourses, setAvailableCourses] = useState<Training[]>(availableTrainings);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("assigned");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleViewDetails = (training: Training) => {
    setSelectedTraining(training);
    setDialogOpen(true);
  };

  const handleRequestTraining = (training: Training) => {
    toast({
      title: "Training Requested",
      description: `Your request for "${training.title}" has been submitted for approval.`,
    });
  };

  const handleStartTraining = () => {
    if (!selectedTraining) return;
    
    window.open("https://lms.fandoro.com", "_blank");
    setDialogOpen(false);
  };

  const filteredAvailableCourses = availableCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: "not_started" | "in_progress" | "completed") => {
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
          <Badge variant="outline" className="bg-slate-100">
            Not Started
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="assigned">Assigned Trainings</TabsTrigger>
          <TabsTrigger value="available">Available Trainings</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <School className="h-5 w-5 mr-2" />
                Your Assigned Trainings
              </CardTitle>
              <CardDescription>
                Complete these trainings to fulfill your ESG and compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training Title</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.title}</TableCell>
                      <TableCell>
                        {training.dueDate && new Date(training.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{training.type}</TableCell>
                      <TableCell>{getStatusBadge(training.status || "not_started")}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={training.progress} className="w-[80px]" />
                          <span className="text-xs">{training.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(training)}
                        >
                          <Search className="h-4 w-4 mr-1" /> Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Available Trainings
              </CardTitle>
              <CardDescription>
                Browse and request additional ESG and professional development trainings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input 
                  placeholder="Search trainings..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training Title</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAvailableCourses.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{training.title}</p>
                          <p className="text-xs text-muted-foreground">{training.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{training.duration}</TableCell>
                      <TableCell>{training.type}</TableCell>
                      <TableCell>{training.level}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRequestTraining(training)}
                        >
                          Request
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Training Details</DialogTitle>
          </DialogHeader>
          {selectedTraining && (
            <div className="space-y-4 py-2">
              <div>
                <h2 className="text-xl font-semibold">{selectedTraining.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedTraining.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                {selectedTraining.assignedDate && (
                  <div>
                    <p className="text-sm font-medium">Assigned Date</p>
                    <p className="text-sm">{new Date(selectedTraining.assignedDate).toLocaleDateString()}</p>
                  </div>
                )}
                
                {selectedTraining.dueDate && (
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="text-sm">{new Date(selectedTraining.dueDate).toLocaleDateString()}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm">{selectedTraining.type}</p>
                </div>
                
                {selectedTraining.status && (
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm">{getStatusBadge(selectedTraining.status)}</p>
                  </div>
                )}
                
                {selectedTraining.progress !== undefined && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium mb-1">Progress</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedTraining.progress} className="w-full" />
                      <span className="text-sm w-12">{selectedTraining.progress}%</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleStartTraining}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {selectedTraining.status === "not_started" ? "Start Training" : 
                   selectedTraining.status === "in_progress" ? "Continue Training" : "View Certificate"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
