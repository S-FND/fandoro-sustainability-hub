import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, UserCheck, User, Trash2, Mail, CheckCircle2 } from "lucide-react";

interface Enterprise {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Auditor {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Assignment {
  id: string;
  enterprise_id: string;
  enterprise_name?: string;
  enterprise_email?: string;
  auditor_id: string;
  auditor_name?: string;
  auditor_email?: string;
  assigned_at: string;
  assigned_by: string;
  status: string;
}

const AuditorAssignment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newAuditorEmail, setNewAuditorEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<string | null>(null);
  const [selectedAuditor, setSelectedAuditor] = useState<string | null>(null);
  
  useEffect(() => {
    if (user?.id && user.role === 'fandoro_admin') {
      fetchData();
    }
  }, [user]);
  
  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchEnterprises(),
      fetchAuditors(),
      fetchAssignments()
    ]);
    setLoading(false);
  };
  
  const fetchEnterprises = async () => {
    try {
      const mockEnterprises: Enterprise[] = [
        { id: 'e1', name: 'Enterprise 1', email: 'enterprise1@example.com', role: 'enterprise' },
        { id: 'e2', name: 'Enterprise 2', email: 'enterprise2@example.com', role: 'enterprise' },
        { id: 'e3', name: 'Enterprise 3', email: 'enterprise3@example.com', role: 'enterprise' }
      ];
      
      setEnterprises(mockEnterprises);
    } catch (error) {
      console.error("Error fetching enterprises:", error);
      toast({
        title: "Error fetching enterprises",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const fetchAuditors = async () => {
    try {
      const { data, error } = await supabase
        .from('ehs_auditors')
        .select('id, name, email');

      if (error) throw error;
      
      setAuditors(data.map(auditor => ({
        id: auditor.id,
        name: auditor.name,
        email: auditor.email,
        role: 'auditor'
      })) || []);
    } catch (error) {
      console.error("Error fetching auditors:", error);
      toast({
        title: "Error fetching auditors",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from("enterprise_auditor_assignments")
        .select("*");
        
      if (error) throw error;
      
      const enhancedAssignments = (data || []).map(assignment => {
        const enterprise = enterprises.find(e => e.id === assignment.enterprise_id);
        const auditor = auditors.find(a => a.id === assignment.auditor_id);
        
        return {
          ...assignment,
          enterprise_name: enterprise?.name,
          enterprise_email: enterprise?.email,
          auditor_name: auditor?.name,
          auditor_email: auditor?.email
        };
      });
      
      setAssignments(enhancedAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({
        title: "Error fetching assignments",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleInviteAuditor = async () => {
    if (!newAuditorEmail || !newAuditorEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('ehs_auditors')
        .insert({
          id: `temp-${Date.now()}`,
          name: newAuditorEmail.split('@')[0],
          email: newAuditorEmail
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Auditor invited",
        description: `An invitation has been sent to ${newAuditorEmail}`,
      });
      
      if (data) {
        setAuditors([...auditors, {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          role: 'auditor'
        }]);
      }
      
      setNewAuditorEmail("");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error inviting auditor:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };
  
  const handleCreateAssignment = async () => {
    if (!selectedEnterprise || !selectedAuditor) {
      toast({
        title: "Missing selection",
        description: "Please select both an enterprise and an auditor",
        variant: "destructive",
      });
      return;
    }
    
    const existingAssignment = assignments.find(
      a => a.enterprise_id === selectedEnterprise && a.auditor_id === selectedAuditor
    );
    
    if (existingAssignment) {
      toast({
        title: "Assignment exists",
        description: "This auditor is already assigned to this enterprise",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newAssignment = {
        enterprise_id: selectedEnterprise,
        auditor_id: selectedAuditor,
        assigned_by: user?.id || "",
        status: "pending"
      };
      
      const { data, error } = await supabase
        .from("enterprise_auditor_assignments")
        .insert(newAssignment)
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Assignment created",
        description: "The auditor has been assigned to the enterprise",
      });
      
      if (data && data.length > 0) {
        const enterprise = enterprises.find(e => e.id === selectedEnterprise);
        const auditor = auditors.find(a => a.id === selectedAuditor);
        
        const enhancedAssignment: Assignment = {
          ...data[0],
          enterprise_name: enterprise?.name,
          enterprise_email: enterprise?.email,
          auditor_name: auditor?.name,
          auditor_email: auditor?.email,
        };
        
        setAssignments([...assignments, enhancedAssignment]);
      }
      
      setSelectedEnterprise(null);
      setSelectedAuditor(null);
      setAssignDialogOpen(false);
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Error creating assignment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteAssignment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("enterprise_auditor_assignments")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setAssignments(assignments.filter(a => a.id !== id));
      
      toast({
        title: "Assignment removed",
        description: "The auditor assignment has been removed",
      });
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast({
        title: "Error removing assignment",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Accepted</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user || user.role !== 'fandoro_admin') {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="mt-2">You don't have permission to access this page.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auditor Assignment</h1>
          <p className="text-muted-foreground">
            Manage EHS auditors and assign them to enterprises
          </p>
        </div>

        <Tabs defaultValue="assignments">
          <TabsList>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="auditors">Auditors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assignments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Enterprise-Auditor Assignments</h2>
              <Button onClick={() => setAssignDialogOpen(true)}>
                <UserCheck className="h-4 w-4 mr-2" />
                Assign Auditor
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="py-8 text-center">Loading assignments...</div>
                ) : assignments.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No assignments created yet.</p>
                    <p className="text-sm">
                      Assign auditors to enterprises to begin the auditing process.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Enterprise</TableHead>
                          <TableHead>Auditor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Assigned Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{assignment.enterprise_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {assignment.enterprise_email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{assignment.auditor_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {assignment.auditor_email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                            <TableCell>
                              {new Date(assignment.assigned_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  toast({
                                    title: "Reminder sent",
                                    description: `A reminder has been sent to ${assignment.auditor_name}`
                                  });
                                }}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAssignment(assignment.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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
            
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Auditor to Enterprise</DialogTitle>
                  <DialogDescription>
                    Select the enterprise and auditor to create an assignment
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="enterprise">Enterprise</Label>
                    <select
                      id="enterprise"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedEnterprise || ""}
                      onChange={(e) => setSelectedEnterprise(e.target.value)}
                    >
                      <option value="">Select an enterprise</option>
                      {enterprises.map((enterprise) => (
                        <option key={enterprise.id} value={enterprise.id}>
                          {enterprise.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="auditor">Auditor</Label>
                    <select
                      id="auditor"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedAuditor || ""}
                      onChange={(e) => setSelectedAuditor(e.target.value)}
                    >
                      <option value="">Select an auditor</option>
                      {auditors.map((auditor) => (
                        <option key={auditor.id} value={auditor.id}>
                          {auditor.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAssignment}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="auditors" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">EHS Auditors</h2>
              <Button onClick={() => setDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Auditor
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="py-8 text-center">Loading auditors...</div>
                ) : auditors.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No auditors available.</p>
                    <p className="text-sm">Invite EHS auditors to join the platform.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Auditor</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditors.map((auditor) => (
                          <TableRow key={auditor.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{auditor.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{auditor.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                <span>Active</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  toast({
                                    title: "Email sent",
                                    description: `An email has been sent to ${auditor.email}`
                                  });
                                }}
                              >
                                <Mail className="h-4 w-4" />
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
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite EHS Auditor</DialogTitle>
                  <DialogDescription>
                    Send an invitation to an EHS auditor to join the platform
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="auditor@example.com"
                      value={newAuditorEmail}
                      onChange={(e) => setNewAuditorEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteAuditor}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AuditorAssignment;
