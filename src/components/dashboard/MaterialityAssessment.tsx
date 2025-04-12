
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Send,
  Users,
  BarChart3,
  FileText,
  CheckSquare,
  Calendar,
  AlertTriangle
} from 'lucide-react';

// Mock data for testing
const mockAssessments = [
  {
    id: '1',
    title: '2025 Annual Materiality Assessment',
    description: 'Comprehensive assessment of ESG material topics for 2025 reporting',
    status: 'in_progress',
    start_date: '2025-01-15',
    end_date: '2025-03-30',
    topics: 12,
    participants: 45,
    completion: 68
  },
  {
    id: '2',
    title: 'Supply Chain Focus Assessment',
    description: 'Targeted assessment of supply chain sustainability topics',
    status: 'draft',
    start_date: '2025-05-01',
    end_date: '2025-06-15',
    topics: 8,
    participants: 0,
    completion: 0
  },
  {
    id: '3',
    title: '2024 Baseline Assessment',
    description: 'Initial materiality assessment for ESG reporting framework',
    status: 'completed',
    start_date: '2024-02-10',
    end_date: '2024-04-15',
    topics: 15,
    participants: 52,
    completion: 100
  }
];

const mockTopics = [
  { id: '1', name: 'Climate Change & GHG Emissions', category: 'Environmental', description: 'Managing greenhouse gas emissions and climate-related risks' },
  { id: '2', name: 'Energy Management', category: 'Environmental', description: 'Energy efficiency and renewable energy transition strategies' },
  { id: '3', name: 'Water & Wastewater Management', category: 'Environmental', description: 'Water conservation, quality, and wastewater handling' },
  { id: '4', name: 'Waste & Hazardous Materials', category: 'Environmental', description: 'Waste reduction, recycling and hazardous material management' },
  { id: '5', name: 'Labor Practices', category: 'Social', description: 'Fair wages, working hours, and labor rights' },
  { id: '6', name: 'Employee Health & Safety', category: 'Social', description: 'Workplace safety and employee wellbeing' },
  { id: '7', name: 'Diversity & Inclusion', category: 'Social', description: 'Workforce diversity, equal opportunities, and inclusive practices' },
  { id: '8', name: 'Community Relations', category: 'Social', description: 'Community engagement and social impact initiatives' },
  { id: '9', name: 'Business Ethics', category: 'Governance', description: 'Anti-corruption, ethics, and integrity' },
  { id: '10', name: 'Board Structure & Oversight', category: 'Governance', description: 'Board composition, independence, and ESG oversight' },
  { id: '11', name: 'Data Security & Privacy', category: 'Governance', description: 'Protection of sensitive data and privacy management' },
  { id: '12', name: 'Supply Chain Management', category: 'Governance', description: 'Supplier assessment, engagement, and sustainable procurement' }
];

const mockInvites = [
  { id: '1', stakeholder_name: 'John Smith', stakeholder_type: 'supplier', email: 'john.smith@acme.com', status: 'pending', sent_date: '2025-01-20' },
  { id: '2', stakeholder_name: 'Jane Doe', stakeholder_type: 'investor', email: 'jane.doe@investor.com', status: 'completed', sent_date: '2025-01-20' },
  { id: '3', stakeholder_name: 'Mike Johnson', stakeholder_type: 'community', email: 'mike@community.org', status: 'accepted', sent_date: '2025-01-21' },
  { id: '4', stakeholder_name: 'Sarah Wilson', stakeholder_type: 'employee', email: 'swilson@enterprise.com', status: 'completed', sent_date: '2025-01-20' },
  { id: '5', stakeholder_name: 'Raj Kumar', stakeholder_type: 'regulator', email: 'raj@regulators.gov', status: 'pending', sent_date: '2025-01-22' }
];

export const MaterialityAssessment = () => {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState(mockAssessments);
  const [topics, setTopics] = useState(mockTopics);
  const [invites, setInvites] = useState(mockInvites);
  const [selectedAssessment, setSelectedAssessment] = useState(mockAssessments[0]);
  
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  });
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const handleCreateAssessment = () => {
    if (!newAssessment.title || !newAssessment.start_date) {
      toast({
        title: "Missing information",
        description: "Please provide a title and start date",
        variant: "destructive",
      });
      return;
    }
    
    const assessment = {
      id: Date.now().toString(),
      ...newAssessment,
      status: 'draft',
      topics: 0,
      participants: 0,
      completion: 0
    };
    
    setAssessments([assessment, ...assessments]);
    setSelectedAssessment(assessment);
    setNewAssessment({
      title: '',
      description: '',
      start_date: '',
      end_date: ''
    });
    
    toast({
      title: "Assessment created",
      description: "Your new materiality assessment has been created",
    });
    
    setIsCreateDialogOpen(false);
  };
  
  const handleSendInvites = () => {
    toast({
      title: "Invitations sent",
      description: "Stakeholders have been invited to participate in the assessment",
    });
  };
  
  const handleSendReminders = () => {
    toast({
      title: "Reminders sent",
      description: "Reminder emails have been sent to pending stakeholders",
    });
  };
  
  const handleStartAssessment = () => {
    setAssessments(assessments.map(a => 
      a.id === selectedAssessment.id ? {...a, status: 'in_progress'} : a
    ));
    
    setSelectedAssessment({
      ...selectedAssessment,
      status: 'in_progress'
    });
    
    toast({
      title: "Assessment started",
      description: "The materiality assessment is now in progress",
    });
  };
  
  const handleCompleteAssessment = () => {
    setAssessments(assessments.map(a => 
      a.id === selectedAssessment.id ? {...a, status: 'completed', completion: 100} : a
    ));
    
    setSelectedAssessment({
      ...selectedAssessment,
      status: 'completed',
      completion: 100
    });
    
    toast({
      title: "Assessment completed",
      description: "The materiality assessment has been marked as complete",
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const getInviteStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'accepted':
        return <Badge variant="secondary">Accepted</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Environmental':
        return "bg-green-100 text-green-800";
      case 'Social':
        return "bg-blue-100 text-blue-800";
      case 'Governance':
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Materiality Assessment</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{selectedAssessment.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{selectedAssessment.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(selectedAssessment.status)}
              {selectedAssessment.status === 'draft' && (
                <Button size="sm" onClick={handleStartAssessment}>Start Assessment</Button>
              )}
              {selectedAssessment.status === 'in_progress' && (
                <Button size="sm" onClick={handleCompleteAssessment}>Complete Assessment</Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
            <div className="p-4 flex flex-col">
              <div className="flex items-center text-sm text-muted-foreground space-x-2 mb-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {selectedAssessment.start_date} to {selectedAssessment.end_date || 'TBD'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                  <span className="text-2xl font-bold">{selectedAssessment.topics}</span>
                  <span className="text-xs text-muted-foreground">Topics</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                  <span className="text-2xl font-bold">{selectedAssessment.participants}</span>
                  <span className="text-xs text-muted-foreground">Participants</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                  <span className="text-2xl font-bold">{selectedAssessment.completion}%</span>
                  <span className="text-xs text-muted-foreground">Completed</span>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" size="sm" disabled={selectedAssessment.status === 'completed'}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" disabled={selectedAssessment.status === 'draft'}>
                  <FileText className="h-4 w-4 mr-1" />
                  Results
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Available Assessments
              </h3>
              <div className="space-y-3">
                {assessments.map((assessment) => (
                  <div 
                    key={assessment.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${selectedAssessment.id === assessment.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <div>
                      <div className="font-medium">{assessment.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {assessment.start_date}
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(assessment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Assessment Status
                </h3>
              </div>
              <div className="space-y-2">
                <div className="bg-muted/50 p-2 rounded-md">
                  <div className="text-sm font-medium">Topic Definition</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedAssessment.topics > 0 ? `${selectedAssessment.topics} topics defined` : "No topics defined yet"}
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded-md">
                  <div className="text-sm font-medium">Stakeholder Invitations</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedAssessment.participants > 0 ? `${selectedAssessment.participants} stakeholders invited` : "No invitations sent yet"}
                  </div>
                </div>
                <div className="bg-muted/50 p-2 rounded-md">
                  <div className="text-sm font-medium">Response Rate</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedAssessment.participants > 0 ? `${selectedAssessment.completion}% completion rate` : "No responses yet"}
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button size="sm" className="w-full" disabled={selectedAssessment.status === 'draft' || selectedAssessment.status === 'completed'}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedAssessment && selectedAssessment.status !== 'draft' && (
        <Tabs defaultValue="topics">
          <TabsList>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholder Invitations</TabsTrigger>
            {selectedAssessment.status === 'completed' && (
              <TabsTrigger value="results">Results</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="topics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Material Topics</h3>
              <Button size="sm" disabled={selectedAssessment.status === 'completed'}>
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Topic</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topics.map((topic) => (
                      <TableRow key={topic.id}>
                        <TableCell className="font-medium">{topic.name}</TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(topic.category)}>
                            {topic.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {topic.description}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" disabled={selectedAssessment.status === 'completed'}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stakeholders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Stakeholder Invitations</h3>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={handleSendReminders} disabled={selectedAssessment.status === 'completed'}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
                <Button size="sm" onClick={handleSendInvites} disabled={selectedAssessment.status === 'completed'}>
                  <Users className="h-4 w-4 mr-2" />
                  Invite Stakeholders
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stakeholder</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invited On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invites.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell className="font-medium">{invite.stakeholder_name}</TableCell>
                        <TableCell>{invite.stakeholder_type}</TableCell>
                        <TableCell>{invite.email}</TableCell>
                        <TableCell>{getInviteStatusBadge(invite.status)}</TableCell>
                        <TableCell>{invite.sent_date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {selectedAssessment.status === 'completed' && (
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Materiality Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                    <div className="text-center p-8">
                      <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium mt-4">Materiality Matrix</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        The visualization of materiality assessment results would appear here,
                        mapping impact on business against impact on stakeholders.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
      
      {/* Create Assessment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Assessment</DialogTitle>
            <DialogDescription>
              Create a new materiality assessment to identify ESG priorities
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newAssessment.title}
                onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                className="col-span-3"
                placeholder="e.g., 2025 Materiality Assessment"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newAssessment.description}
                onChange={(e) => setNewAssessment({...newAssessment, description: e.target.value})}
                className="col-span-3"
                placeholder="Brief description of assessment purpose"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start_date" className="text-right">
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={newAssessment.start_date}
                onChange={(e) => setNewAssessment({...newAssessment, start_date: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end_date" className="text-right">
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                value={newAssessment.end_date}
                onChange={(e) => setNewAssessment({...newAssessment, end_date: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAssessment}>
              Create Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
