
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, Save, ListChecks, Pencil } from "lucide-react";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChecklistTemplate {
  id: string;
  title: string;
  description: string;
  industry_category: string;
  is_default: boolean;
}

interface ChecklistQuestion {
  id: string;
  question_text: string;
  category: string;
  iso_standard: string;
  weightage: number;
  template_id: string;
  sequence_order: number;
}

const categories = [
  "Environmental Planning",
  "Occupational Health & Safety",
  "Operational Control",
  "Emergency Preparedness",
  "Incident Investigation",
  "Management Review"
];

const industries = [
  "Manufacturing",
  "Construction",
  "Healthcare",
  "Food Processing",
  "Energy",
  "Technology",
  "Transportation",
  "Agriculture",
  "Retail",
  "Finance"
];

const EHSChecklist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [questions, setQuestions] = useState<ChecklistQuestion[]>([]);
  const [newTemplate, setNewTemplate] = useState<Partial<ChecklistTemplate>>({
    title: "",
    description: "",
    industry_category: "Manufacturing",
    is_default: false,
  });
  const [newQuestion, setNewQuestion] = useState<Partial<ChecklistQuestion>>({
    question_text: "",
    category: "Environmental Planning",
    iso_standard: "",
    weightage: 1,
    sequence_order: 1,
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<ChecklistQuestion | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user?.role === 'fandoro_admin') {
      fetchTemplates();
    }
  }, [user]);
  
  useEffect(() => {
    if (selectedTemplateId) {
      fetchQuestions(selectedTemplateId);
    }
  }, [selectedTemplateId]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ehs_checklist_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTemplates(data || []);
      
      // Select the first template by default if available
      if (data && data.length > 0) {
        setSelectedTemplateId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchQuestions = async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from('ehs_checklist_questions')
        .select('*')
        .eq('template_id', templateId)
        .order('sequence_order', { ascending: true });
      
      if (error) throw error;
      
      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    }
  };
  
  const handleCreateTemplate = async () => {
    try {
      if (!newTemplate.title || !newTemplate.industry_category) {
        toast({
          title: "Missing information",
          description: "Please provide a title and industry category",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('ehs_checklist_templates')
        .insert({
          title: newTemplate.title,
          description: newTemplate.description || "",
          industry_category: newTemplate.industry_category,
          is_default: newTemplate.is_default || false,
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Template created successfully",
      });
      
      setTemplates([...(data || []), ...templates]);
      setSelectedTemplateId(data?.[0]?.id || null);
      setIsTemplateDialogOpen(false);
      setNewTemplate({
        title: "",
        description: "",
        industry_category: "Manufacturing",
        is_default: false,
      });
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveQuestion = async () => {
    try {
      if (!selectedTemplateId) {
        toast({
          title: "No template selected",
          description: "Please select a template first",
          variant: "destructive",
        });
        return;
      }
      
      if (!newQuestion.question_text) {
        toast({
          title: "Missing information",
          description: "Please provide a question text",
          variant: "destructive",
        });
        return;
      }
      
      if (editingQuestion) {
        const { error } = await supabase
          .from('ehs_checklist_questions')
          .update({
            question_text: newQuestion.question_text,
            category: newQuestion.category,
            iso_standard: newQuestion.iso_standard,
            weightage: newQuestion.weightage,
            sequence_order: newQuestion.sequence_order,
          })
          .eq('id', editingQuestion.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Question updated successfully",
        });
        
        setQuestions(questions.map(q => 
          q.id === editingQuestion.id ? {...q, ...newQuestion} : q
        ));
      } else {
        const { data, error } = await supabase
          .from('ehs_checklist_questions')
          .insert({
            template_id: selectedTemplateId,
            question_text: newQuestion.question_text,
            category: newQuestion.category,
            iso_standard: newQuestion.iso_standard,
            weightage: newQuestion.weightage,
            sequence_order: newQuestion.sequence_order || questions.length + 1,
          })
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Question added successfully",
        });
        
        setQuestions([...questions, ...(data || [])]);
      }
      
      setIsQuestionDialogOpen(false);
      setEditingQuestion(null);
      setNewQuestion({
        question_text: "",
        category: "Environmental Planning",
        iso_standard: "",
        weightage: 1,
        sequence_order: questions.length + 1,
      });
    } catch (error) {
      console.error("Error saving question:", error);
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ehs_checklist_questions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };
  
  const handleEditQuestion = (question: ChecklistQuestion) => {
    setEditingQuestion(question);
    setNewQuestion({
      question_text: question.question_text,
      category: question.category,
      iso_standard: question.iso_standard,
      weightage: question.weightage,
      sequence_order: question.sequence_order,
    });
    setIsQuestionDialogOpen(true);
  };
  
  // Check if user is authorized
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">EHS Checklists</h1>
            <p className="text-muted-foreground">
              Manage ISO 14001 & ISO 45001 compliance checklists
            </p>
          </div>
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a new EHS checklist template for an industry
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Template Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., ISO 14001 Manufacturing Checklist"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the checklist"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    value={newTemplate.industry_category} 
                    onValueChange={(value) => setNewTemplate({...newTemplate, industry_category: value})}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select an industry" />
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
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_default" 
                    checked={newTemplate.is_default}
                    onCheckedChange={(checked) => 
                      setNewTemplate({...newTemplate, is_default: checked === true})
                    }
                  />
                  <label
                    htmlFor="is_default"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Set as default template for this industry
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <p>Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Templates</CardTitle>
              <CardDescription>
                You have not created any EHS checklist templates yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsTemplateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create First Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="questions" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              <Select 
                value={selectedTemplateId || ''}
                onValueChange={(value) => setSelectedTemplateId(value)}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title} - {template.industry_category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="questions" className="space-y-4">
              <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingQuestion ? "Edit Question" : "Add New Question"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingQuestion 
                        ? "Update the EHS checklist question" 
                        : "Add a new question to the EHS checklist"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="question_text">Question</Label>
                      <Input
                        id="question_text"
                        placeholder="e.g., Has the organization identified environmental aspects of its activities?"
                        value={newQuestion.question_text}
                        onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newQuestion.category} 
                        onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
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
                      <Label htmlFor="iso_standard">ISO Standard Reference</Label>
                      <Input
                        id="iso_standard"
                        placeholder="e.g., ISO 14001:4.3.1"
                        value={newQuestion.iso_standard}
                        onChange={(e) => setNewQuestion({...newQuestion, iso_standard: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weightage">Weightage</Label>
                        <Input
                          id="weightage"
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="5"
                          value={newQuestion.weightage}
                          onChange={(e) => setNewQuestion({
                            ...newQuestion, 
                            weightage: parseFloat(e.target.value) || 1
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sequence">Sequence Order</Label>
                        <Input
                          id="sequence"
                          type="number"
                          min="1"
                          value={newQuestion.sequence_order}
                          onChange={(e) => setNewQuestion({
                            ...newQuestion, 
                            sequence_order: parseInt(e.target.value) || 1
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsQuestionDialogOpen(false);
                      setEditingQuestion(null);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveQuestion}>
                      <Save className="mr-2 h-4 w-4" />
                      {editingQuestion ? "Update" : "Add"} Question
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {selectedTemplateId ? (
                questions.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 text-center">Order</TableHead>
                          <TableHead>Question</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>ISO Standard</TableHead>
                          <TableHead className="w-20 text-center">Weightage</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {questions.map((question) => (
                          <TableRow key={question.id}>
                            <TableCell className="text-center">
                              {question.sequence_order}
                            </TableCell>
                            <TableCell>
                              {question.question_text}
                            </TableCell>
                            <TableCell>
                              {question.category}
                            </TableCell>
                            <TableCell>
                              {question.iso_standard}
                            </TableCell>
                            <TableCell className="text-center">
                              {question.weightage}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditQuestion(question)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Questions</CardTitle>
                      <CardDescription>
                        This template doesn't have any questions yet.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <Button onClick={() => setIsQuestionDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add First Question
                      </Button>
                    </CardContent>
                  </Card>
                )
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Template Selected</CardTitle>
                    <CardDescription>
                      Please select a template to view its questions.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-24 text-center">Default</TableHead>
                      <TableHead className="w-24 text-center">Questions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow 
                        key={template.id} 
                        className="cursor-pointer"
                        onClick={() => setSelectedTemplateId(template.id)}
                      >
                        <TableCell className="font-medium">
                          {template.title}
                        </TableCell>
                        <TableCell>
                          {template.industry_category}
                        </TableCell>
                        <TableCell>
                          {template.description}
                        </TableCell>
                        <TableCell className="text-center">
                          {template.is_default && (
                            <CheckSquare className="h-4 w-4 mx-auto text-green-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {questions.filter(q => q.template_id === template.id).length}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default EHSChecklist;
