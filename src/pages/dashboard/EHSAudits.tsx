
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ClipboardCheck, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  User,
  Info,
  FileQuestion,
} from "lucide-react";

interface EHSAudit {
  id: string;
  enterprise_id: string;
  auditor_id: string | null;
  template_id: string | null;
  status: string;
  audit_date: string | null;
  completion_date: string | null;
  total_score: number | null;
  max_score: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  template?: {
    title: string;
    industry_category: string;
  };
  auditor?: {
    name: string;
    email: string;
  };
}

interface AuditQuestion {
  id: string;
  question_text: string;
  category: string;
  iso_standard: string | null;
  weightage: number;
  response?: {
    id: string;
    response: string;
    score: number | null;
    non_conformance_description: string | null;
    action_required: string | null;
    action_deadline: string | null;
    action_taken: string | null;
    action_status: string | null;
    action_status_date: string | null;
    updated_by: string | null;
  };
}

interface CategoryQuestions {
  [category: string]: AuditQuestion[];
}

const EHSAudits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [audits, setAudits] = useState<EHSAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);
  const [auditQuestions, setAuditQuestions] = useState<CategoryQuestions>({});
  const [selectedQuestion, setSelectedQuestion] = useState<AuditQuestion | null>(null);
  const [actionResponse, setActionResponse] = useState({
    action_taken: "",
    action_status: "in_progress", // or closed
  });
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchAudits();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedAudit) {
      fetchAuditQuestions(selectedAudit);
    }
  }, [selectedAudit]);

  const fetchAudits = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("enterprise_ehs_audits")
        .select(`
          *,
          template:template_id (
            title,
            industry_category
          ),
          auditor:auditor_id (
            name:email, 
            email
          )
        `)
        .eq("enterprise_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAudits(data || []);
      
      if (data && data.length > 0 && !selectedAudit) {
        setSelectedAudit(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching audits:", error);
      toast({
        title: "Error",
        description: "Failed to load audits. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditQuestions = async (auditId: string) => {
    try {
      const { data, error } = await supabase
        .from("ehs_checklist_questions")
        .select(`
          *,
          response:enterprise_audit_responses!inner (
            id,
            response,
            score,
            non_conformance_description,
            action_required,
            action_deadline,
            action_taken,
            action_status,
            action_status_date,
            updated_by
          )
        `)
        .eq("response.audit_id", auditId);

      if (error) throw error;

      // Organize questions by category
      const questionsByCategory: CategoryQuestions = {};
      
      if (data) {
        data.forEach(item => {
          const category = item.category || 'Uncategorized';
          
          if (!questionsByCategory[category]) {
            questionsByCategory[category] = [];
          }
          
          questionsByCategory[category].push({
            id: item.id,
            question_text: item.question_text,
            category: item.category,
            iso_standard: item.iso_standard,
            weightage: item.weightage,
            response: item.response.length > 0 ? item.response[0] : undefined
          });
        });
      }
      
      setAuditQuestions(questionsByCategory);
    } catch (error) {
      console.error("Error fetching audit questions:", error);
      toast({
        title: "Error",
        description: "Failed to load audit details. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAction = async () => {
    if (!selectedQuestion?.response?.id) {
      toast({
        title: "Error",
        description: "No response selected for update",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("enterprise_audit_responses")
        .update({
          action_taken: actionResponse.action_taken,
          action_status: actionResponse.action_status,
          action_status_date: new Date().toISOString(),
          updated_by: user?.id
        })
        .eq("id", selectedQuestion.response.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Action response updated successfully",
      });

      // Update local state
      if (selectedAudit) {
        fetchAuditQuestions(selectedAudit);
      }

      setActionDialogOpen(false);
    } catch (error) {
      console.error("Error updating action response:", error);
      toast({
        title: "Error",
        description: "Failed to update action. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openActionDialog = (question: AuditQuestion) => {
    setSelectedQuestion(question);
    setActionResponse({
      action_taken: question.response?.action_taken || "",
      action_status: question.response?.action_status as "in_progress" | "closed" || "in_progress",
    });
    setActionDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return <Badge variant="outline">Planned</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100/80">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100/80">Completed</Badge>;
      case "reviewed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Reviewed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getResponseBadge = (response: string) => {
    switch (response) {
      case "compliant":
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
            <span>Compliant</span>
          </div>
        );
      case "non_compliant":
        return (
          <div className="flex items-center">
            <XCircle className="h-4 w-4 mr-1 text-red-600" />
            <span>Non-compliant</span>
          </div>
        );
      case "partial":
        return (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-1 text-amber-600" />
            <span>Partial</span>
          </div>
        );
      default:
        return <span>{response}</span>;
    }
  };

  const getActionStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    switch (status) {
      case "open":
        return <Badge variant="outline">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100/80">In Progress</Badge>;
      case "closed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateAuditScore = (audit: EHSAudit) => {
    if (audit.total_score === null || audit.max_score === null || audit.max_score === 0) {
      return "N/A";
    }
    
    const percentage = (audit.total_score / audit.max_score) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EHS Audits</h1>
          <p className="text-muted-foreground">
            Manage and respond to your environmental health & safety audits
          </p>
        </div>

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">Audit List</TabsTrigger>
            <TabsTrigger value="detail">Audit Detail</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Your EHS Audits</CardTitle>
                <CardDescription>
                  View and manage audits conducted by assigned EHS auditors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center">Loading audits...</div>
                ) : audits.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No audits available.</p>
                    <p className="text-sm">
                      Audits will appear here once they are scheduled by an EHS auditor.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Audit Template</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Auditor</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {audits.map((audit) => (
                          <TableRow key={audit.id}>
                            <TableCell className="font-medium">
                              {audit.template?.title || "Unknown Template"}
                            </TableCell>
                            <TableCell>{getStatusBadge(audit.status)}</TableCell>
                            <TableCell>
                              {audit.audit_date 
                                ? new Date(audit.audit_date).toLocaleDateString() 
                                : "Not scheduled"}
                            </TableCell>
                            <TableCell>{audit.auditor?.name || "Not assigned"}</TableCell>
                            <TableCell>{calculateAuditScore(audit)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedAudit(audit.id)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View
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
          </TabsContent>
          
          <TabsContent value="detail">
            {!selectedAudit ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No audit selected.</p>
                  <p className="text-sm">Please select an audit from the list to view its details.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {audits.find(a => a.id === selectedAudit) && (
                  <Card className="mb-6">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>
                            {audits.find(a => a.id === selectedAudit)?.template?.title || "Audit"}
                          </CardTitle>
                          <CardDescription>
                            {audits.find(a => a.id === selectedAudit)?.template?.industry_category || "Unknown category"}
                          </CardDescription>
                        </div>
                        <div>
                          {getStatusBadge(audits.find(a => a.id === selectedAudit)?.status || 'planned')}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Audit Date</span>
                          </div>
                          <p className="font-medium">
                            {audits.find(a => a.id === selectedAudit)?.audit_date 
                              ? new Date(audits.find(a => a.id === selectedAudit)?.audit_date as string).toLocaleDateString() 
                              : "Not scheduled"}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-1" />
                            <span>Auditor</span>
                          </div>
                          <p className="font-medium">
                            {audits.find(a => a.id === selectedAudit)?.auditor?.name || "Not assigned"}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ClipboardCheck className="h-4 w-4 mr-1" />
                            <span>Score</span>
                          </div>
                          <p className="font-medium">
                            {calculateAuditScore(audits.find(a => a.id === selectedAudit) as EHSAudit)}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Info className="h-4 w-4 mr-1" />
                            <span>Completion Date</span>
                          </div>
                          <p className="font-medium">
                            {audits.find(a => a.id === selectedAudit)?.completion_date 
                              ? new Date(audits.find(a => a.id === selectedAudit)?.completion_date as string).toLocaleDateString() 
                              : "Not completed"}
                          </p>
                        </div>
                      </div>
                      
                      {audits.find(a => a.id === selectedAudit)?.notes && (
                        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                          <div className="font-medium mb-1">Auditor Notes:</div>
                          {audits.find(a => a.id === selectedAudit)?.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                <div className="mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FileQuestion className="h-5 w-5 mr-2" />
                    Audit Checklist & Non-Conformances
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Review findings and provide responses to required actions
                  </p>
                </div>
                
                {Object.keys(auditQuestions).length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">No checklist data available.</p>
                      <p className="text-sm">
                        The audit checklist will appear once the auditor has started the assessment.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {Object.keys(auditQuestions).map((category) => (
                        <AccordionItem key={category} value={category}>
                          <AccordionTrigger className="font-medium">
                            {category} ({auditQuestions[category].length} items)
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              {auditQuestions[category].map((question) => (
                                <Card key={question.id} className={
                                  question.response?.response === 'non_compliant' 
                                    ? 'border-red-200 bg-red-50/50' 
                                    : question.response?.response === 'partial'
                                    ? 'border-amber-200 bg-amber-50/50'
                                    : ''
                                }>
                                  <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start gap-4">
                                      <h3 className="font-medium">
                                        {question.question_text}
                                      </h3>
                                      {question.response && (
                                        <div>
                                          {getResponseBadge(question.response.response)}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center text-xs text-muted-foreground gap-4">
                                      {question.iso_standard && (
                                        <div className="px-2 py-1 bg-muted rounded">
                                          {question.iso_standard}
                                        </div>
                                      )}
                                      <div>
                                        Weightage: {question.weightage}
                                      </div>
                                    </div>
                                    
                                    {(question.response?.response === 'non_compliant' || 
                                       question.response?.response === 'partial') && 
                                     question.response?.non_conformance_description && (
                                      <div className="bg-background p-3 rounded-md border">
                                        <div className="font-medium text-sm">Non-Conformance:</div>
                                        <p className="text-sm mt-1">
                                          {question.response.non_conformance_description}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {question.response?.action_required && (
                                      <div className="mt-2 space-y-2">
                                        <div className="bg-background p-3 rounded-md border space-y-2">
                                          <div className="font-medium text-sm">Required Action:</div>
                                          <p className="text-sm">
                                            {question.response.action_required}
                                          </p>
                                          
                                          {question.response.action_deadline && (
                                            <div className="flex items-center text-xs text-muted-foreground">
                                              <Calendar className="h-3 w-3 mr-1" />
                                              <span>
                                                Due by: {new Date(question.response.action_deadline).toLocaleDateString()}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                          <div className="text-sm">
                                            Status: {getActionStatusBadge(question.response.action_status)}
                                          </div>
                                          
                                          <Button
                                            size="sm"
                                            onClick={() => openActionDialog(question)}
                                            disabled={question.response?.action_status === 'closed'}
                                          >
                                            {question.response?.action_taken
                                              ? "Update Response"
                                              : "Add Response"}
                                          </Button>
                                        </div>
                                        
                                        {question.response?.action_taken && (
                                          <div className="bg-muted/50 p-3 rounded-md">
                                            <div className="font-medium text-sm">Your Response:</div>
                                            <p className="text-sm mt-1">
                                              {question.response.action_taken}
                                            </p>
                                            
                                            {question.response.action_status_date && (
                                              <div className="text-xs text-muted-foreground mt-1">
                                                Updated: {new Date(question.response.action_status_date).toLocaleString()}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Action Response</DialogTitle>
              <DialogDescription>
                Provide details about the corrective action you've taken.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="actionTaken">Action Taken</Label>
                <Textarea
                  id="actionTaken"
                  value={actionResponse.action_taken}
                  onChange={(e) => setActionResponse({
                    ...actionResponse,
                    action_taken: e.target.value
                  })}
                  placeholder="Describe the corrective action you've implemented..."
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Action Status</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={actionResponse.action_status === 'in_progress' ? 'default' : 'outline'}
                    onClick={() => setActionResponse({
                      ...actionResponse,
                      action_status: 'in_progress'
                    })}
                    className="flex-1"
                  >
                    In Progress
                  </Button>
                  <Button
                    type="button"
                    variant={actionResponse.action_status === 'closed' ? 'default' : 'outline'}
                    onClick={() => setActionResponse({
                      ...actionResponse,
                      action_status: 'closed'
                    })}
                    className="flex-1"
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAction}>
                Save Response
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default EHSAudits;
