
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  ClipboardCheck, 
  AlertCircle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface EHSAudit {
  id: string;
  status: string;
  audit_date: string;
  completion_date: string | null;
  total_score: number | null;
  max_score: number | null;
  template: {
    id: string;
    title: string;
    description: string;
  };
  auditor: {
    name: string;
    email: string;
  } | null;
}

interface ChecklistQuestion {
  id: string;
  question_id: string; // Added this field to fix the error
  question_text: string;
  category: string;
  iso_standard: string;
  weightage: number;
}

interface AuditResponse {
  id: string;
  question_id: string;
  response: string;
  score: number | null;
  non_conformance_description: string | null;
  action_required: string | null;
  action_deadline: string | null;
  action_taken: string | null;
  action_status: string;
}

const EHSAudits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [audits, setAudits] = useState<EHSAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<EHSAudit | null>(null);
  const [auditQuestions, setAuditQuestions] = useState<ChecklistQuestion[]>([]);
  const [auditResponses, setAuditResponses] = useState<AuditResponse[]>([]);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      fetchAudits();
    }
  }, [user]);
  
  const fetchAudits = async () => {
    setLoading(true);
    try {
      // Using mock data instead of actual API calls
      const mockAudits: EHSAudit[] = [
        {
          id: "a1",
          status: "completed",
          audit_date: "2025-03-15",
          completion_date: "2025-03-20",
          total_score: 85,
          max_score: 100,
          template: {
            id: "t1",
            title: "ISO 14001 Environmental Management Audit",
            description: "Comprehensive environmental management system assessment based on ISO 14001 standards"
          },
          auditor: {
            name: "John Auditor",
            email: "john.auditor@example.com"
          }
        },
        {
          id: "a2",
          status: "in_progress",
          audit_date: "2025-04-05",
          completion_date: null,
          total_score: null,
          max_score: null,
          template: {
            id: "t2",
            title: "ISO 45001 Occupational Health & Safety Audit",
            description: "Assessment of occupational health and safety management systems based on ISO 45001"
          },
          auditor: {
            name: "Sarah Expert",
            email: "sarah.expert@example.com"
          }
        },
        {
          id: "a3",
          status: "planned",
          audit_date: "2025-05-10",
          completion_date: null,
          total_score: null,
          max_score: null,
          template: {
            id: "t3",
            title: "Combined EHS Compliance Audit",
            description: "Integrated audit covering both environmental and occupational safety aspects"
          },
          auditor: null
        }
      ];
      
      setAudits(mockAudits);
    } catch (error) {
      console.error("Error fetching audits:", error);
      toast({
        title: "Failed to load audits",
        description: "There was a problem loading your EHS audits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAuditDetails = async (audit: EHSAudit) => {
    setSelectedAudit(audit);
    setViewDetailsOpen(true);
    
    try {
      // Mock questions for the selected audit
      const mockQuestions: ChecklistQuestion[] = [
        {
          id: "q1",
          question_id: "q1", // Added to fix the error
          question_text: "Has the organization identified and documented all environmental aspects of its activities?",
          category: "Environmental Planning",
          iso_standard: "ISO 14001:4.3.1",
          weightage: 3
        },
        {
          id: "q2",
          question_id: "q2", // Added to fix the error
          question_text: "Does the organization have a process to identify and access legal requirements?",
          category: "Environmental Planning",
          iso_standard: "ISO 14001:4.3.2",
          weightage: 2.5
        },
        {
          id: "q3",
          question_id: "q3", // Added to fix the error
          question_text: "Has the organization established environmental objectives and targets?",
          category: "Environmental Planning",
          iso_standard: "ISO 14001:4.3.3",
          weightage: 2
        },
        {
          id: "q4",
          question_id: "q4", // Added to fix the error
          question_text: "Has the organization identified and documented OHS hazards?",
          category: "Occupational Health & Safety",
          iso_standard: "ISO 45001:6.1.2",
          weightage: 3
        },
        {
          id: "q5",
          question_id: "q5", // Added to fix the error
          question_text: "Are emergency preparedness procedures documented and tested?",
          category: "Emergency Preparedness",
          iso_standard: "ISO 45001:8.2",
          weightage: 3
        }
      ];
      
      // Mock responses for the selected audit
      const mockResponses: AuditResponse[] = [];
      
      // Only add responses for completed audits
      if (audit.status === "completed") {
        mockResponses.push(
          {
            id: "r1",
            question_id: "q1",
            response: "compliant",
            score: 3,
            non_conformance_description: null,
            action_required: null,
            action_deadline: null,
            action_taken: null,
            action_status: "closed"
          },
          {
            id: "r2",
            question_id: "q2",
            response: "compliant",
            score: 2.5,
            non_conformance_description: null,
            action_required: null,
            action_deadline: null,
            action_taken: null,
            action_status: "closed"
          },
          {
            id: "r3",
            question_id: "q3",
            response: "partial",
            score: 1,
            non_conformance_description: "Environmental targets are not clearly defined for all departments",
            action_required: "Define specific environmental targets for each department",
            action_deadline: "2025-05-15",
            action_taken: "Started working on department-specific targets",
            action_status: "in_progress"
          },
          {
            id: "r4",
            question_id: "q4",
            response: "non_compliant",
            score: 0,
            non_conformance_description: "No formal documentation of workplace hazards",
            action_required: "Implement hazard identification and documentation process",
            action_deadline: "2025-04-30",
            action_taken: null,
            action_status: "open"
          },
          {
            id: "r5",
            question_id: "q5",
            response: "compliant",
            score: 3,
            non_conformance_description: null,
            action_required: null,
            action_deadline: null,
            action_taken: null,
            action_status: "closed"
          }
        );
      }
      
      setAuditQuestions(mockQuestions);
      setAuditResponses(mockResponses);
      
    } catch (error) {
      console.error("Error fetching audit details:", error);
      toast({
        title: "Error loading audit details",
        description: "There was a problem retrieving the audit information",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return <Badge variant="outline">Planned</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Completed</Badge>;
      case "reviewed":
        return <Badge variant="default">Reviewed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const getResponseBadge = (response: string) => {
    switch (response) {
      case "compliant":
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case "non_compliant":
        return <Badge variant="destructive">Non-Compliant</Badge>;
      case "partial":
        return <Badge variant="secondary">Partial</Badge>;
      case "not_applicable":
        return <Badge variant="outline">N/A</Badge>;
      default:
        return <Badge variant="secondary">{response}</Badge>;
    }
  };
  
  const getActionStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Open</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "closed":
        return <Badge className="bg-green-100 text-green-800">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const handleUpdateActionTaken = async (responseId: string, actionTaken: string, actionStatus: string) => {
    try {
      const { error } = await supabase
        .from("enterprise_audit_responses")
        .update({ 
          action_taken: actionTaken,
          action_status: actionStatus,
          action_status_date: new Date().toISOString()
        })
        .eq("id", responseId);
        
      if (error) throw error;
      
      // Update local state
      setAuditResponses(auditResponses.map(response => 
        response.id === responseId 
          ? { ...response, action_taken: actionTaken, action_status: actionStatus } 
          : response
      ));
      
      toast({
        title: "Action updated",
        description: "Your response has been recorded",
      });
    } catch (error) {
      console.error("Error updating action:", error);
      toast({
        title: "Failed to update",
        description: "There was a problem saving your response",
        variant: "destructive",
      });
    }
  };

  // Calculate compliance status
  const calculateComplianceStatus = (audit: EHSAudit) => {
    if (!audit.total_score || !audit.max_score) return "N/A";
    
    const compliancePercentage = (audit.total_score / audit.max_score) * 100;
    if (compliancePercentage >= 90) return "High";
    if (compliancePercentage >= 75) return "Medium";
    return "Low";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">EHS Audits</h1>
            <p className="text-muted-foreground">
              View and manage your Environmental, Health, and Safety audits
            </p>
          </div>
          <Button>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Request New Audit
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading audits...</p>
          </div>
        ) : audits.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Audits Found</CardTitle>
              <CardDescription>
                You don't have any EHS audits scheduled or completed yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <p className="text-center text-muted-foreground">
                  Request a new EHS audit to assess your compliance with environmental, health, and safety standards.
                </p>
                <Button>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Request New Audit
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {audits.map((audit) => (
              <Card key={audit.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{audit.template?.title || "EHS Audit"}</CardTitle>
                    {getStatusBadge(audit.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {audit.template?.description || "Environmental, Health, and Safety audit"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {audit.audit_date 
                          ? format(new Date(audit.audit_date), "PPP") 
                          : "Date not set"}
                      </span>
                    </div>
                    
                    {audit.auditor && (
                      <div className="flex items-center text-sm">
                        <ClipboardCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Auditor: {audit.auditor.name}</span>
                      </div>
                    )}
                    
                    {audit.status === "completed" && (
                      <div className="flex items-center text-sm">
                        <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          Compliance: {calculateComplianceStatus(audit)}
                          {audit.total_score !== null && audit.max_score !== null && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({audit.total_score}/{audit.max_score})
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    
                    {audit.completion_date && (
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          Completed: {format(new Date(audit.completion_date), "PPP")}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => fetchAuditDetails(audit)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Audit Details Dialog */}
        <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedAudit && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedAudit.template?.title || "EHS Audit Details"}</DialogTitle>
                  <DialogDescription>
                    {selectedAudit.template?.description || "Environmental, Health, and Safety audit details"}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Status</p>
                    <div>{getStatusBadge(selectedAudit.status)}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Audit Date</p>
                    <p className="text-sm">
                      {selectedAudit.audit_date 
                        ? format(new Date(selectedAudit.audit_date), "PPP") 
                        : "Not scheduled"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Auditor</p>
                    <p className="text-sm">
                      {selectedAudit.auditor?.name || "Not assigned"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Completion Date</p>
                    <p className="text-sm">
                      {selectedAudit.completion_date 
                        ? format(new Date(selectedAudit.completion_date), "PPP") 
                        : "Not completed"}
                    </p>
                  </div>
                  
                  {selectedAudit.status === "completed" && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Score</p>
                        <p className="text-sm">
                          {selectedAudit.total_score !== null && selectedAudit.max_score !== null
                            ? `${selectedAudit.total_score}/${selectedAudit.max_score}`
                            : "Not scored"}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Compliance Level</p>
                        <p className="text-sm">
                          {calculateComplianceStatus(selectedAudit)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Audit Checklist</h3>
                  
                  {auditQuestions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No checklist items available</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Question</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Response</TableHead>
                          <TableHead>Action Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditQuestions.map((question) => {
                          const response = auditResponses.find(r => r.question_id === question.id);
                          
                          return (
                            <TableRow key={question.id}>
                              <TableCell className="font-medium">
                                {question.question_text}
                                <div className="text-xs text-muted-foreground mt-1">
                                  {question.iso_standard}
                                </div>
                              </TableCell>
                              <TableCell>{question.category}</TableCell>
                              <TableCell>
                                {response 
                                  ? getResponseBadge(response.response)
                                  : <Badge variant="outline">Not Assessed</Badge>}
                              </TableCell>
                              <TableCell>
                                {response && response.response === "non_compliant" ? (
                                  <div className="space-y-1">
                                    {getActionStatusBadge(response.action_status || "open")}
                                    {response.action_required && (
                                      <div className="text-xs mt-1">
                                        <span className="font-medium">Required: </span>
                                        {response.action_required}
                                      </div>
                                    )}
                                    {response.action_deadline && (
                                      <div className="text-xs">
                                        <span className="font-medium">Deadline: </span>
                                        {format(new Date(response.action_deadline), "PPP")}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
                
                {selectedAudit.status === "completed" && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Non-Conformances & Actions</h3>
                    
                    {auditResponses.filter(r => r.response === "non_compliant").length === 0 ? (
                      <p className="text-sm text-muted-foreground">No non-conformances found</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Finding</TableHead>
                            <TableHead>Required Action</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action Taken</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {auditResponses
                            .filter(r => r.response === "non_compliant")
                            .map((response) => {
                              const question = auditQuestions.find(q => q.question_id === response.question_id);
                              
                              return (
                                <TableRow key={response.id}>
                                  <TableCell>
                                    {question?.question_text || "Unknown question"}
                                    {response.non_conformance_description && (
                                      <div className="text-xs mt-1">
                                        {response.non_conformance_description}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>{response.action_required || "No action specified"}</TableCell>
                                  <TableCell>
                                    {response.action_deadline 
                                      ? format(new Date(response.action_deadline), "PPP")
                                      : "No deadline"}
                                  </TableCell>
                                  <TableCell>{getActionStatusBadge(response.action_status || "open")}</TableCell>
                                  <TableCell>
                                    {response.action_taken || (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          // In a real app, this would open a dialog to update the action
                                          const actionTaken = prompt("Enter the action taken:");
                                          if (actionTaken) {
                                            handleUpdateActionTaken(response.id, actionTaken, "closed");
                                          }
                                        }}
                                      >
                                        Add Response
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
                    Close
                  </Button>
                  {selectedAudit.status === "completed" && (
                    <Button>
                      Download Report
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default EHSAudits;
