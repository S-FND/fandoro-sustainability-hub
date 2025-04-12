
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChartHorizontal, 
  Plus, 
  ListPlus, 
  Send, 
  Trash2, 
  Mail, 
  ChartPie,
  BarChart4,
} from "lucide-react";

interface Stakeholder {
  id: string;
  name: string;
  email: string;
  type: string;
  organization: string;
}

interface MaterialityAssessment {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

interface MaterialityTopic {
  id: string;
  assessment_id: string;
  topic_name: string;
  description: string;
  category: string;
  sequence_order: number;
}

interface MaterialityInvite {
  id: string;
  assessment_id: string;
  stakeholder_id: string;
  stakeholder_name?: string;
  stakeholder_email?: string;
  stakeholder_type?: string;
  status: string;
  completed_at: string | null;
}

const Materiality = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("assessments");
  const [assessments, setAssessments] = useState<MaterialityAssessment[]>([]);
  const [topics, setTopics] = useState<MaterialityTopic[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [invites, setInvites] = useState<MaterialityInvite[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [showAddTopicForm, setShowAddTopicForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  
  const [newAssessment, setNewAssessment] = useState({
    title: "",
    description: "",
  });
  
  const [newTopic, setNewTopic] = useState({
    topic_name: "",
    description: "",
    category: "Environmental",
  });
  
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchAssessments();
      fetchStakeholders();
    }
  }, [user?.id]);
  
  useEffect(() => {
    if (selectedAssessment) {
      fetchTopics(selectedAssessment);
      fetchInvites(selectedAssessment);
    }
  }, [selectedAssessment]);

  const fetchAssessments = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("enterprise_materiality_assessments")
        .select("*")
        .eq("enterprise_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setAssessments(data || []);
      
      // Select the first assessment by default if available
      if (data && data.length > 0 && !selectedAssessment) {
        setSelectedAssessment(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
      toast({
        title: "Error fetching assessments",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTopics = async (assessmentId: string) => {
    try {
      const { data, error } = await supabase
        .from("enterprise_materiality_topics")
        .select("*")
        .eq("assessment_id", assessmentId)
        .order("sequence_order", { ascending: true });
        
      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };
  
  const fetchStakeholders = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("enterprise_stakeholders")
        .select("*")
        .eq("enterprise_id", user.id);
        
      if (error) throw error;
      setStakeholders(data || []);
    } catch (error) {
      console.error("Error fetching stakeholders:", error);
    }
  };
  
  const fetchInvites = async (assessmentId: string) => {
    try {
      const { data, error } = await supabase
        .from("enterprise_materiality_invites")
        .select(`
          *,
          stakeholder:stakeholder_id (
            name,
            email,
            type
          )
        `)
        .eq("assessment_id", assessmentId);
        
      if (error) throw error;
      
      const formattedInvites = data?.map(invite => ({
        ...invite,
        stakeholder_name: invite.stakeholder?.name,
        stakeholder_email: invite.stakeholder?.email,
        stakeholder_type: invite.stakeholder?.type
      }));
      
      setInvites(formattedInvites || []);
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  };

  const handleCreateAssessment = async () => {
    if (!user?.id || !newAssessment.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for the assessment",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("enterprise_materiality_assessments")
        .insert({
          title: newAssessment.title,
          description: newAssessment.description,
          enterprise_id: user.id,
          status: "draft"
        })
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setAssessments(prev => [data[0], ...prev]);
        setSelectedAssessment(data[0].id);
        setActiveTab("topics");
      }
      
      setNewAssessment({ title: "", description: "" });
      
      toast({
        title: "Assessment created",
        description: "Your materiality assessment has been created",
      });
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast({
        title: "Error creating assessment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleAddTopic = async () => {
    if (!selectedAssessment || !newTopic.topic_name || !newTopic.category) {
      toast({
        title: "Missing information",
        description: "Please provide a name and category",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get current count for new sequence order
      const nextSequence = topics.length + 1;
      
      const { data, error } = await supabase
        .from("enterprise_materiality_topics")
        .insert({
          assessment_id: selectedAssessment,
          topic_name: newTopic.topic_name,
          description: newTopic.description,
          category: newTopic.category,
          sequence_order: nextSequence
        })
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setTopics(prev => [...prev, data[0]]);
      }
      
      setNewTopic({
        topic_name: "",
        description: "",
        category: "Environmental"
      });
      
      setShowAddTopicForm(false);
      
      toast({
        title: "Topic added",
        description: "The topic has been added to your assessment",
      });
    } catch (error) {
      console.error("Error adding topic:", error);
      toast({
        title: "Error adding topic",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTopic = async (id: string) => {
    try {
      const { error } = await supabase
        .from("enterprise_materiality_topics")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setTopics(prev => prev.filter(topic => topic.id !== id));
      
      toast({
        title: "Topic removed",
        description: "The topic has been removed from your assessment",
      });
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast({
        title: "Error removing topic",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleSendInvites = async () => {
    if (!selectedAssessment || selectedStakeholders.length === 0) {
      toast({
        title: "No stakeholders selected",
        description: "Please select at least one stakeholder",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create array of invite objects
      const invitations = selectedStakeholders.map(stakeholderId => ({
        assessment_id: selectedAssessment,
        stakeholder_id: stakeholderId,
      }));
      
      const { data, error } = await supabase
        .from("enterprise_materiality_invites")
        .insert(invitations)
        .select();
        
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Duplicate invitations",
            description: "Some stakeholders have already been invited",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Invitations sent",
          description: "The stakeholders have been invited to participate",
        });
        
        if (data) {
          await fetchInvites(selectedAssessment);
        }
        
        setSelectedStakeholders([]);
        setShowInviteForm(false);
      }
    } catch (error) {
      console.error("Error sending invites:", error);
      toast({
        title: "Error sending invitations",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteInvite = async (id: string) => {
    try {
      const { error } = await supabase
        .from("enterprise_materiality_invites")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setInvites(prev => prev.filter(invite => invite.id !== id));
      
      toast({
        title: "Invitation removed",
        description: "The invitation has been canceled",
      });
    } catch (error) {
      console.error("Error deleting invite:", error);
      toast({
        title: "Error removing invitation",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleResendInvite = (inviteId: string, email: string) => {
    // In a real implementation, this would call an edge function
    // to send an email to the stakeholder
    toast({
      title: "Invitation resent",
      description: `The invitation has been sent to ${email}`,
    });
  };
  
  const getAssessmentStatusBadge = (status: string) => {
    const statusColors = {
      draft: "bg-slate-100 text-slate-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };
    
    const statusText = {
      draft: "Draft",
      in_progress: "In Progress",
      completed: "Completed",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Materiality Assessment</h1>
          <p className="text-muted-foreground">
            Identify and prioritize ESG topics that matter most to your business and stakeholders
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="engagement">Stakeholder Engagement</TabsTrigger>
            <TabsTrigger value="results">Results & Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assessments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChartHorizontal className="h-5 w-5 mr-2" />
                  Create New Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assessment Title</Label>
                  <Input
                    id="title"
                    value={newAssessment.title}
                    onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                    placeholder="e.g., 2023 Materiality Assessment"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAssessment.description}
                    onChange={(e) => setNewAssessment({...newAssessment, description: e.target.value})}
                    placeholder="Describe the purpose and scope of this assessment..."
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleCreateAssessment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assessment
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Assessments</CardTitle>
                <CardDescription>Select an assessment to manage its topics and stakeholders</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center">Loading assessments...</div>
                ) : assessments.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No assessments created yet.</p>
                    <p className="text-sm">Create your first materiality assessment above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assessments.map((assessment) => (
                      <div 
                        key={assessment.id} 
                        className={`p-4 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedAssessment === assessment.id ? "border-primary bg-muted/50" : ""
                        }`}
                        onClick={() => setSelectedAssessment(assessment.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{assessment.title}</div>
                          <div>{getAssessmentStatusBadge(assessment.status)}</div>
                        </div>
                        {assessment.description && (
                          <p className="text-sm text-muted-foreground mt-2">{assessment.description}</p>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          Created on {new Date(assessment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="topics" className="space-y-4">
            {!selectedAssessment ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No assessment selected.</p>
                  <p className="text-sm">Please select or create an assessment first.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Material Topics
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {assessments.find(a => a.id === selectedAssessment)?.title}
                    </span>
                  </h2>
                  <Button onClick={() => setShowAddTopicForm(true)} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Topic
                  </Button>
                </div>
                
                <Dialog open={showAddTopicForm} onOpenChange={setShowAddTopicForm}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Material Topic</DialogTitle>
                      <DialogDescription>
                        Add a topic for stakeholders to assess in terms of importance
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="topicName">Topic Name</Label>
                        <Input
                          id="topicName"
                          value={newTopic.topic_name}
                          onChange={(e) => setNewTopic({...newTopic, topic_name: e.target.value})}
                          placeholder="e.g., Climate Change"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="topicCategory">Category</Label>
                        <Select
                          value={newTopic.category}
                          onValueChange={(value) => setNewTopic({...newTopic, category: value})}
                        >
                          <SelectTrigger id="topicCategory">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Environmental">Environmental</SelectItem>
                            <SelectItem value="Social">Social</SelectItem>
                            <SelectItem value="Governance">Governance</SelectItem>
                            <SelectItem value="Economic">Economic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="topicDescription">Description</Label>
                        <Textarea
                          id="topicDescription"
                          value={newTopic.description}
                          onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                          placeholder="Provide a description of this topic..."
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddTopicForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddTopic}>
                        <ListPlus className="h-4 w-4 mr-2" />
                        Add Topic
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Card>
                  <CardContent className="p-0">
                    {topics.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No topics added yet.</p>
                        <p className="text-sm">Add topics to include in your materiality assessment.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>#</TableHead>
                              <TableHead>Topic Name</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {topics.map((topic, index) => (
                              <TableRow key={topic.id}>
                                <TableCell>{topic.sequence_order || index + 1}</TableCell>
                                <TableCell className="font-medium">{topic.topic_name}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    topic.category === 'Environmental' ? 'bg-green-100 text-green-800' : 
                                    topic.category === 'Social' ? 'bg-purple-100 text-purple-800' : 
                                    topic.category === 'Governance' ? 'bg-amber-100 text-amber-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {topic.category}
                                  </span>
                                </TableCell>
                                <TableCell className="max-w-[300px] truncate">
                                  {topic.description || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteTopic(topic.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-4">
            {!selectedAssessment ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No assessment selected.</p>
                  <p className="text-sm">Please select or create an assessment first.</p>
                </CardContent>
              </Card>
            ) : topics.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No topics added yet.</p>
                  <p className="text-sm">Please add topics to this assessment before inviting stakeholders.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Stakeholder Engagement
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {assessments.find(a => a.id === selectedAssessment)?.title}
                    </span>
                  </h2>
                  <Button onClick={() => setShowInviteForm(true)} variant="outline" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Invite Stakeholders
                  </Button>
                </div>
                
                <Dialog open={showInviteForm} onOpenChange={setShowInviteForm}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Invite Stakeholders</DialogTitle>
                      <DialogDescription>
                        Select stakeholders to participate in your materiality assessment
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      {stakeholders.length === 0 ? (
                        <div className="py-4 text-center">
                          <p className="text-muted-foreground">No stakeholders available.</p>
                          <p className="text-sm">
                            Please add stakeholders in the Stakeholders section first.
                          </p>
                        </div>
                      ) : (
                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                          {stakeholders.map((stakeholder) => (
                            <div
                              key={stakeholder.id}
                              className={`flex items-center justify-between p-2 border rounded-md ${
                                selectedStakeholders.includes(stakeholder.id) ? 
                                "border-primary bg-primary/5" : 
                                "hover:bg-muted/50"
                              }`}
                              onClick={() => {
                                if (selectedStakeholders.includes(stakeholder.id)) {
                                  setSelectedStakeholders(prev => 
                                    prev.filter(id => id !== stakeholder.id)
                                  );
                                } else {
                                  setSelectedStakeholders(prev => [...prev, stakeholder.id]);
                                }
                              }}
                            >
                              <div>
                                <p className="font-medium">{stakeholder.name}</p>
                                <p className="text-xs text-muted-foreground">{stakeholder.email}</p>
                                <p className="text-xs">
                                  <span className="px-1.5 py-0.5 rounded-full text-xs bg-muted">
                                    {stakeholder.type}
                                  </span>
                                </p>
                              </div>
                              <div className="h-5 w-5 rounded-sm border flex items-center justify-center">
                                {selectedStakeholders.includes(stakeholder.id) && (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {selectedStakeholders.length} stakeholder(s) selected
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSendInvites}
                          disabled={selectedStakeholders.length === 0 || stakeholders.length === 0}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Invitations
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Card>
                  <CardContent className="p-0">
                    {invites.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No stakeholders invited yet.</p>
                        <p className="text-sm">Invite stakeholders to participate in your assessment.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Stakeholder</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {invites.map((invite) => (
                              <TableRow key={invite.id}>
                                <TableCell className="font-medium">
                                  {invite.stakeholder_name || "Unknown"}
                                </TableCell>
                                <TableCell>{invite.stakeholder_type || "Unknown"}</TableCell>
                                <TableCell>{invite.stakeholder_email || "Unknown"}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    invite.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                    invite.status === 'accepted' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-slate-100 text-slate-800'
                                  }`}>
                                    {invite.status === 'completed' ? 'Completed' : 
                                     invite.status === 'accepted' ? 'Accepted' : 
                                     'Pending'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  {invite.status !== 'completed' && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleResendInvite(invite.id, invite.stakeholder_email || "")}
                                    >
                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  )}
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteInvite(invite.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {!selectedAssessment ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No assessment selected.</p>
                  <p className="text-sm">Please select or create an assessment first.</p>
                </CardContent>
              </Card>
            ) : invites.filter(i => i.status === 'completed').length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No responses collected yet.</p>
                  <p className="text-sm">
                    Results will appear here once stakeholders complete their assessments.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ChartPie className="h-5 w-5 mr-2" />
                        Response Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">
                          Materiality analysis visualization will appear here.
                        </p>
                        <p className="text-sm">
                          This feature will be implemented in a future update.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart4 className="h-5 w-5 mr-2" />
                        Materiality Matrix
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">
                          Materiality matrix will appear here.
                        </p>
                        <p className="text-sm">
                          This feature will be implemented in a future update.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Materiality;
