
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  Plus,
  Edit,
  Trash2,
  Copy,
  FileText,
  LayoutTemplate,
  ListPlus,
  ListChecks,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  title: string;
  description: string | null;
  industry_category: string;
  is_default: boolean;
  created_at: string;
  question_count?: number;
}

interface Question {
  id: string;
  template_id: string;
  question_text: string;
  iso_standard: string | null;
  weightage: number;
  category: string | null;
  sequence_order: number | null;
}

const EHSTemplates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [templateForm, setTemplateForm] = useState({
    id: "",
    title: "",
    description: "",
    industry_category: "Manufacturing",
    is_default: false,
  });
  
  const [questionForm, setQuestionForm] = useState({
    id: "",
    question_text: "",
    iso_standard: "",
    weightage: 1,
    category: "Environmental Planning",
    sequence_order: 0,
  });

  const categories = [
    "Environmental Planning",
    "Environmental Aspects",
    "Legal Requirements",
    "Occupational Health & Safety",
    "Emergency Preparedness",
    "Operational Control",
    "Incident Investigation",
    "Monitoring & Measurement",
    "Management Review"
  ];
  
  const industries = [
    "Manufacturing",
    "Construction",
    "Healthcare",
    "Hospitality",
    "Retail",
    "Energy",
    "Mining",
    "Agriculture",
    "Transportation",
    "Technology",
    "Food & Beverage",
    "Textile",
    "Chemical",
    "Automotive",
    "Pharmaceutical"
  ];

  useEffect(() => {
    if (user?.id && user.role === 'fandoro_admin') {
      fetchTemplates();
    }
  }, [user]);
  
  useEffect(() => {
    if (selectedTemplateId) {
      fetchQuestions(selectedTemplateId);
    } else {
      setQuestions([]);
    }
  }, [selectedTemplateId]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      
      // Fetch templates with question count
      const { data, error } = await supabase
        .from("ehs_checklist_templates")
        .select(`
          *,
          questions:ehs_checklist_questions (count)
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // Format data to include question count
      const templatesWithCount = data?.map(template => ({
        ...template,
        question_count: template.questions[0]?.count || 0
      }));
      
      setTemplates(templatesWithCount || []);
      
      // Select first template by default if available
      if (templatesWithCount && templatesWithCount.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(templatesWithCount[0].id);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error fetching templates",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchQuestions = async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from("ehs_checklist_questions")
        .select("*")
        .eq("template_id", templateId)
        .order("sequence_order", { ascending: true });
        
      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error fetching checklist questions",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleCreateTemplate = async () => {
    try {
      if (!templateForm.title || !templateForm.industry_category) {
        toast({
          title: "Missing information",
          description: "Please provide a title and industry category",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from("ehs_checklist_templates")
        .insert({
          title: templateForm.title,
          description: templateForm.description || null,
          industry_category: templateForm.industry_category,
          is_default: templateForm.is_default,
          created_by: user?.id
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Template created",
        description: "The template has been created successfully",
      });
      
      // Reset form and refresh templates
      resetTemplateForm();
      setTemplateDialogOpen(false);
      
      if (data && data.length > 0) {
        fetchTemplates();
        setSelectedTemplateId(data[0].id);
      }
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error creating template",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateTemplate = async () => {
    try {
      if (!templateForm.id || !templateForm.title || !templateForm.industry_category) {
        toast({
          title: "Missing information",
          description: "Please provide a title and industry category",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from("ehs_checklist_templates")
        .update({
          title: templateForm.title,
          description: templateForm.description || null,
          industry_category: templateForm.industry_category,
          is_default: templateForm.is_default,
          updated_at: new Date().toISOString()
        })
        .eq("id", templateForm.id);
        
      if (error) throw error;
      
      toast({
        title: "Template updated",
        description: "The template has been updated successfully",
      });
      
      // Reset form and refresh templates
      resetTemplateForm();
      setTemplateDialogOpen(false);
      fetchTemplates();
    } catch (error) {
      console.error("Error updating template:", error);
      toast({
        title: "Error updating template",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTemplate = async (id: string) => {
    // Add confirmation dialog in real implementation
    try {
      const { error } = await supabase
        .from("ehs_checklist_templates")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "Template deleted",
        description: "The template has been deleted successfully",
      });
      
      // Reset selected template if it was deleted
      if (selectedTemplateId === id) {
        setSelectedTemplateId(null);
      }
      
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error deleting template",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      // Get original template
      const { data: templateData, error: templateError } = await supabase
        .from("ehs_checklist_templates")
        .select("*")
        .eq("id", templateId)
        .single();
        
      if (templateError) throw templateError;
      
      if (!templateData) {
        toast({
          title: "Error",
          description: "Template not found",
          variant: "destructive",
        });
        return;
      }
      
      // Create new template with same data but different title
      const { data: newTemplate, error: createError } = await supabase
        .from("ehs_checklist_templates")
        .insert({
          title: `${templateData.title} (Copy)`,
          description: templateData.description,
          industry_category: templateData.industry_category,
          is_default: false,
          created_by: user?.id
        })
        .select();
        
      if (createError) throw createError;
      
      if (!newTemplate || newTemplate.length === 0) {
        throw new Error("Failed to create new template");
      }
      
      // Get questions from original template
      const { data: questionsData, error: questionsError } = await supabase
        .from("ehs_checklist_questions")
        .select("*")
        .eq("template_id", templateId);
        
      if (questionsError) throw questionsError;
      
      // Duplicate questions with new template ID
      if (questionsData && questionsData.length > 0) {
        const newQuestions = questionsData.map(q => ({
          template_id: newTemplate[0].id,
          question_text: q.question_text,
          iso_standard: q.iso_standard,
          weightage: q.weightage,
          category: q.category,
          sequence_order: q.sequence_order
        }));
        
        const { error: insertError } = await supabase
          .from("ehs_checklist_questions")
          .insert(newQuestions);
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Template duplicated",
        description: "The template and its questions have been duplicated",
      });
      
      fetchTemplates();
    } catch (error) {
      console.error("Error duplicating template:", error);
      toast({
        title: "Error duplicating template",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleAddQuestion = async () => {
    try {
      if (!selectedTemplateId || !questionForm.question_text) {
        toast({
          title: "Missing information",
          description: "Please provide all required information",
          variant: "destructive",
        });
        return;
      }
      
      // Get next sequence number if not set
      const nextSequence = questionForm.sequence_order || questions.length + 1;
      
      const { data, error } = await supabase
        .from("ehs_checklist_questions")
        .insert({
          template_id: selectedTemplateId,
          question_text: questionForm.question_text,
          iso_standard: questionForm.iso_standard || null,
          weightage: questionForm.weightage,
          category: questionForm.category || null,
          sequence_order: nextSequence
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Question added",
        description: "The checklist question has been added",
      });
      
      // Reset form and refresh questions
      resetQuestionForm();
      setQuestionDialogOpen(false);
      
      if (selectedTemplateId) {
        fetchQuestions(selectedTemplateId);
        fetchTemplates(); // Update template to show new question count
      }
    } catch (error) {
      console.error("Error adding question:", error);
      toast({
        title: "Error adding question",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateQuestion = async () => {
    try {
      if (!selectedTemplateId || !questionForm.id || !questionForm.question_text) {
        toast({
          title: "Missing information",
          description: "Please provide all required information",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from("ehs_checklist_questions")
        .update({
          question_text: questionForm.question_text,
          iso_standard: questionForm.iso_standard || null,
          weightage: questionForm.weightage,
          category: questionForm.category || null,
          sequence_order: questionForm.sequence_order,
          updated_at: new Date().toISOString()
        })
        .eq("id", questionForm.id);
        
      if (error) throw error;
      
      toast({
        title: "Question updated",
        description: "The checklist question has been updated",
      });
      
      // Reset form and refresh questions
      resetQuestionForm();
      setQuestionDialogOpen(false);
      fetchQuestions(selectedTemplateId);
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Error updating question",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ehs_checklist_questions")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "Question deleted",
        description: "The checklist question has been deleted",
      });
      
      if (selectedTemplateId) {
        fetchQuestions(selectedTemplateId);
        fetchTemplates(); // Update template to show new question count
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error deleting question",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const openEditTemplateDialog = (template: Template) => {
    setTemplateForm({
      id: template.id,
      title: template.title,
      description: template.description || "",
      industry_category: template.industry_category,
      is_default: template.is_default
    });
    setIsEditing(true);
    setTemplateDialogOpen(true);
  };
  
  const openNewTemplateDialog = () => {
    resetTemplateForm();
    setIsEditing(false);
    setTemplateDialogOpen(true);
  };
  
  const openEditQuestionDialog = (question: Question) => {
    setQuestionForm({
      id: question.id,
      question_text: question.question_text,
      iso_standard: question.iso_standard || "",
      weightage: question.weightage,
      category: question.category || "Environmental Planning",
      sequence_order: question.sequence_order || 0
    });
    setIsEditing(true);
    setQuestionDialogOpen(true);
  };
  
  const openNewQuestionDialog = () => {
    resetQuestionForm();
    setIsEditing(false);
    setQuestionDialogOpen(true);
  };
  
  const resetTemplateForm = () => {
    setTemplateForm({
      id: "",
      title: "",
      description: "",
      industry_category: "Manufacturing",
      is_default: false
    });
  };
  
  const resetQuestionForm = () => {
    setQuestionForm({
      id: "",
      question_text: "",
      iso_standard: "",
      weightage: 1,
      category: "Environmental Planning",
      sequence_order: 0
    });
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
          <h1 className="text-2xl font-bold tracking-tight">EHS Audit Templates</h1>
          <p className="text-muted-foreground">
            Manage EHS audit checklist templates and questions
          </p>
        </div>

        <Tabs defaultValue="templates">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">EHS Checklist Templates</h2>
              <Button onClick={openNewTemplateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="py-8 text-center">Loading templates...</div>
                ) : templates.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No templates available.</p>
                    <p className="text-sm">Create your first EHS audit template.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template Title</TableHead>
                          <TableHead>Industry</TableHead>
                          <TableHead>Questions</TableHead>
                          <TableHead>Default</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templates.map((template) => (
                          <TableRow 
                            key={template.id} 
                            className={selectedTemplateId === template.id ? "bg-muted/50" : ""}
                          >
                            <TableCell 
                              className="font-medium cursor-pointer"
                              onClick={() => setSelectedTemplateId(template.id)}
                            >
                              {template.title}
                            </TableCell>
                            <TableCell>{template.industry_category}</TableCell>
                            <TableCell>{template.question_count}</TableCell>
                            <TableCell>
                              {template.is_default && (
                                <Badge>Default</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(template.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openEditTemplateDialog(template)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDuplicateTemplate(template.id)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteTemplate(template.id)}
                                disabled={template.is_default}
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
          </TabsContent>
          
          <TabsContent value="questions" className="space-y-4">
            {!selectedTemplateId ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No template selected.</p>
                  <p className="text-sm">Please select a template to manage its questions.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Checklist Questions
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Template: {templates.find(t => t.id === selectedTemplateId)?.title}
                    </p>
                  </div>
                  <Button onClick={openNewQuestionDialog}>
                    <ListPlus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {questions.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No questions in this template.</p>
                        <p className="text-sm">Add questions to build your checklist.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>#</TableHead>
                              <TableHead>Question</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>ISO Standard</TableHead>
                              <TableHead>Weightage</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {questions.map((question, index) => (
                              <TableRow key={question.id}>
                                <TableCell>{question.sequence_order || index + 1}</TableCell>
                                <TableCell className="font-medium max-w-xs truncate">
                                  {question.question_text}
                                </TableCell>
                                <TableCell>{question.category || "-"}</TableCell>
                                <TableCell>{question.iso_standard || "-"}</TableCell>
                                <TableCell>{question.weightage}</TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => openEditQuestionDialog(question)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteQuestion(question.id)}
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
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Template Dialog */}
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Template" : "Create New Template"}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Update the EHS checklist template details" 
                  : "Create a new EHS audit checklist template"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="templateTitle">Template Title</Label>
                <Input
                  id="templateTitle"
                  value={templateForm.title}
                  onChange={(e) => setTemplateForm({...templateForm, title: e.target.value})}
                  placeholder="e.g., ISO 14001 Environmental Checklist"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry Category</Label>
                <Select
                  value={templateForm.industry_category}
                  onValueChange={(value) => setTemplateForm({...templateForm, industry_category: value})}
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="templateDescription">Description</Label>
                <Textarea
                  id="templateDescription"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}
                  placeholder="Describe the purpose and scope of this template..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={templateForm.is_default}
                  onChange={(e) => setTemplateForm({...templateForm, is_default: e.target.checked})}
                />
                <Label htmlFor="isDefault" className="cursor-pointer">
                  Set as default template
                </Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateTemplate : handleCreateTemplate}>
                {isEditing ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Question Dialog */}
        <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Question" : "Add Checklist Question"}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Update the checklist question details" 
                  : "Add a new question to this checklist template"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="questionText">Question Text</Label>
                <Textarea
                  id="questionText"
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({...questionForm, question_text: e.target.value})}
                  placeholder="e.g., Has the organization documented all environmental aspects of its activities?"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={questionForm.category}
                    onValueChange={(value) => setQuestionForm({...questionForm, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isoStandard">ISO Standard Reference</Label>
                  <Input
                    id="isoStandard"
                    value={questionForm.iso_standard}
                    onChange={(e) => setQuestionForm({...questionForm, iso_standard: e.target.value})}
                    placeholder="e.g., ISO 14001:4.3.1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weightage">Weightage (1-10)</Label>
                  <Input
                    id="weightage"
                    type="number"
                    min="1"
                    max="10"
                    value={questionForm.weightage}
                    onChange={(e) => setQuestionForm({
                      ...questionForm, 
                      weightage: Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sequence">Sequence Order</Label>
                  <Input
                    id="sequence"
                    type="number"
                    min="1"
                    value={questionForm.sequence_order || ''}
                    onChange={(e) => setQuestionForm({
                      ...questionForm, 
                      sequence_order: parseInt(e.target.value) || 0
                    })}
                    placeholder="Leave blank for auto-sequence"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setQuestionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateQuestion : handleAddQuestion}>
                {isEditing ? "Update Question" : "Add Question"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default EHSTemplates;
