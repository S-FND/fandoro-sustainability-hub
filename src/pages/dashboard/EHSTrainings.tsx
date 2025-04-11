import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck2, CheckCircle, Clock, Plus, Users } from "lucide-react";

type Training = {
  id: number;
  name: string;
  description: string;
  status: string;
  date?: string;
  department?: string;
  delivery?: string;
  location?: string;
};

const trainingsList: Training[] = [
  {
    id: 1,
    name: "Fire Safety Training",
    description: "Basic fire safety protocols and evacuation procedures",
    status: "scheduled",
    date: "2023-08-15",
  },
  {
    id: 2,
    name: "First Aid Basics",
    description: "Essential first aid techniques for workplace emergencies",
    status: "pending",
  },
  {
    id: 3,
    name: "Hazardous Materials Handling",
    description: "Proper handling and disposal of hazardous materials",
    status: "pending",
  },
  {
    id: 4,
    name: "Ergonomics Training",
    description: "Preventing workplace injuries through proper ergonomics",
    status: "completed",
    date: "2023-07-10",
  },
  {
    id: 5,
    name: "Emergency Response",
    description: "Procedures for various emergency situations",
    status: "pending",
  },
];

const EHSTrainings = () => {
  const [trainings, setTrainings] = useState<Training[]>(trainingsList);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTraining, setSelectedTraining] = useState<string | undefined>();
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>();
  const [deliveryMode, setDeliveryMode] = useState<string>("offline");
  const [location, setLocation] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const handleScheduleTraining = () => {
    if (!selectedTraining || !selectedDate || !selectedDepartment) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (deliveryMode === "offline" && !location) {
      toast({
        title: "Location required",
        description: "Please specify the training location",
        variant: "destructive",
      });
      return;
    }

    const updatedTrainings = trainings.map(t => {
      if (t.id === parseInt(selectedTraining)) {
        return {
          ...t,
          status: "scheduled",
          date: selectedDate.toISOString().split('T')[0],
          department: selectedDepartment,
          delivery: deliveryMode,
          location: deliveryMode === "offline" ? location : "Online",
        };
      }
      return t;
    });

    setTrainings(updatedTrainings);
    setDialogOpen(false);

    toast({
      title: "Training scheduled",
      description: "The EHS training has been successfully scheduled",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">EHS Trainings</h1>
            <p className="text-muted-foreground">
              Schedule and manage Environmental Health and Safety trainings
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Schedule Training
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule EHS Training</DialogTitle>
                <DialogDescription>
                  Set up a new training session for your team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="training">Select Training</Label>
                  <Select
                    value={selectedTraining}
                    onValueChange={setSelectedTraining}
                  >
                    <SelectTrigger id="training">
                      <SelectValue placeholder="Choose a training" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainings
                        .filter(t => t.status === "pending")
                        .map(training => (
                          <SelectItem
                            key={training.id}
                            value={training.id.toString()}
                          >
                            {training.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Training Date</Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="mx-auto"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Responsible Department</Label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="All">All Departments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Delivery Mode</Label>
                  <RadioGroup
                    value={deliveryMode}
                    onValueChange={setDeliveryMode}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="offline" id="offline" />
                      <Label htmlFor="offline">Offline (In-person)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online">Online (LMS)</Label>
                    </div>
                  </RadioGroup>
                </div>
                {deliveryMode === "offline" && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Training Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g., Conference Room A"
                    />
                  </div>
                )}
                <Button
                  onClick={handleScheduleTraining}
                  className="w-full"
                >
                  Schedule Training
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="bg-green-50 border-b border-green-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Scheduled</CardTitle>
                <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center">
                  {trainings.filter(t => t.status === "scheduled").length}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {trainings
                  .filter(t => t.status === "scheduled")
                  .map(training => (
                    <div
                      key={training.id}
                      className="border rounded-md p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{training.name}</h3>
                        <CalendarCheck2 className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {training.description}
                      </p>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{training.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>
                            {training.department || "All Departments"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pending</CardTitle>
                <div className="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center">
                  {trainings.filter(t => t.status === "pending").length}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {trainings
                  .filter(t => t.status === "pending")
                  .map(training => (
                    <div
                      key={training.id}
                      className="border rounded-md p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{training.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            setSelectedTraining(training.id.toString());
                            setDialogOpen(true);
                          }}
                        >
                          Schedule
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {training.description}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Completed</CardTitle>
                <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center">
                  {trainings.filter(t => t.status === "completed").length}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {trainings
                  .filter(t => t.status === "completed")
                  .map(training => (
                    <div
                      key={training.id}
                      className="border rounded-md p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{training.name}</h3>
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {training.description}
                      </p>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{training.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default EHSTrainings;
