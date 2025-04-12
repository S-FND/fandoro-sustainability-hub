
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Edit, Check, X, Clock, User } from "lucide-react";

interface SDG {
  id: string;
  sdg_number: number;
  target_description: string;
  progress_percentage: number;
  initiatives: string | null;
  metrics: string | null;
  enterprise_id: string;
}

interface DataApproval {
  id: string;
  data_id: string;
  data_type: string;
  status: string;
  submitted_at: string;
  submitted_by: string;
  approver_id: string;
  responded_at: string | null;
  comments: string | null;
}

export const SDGManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sdgs, setSdgs] = useState<SDG[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSDG, setCurrentSDG] = useState<SDG | null>(null);
  const [approvers, setApprovers] = useState<{id: string, name: string, email: string}[]>([]);
  const [selectedApproverId, setSelectedApproverId] = useState<string>("");
  const [approvalRequests, setApprovalRequests] = useState<DataApproval[]>([]);
  
  // Form state
  const [sdgNumber, setSdgNumber] = useState<number>(0);
  const [targetDescription, setTargetDescription] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [initiatives, setInitiatives] = useState<string>("");
  const [metrics, setMetrics] = useState<string>("");
  
  useEffect(() => {
    if (user?.id) {
      fetchSDGs();
      fetchApprovers();
      fetchApprovalRequests();
    }
  }, [user]);

  const fetchSDGs = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('enterprise_sdg_progress')
        .select('*')
        .eq('enterprise_id', user.id);
      
      if (error) throw error;
      setSdgs(data || []);
    } catch (error) {
      console.error('Error fetching SDGs:', error);
      toast({
        title: "Error",
        description: "Failed to load SDG data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApprovers = async () => {
    if (!user?.id) return;
    
    try {
      // In a real app, this would fetch potential approvers from your organization
      // For this example, we'll use a mock list
      setApprovers([
        { id: "approver1", name: "John Approver", email: "john@example.com" },
        { id: "approver2", name: "Jane Reviewer", email: "jane@example.com" },
      ]);
    } catch (error) {
      console.error('Error fetching approvers:', error);
    }
  };

  const fetchApprovalRequests = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('enterprise_data_approvals')
        .select('*')
        .eq('data_type', 'sdg')
        .or(`submitted_by.eq.${user.id},approver_id.eq.${user.id}`);
      
      if (error) throw error;
      setApprovalRequests(data || []);
    } catch (error) {
      console.error('Error fetching approval requests:', error);
    }
  };
  
  const openCreateDialog = () => {
    setCurrentSDG(null);
    setSdgNumber(0);
    setTargetDescription("");
    setProgress(0);
    setInitiatives("");
    setMetrics("");
    setSelectedApproverId("");
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (sdg: SDG) => {
    setCurrentSDG(sdg);
    setSdgNumber(sdg.sdg_number);
    setTargetDescription(sdg.target_description);
    setProgress(sdg.progress_percentage);
    setInitiatives(sdg.initiatives || "");
    setMetrics(sdg.metrics || "");
    setSelectedApproverId("");
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    if (!user?.id || !sdgNumber || !targetDescription) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedApproverId) {
      toast({
        title: "Approver Required",
        description: "Please select an approver for this submission",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let sdgId;
      
      if (currentSDG) {
        // Update existing SDG
        const { data, error } = await supabase
          .from('enterprise_sdg_progress')
          .update({
            sdg_number: sdgNumber,
            target_description: targetDescription,
            progress_percentage: progress,
            initiatives: initiatives,
            metrics: metrics,
          })
          .eq('id', currentSDG.id)
          .select();
        
        if (error) throw error;
        sdgId = currentSDG.id;
        
      } else {
        // Create new SDG
        const { data, error } = await supabase
          .from('enterprise_sdg_progress')
          .insert({
            enterprise_id: user.id,
            sdg_number: sdgNumber,
            target_description: targetDescription,
            progress_percentage: progress,
            initiatives: initiatives,
            metrics: metrics,
          })
          .select();
        
        if (error) throw error;
        sdgId = data?.[0]?.id;
      }
      
      // Create approval request
      if (sdgId) {
        const { error: approvalError } = await supabase
          .from('enterprise_data_approvals')
          .insert({
            enterprise_id: user.id,
            data_id: sdgId,
            data_type: 'sdg',
            submitted_by: user.id,
            approver_id: selectedApproverId,
          });
        
        if (approvalError) throw approvalError;
      }
      
      toast({
        title: "Success",
        description: currentSDG
          ? "SDG data updated and sent for approval"
          : "New SDG data submitted for approval",
      });
      
      setIsDialogOpen(false);
      fetchSDGs();
      fetchApprovalRequests();
      
    } catch (error) {
      console.error('Error submitting SDG data:', error);
      toast({
        title: "Error",
        description: "Failed to submit SDG data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (approvalId: string, approved: boolean) => {
    if (!user?.id) return;
    
    try {
      const comments = approved ? null : prompt("Please provide reason for rejection:");
      
      const { error } = await supabase
        .from('enterprise_data_approvals')
        .update({
          status: approved ? 'approved' : 'rejected',
          responded_at: new Date().toISOString(),
          comments: comments || null,
        })
        .eq('id', approvalId);
      
      if (error) throw error;
      
      toast({
        title: approved ? "Approved" : "Rejected",
        description: `Data has been ${approved ? 'approved' : 'rejected'}`,
      });
      
      fetchApprovalRequests();
      
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast({
        title: "Error",
        description: "Failed to update approval status",
        variant: "destructive",
      });
    }
  };

  const getSDGColor = (sdgNumber: number) => {
    const colors: Record<number, string> = {
      1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D',
      5: '#FF3A21', 6: '#26BDE2', 7: '#FCC30B', 8: '#A21942',
      9: '#FD6925', 10: '#DD1367', 11: '#FD9D24', 12: '#BF8B2E',
      13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B', 16: '#00689D',
      17: '#19486A'
    };
    return colors[sdgNumber] || '#777777';
  };

  const getApprovalStatus = (sdgId: string) => {
    const approval = approvalRequests.find(
      req => req.data_id === sdgId && req.data_type === 'sdg'
    );
    
    if (!approval) return null;
    
    return {
      status: approval.status,
      id: approval.id,
      isApprover: approval.approver_id === user?.id,
    };
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>SDG Management</CardTitle>
        <Button onClick={openCreateDialog}>Add SDG Goal</Button>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading...</div>
        ) : sdgs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No SDG goals added yet. Click "Add SDG Goal" to get started.
          </div>
        ) : (
          <div className="space-y-6">
            {sdgs.map((sdg) => {
              const approvalInfo = getApprovalStatus(sdg.id);
              
              return (
                <div 
                  key={sdg.id} 
                  className="border rounded-md p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-md flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: getSDGColor(sdg.sdg_number) }}
                      >
                        {sdg.sdg_number}
                      </div>
                      <div>
                        <h3 className="font-medium">{sdg.target_description}</h3>
                        <div className="text-sm text-muted-foreground">Progress: {sdg.progress_percentage}%</div>
                      </div>
                    </div>
                    
                    {approvalInfo ? (
                      <Badge 
                        className={
                          approvalInfo.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          approvalInfo.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {approvalInfo.status === 'pending' ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending Approval
                          </span>
                        ) : approvalInfo.status === 'approved' ? (
                          <span className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Approved
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <X className="h-3 w-3" />
                            Rejected
                          </span>
                        )}
                      </Badge>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(sdg)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    )}
                  </div>
                  
                  {sdg.initiatives && (
                    <div className="text-sm">
                      <span className="font-medium">Initiatives:</span> {sdg.initiatives}
                    </div>
                  )}
                  
                  {sdg.metrics && (
                    <div className="text-sm">
                      <span className="font-medium">Metrics:</span> {sdg.metrics}
                    </div>
                  )}
                  
                  {approvalInfo && approvalInfo.isApprover && approvalInfo.status === 'pending' && (
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-500 text-green-500 hover:bg-green-50"
                        onClick={() => handleApproval(approvalInfo.id, true)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => handleApproval(approvalInfo.id, false)}
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{currentSDG ? "Edit SDG Goal" : "Add SDG Goal"}</DialogTitle>
            <DialogDescription>
              {currentSDG ? "Update SDG information and submit for approval" : "Add a new SDG goal and submit for approval"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sdg-number">SDG Number</Label>
                <Input 
                  id="sdg-number" 
                  type="number" 
                  min="1" 
                  max="17" 
                  value={sdgNumber} 
                  onChange={(e) => setSdgNumber(parseInt(e.target.value) || 0)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input 
                  id="progress" 
                  type="number" 
                  min="0" 
                  max="100"
                  value={progress} 
                  onChange={(e) => setProgress(parseInt(e.target.value) || 0)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-description">Target Description</Label>
              <Input 
                id="target-description" 
                value={targetDescription} 
                onChange={(e) => setTargetDescription(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="initiatives">Initiatives</Label>
              <Textarea 
                id="initiatives" 
                value={initiatives} 
                onChange={(e) => setInitiatives(e.target.value)} 
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metrics">Metrics</Label>
              <Textarea 
                id="metrics" 
                value={metrics} 
                onChange={(e) => setMetrics(e.target.value)} 
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="approver">Select Approver</Label>
              <Select value={selectedApproverId} onValueChange={setSelectedApproverId}>
                <SelectTrigger id="approver">
                  <SelectValue placeholder="Select an approver" />
                </SelectTrigger>
                <SelectContent>
                  {approvers.map((approver) => (
                    <SelectItem key={approver.id} value={approver.id}>
                      {approver.name} ({approver.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Submitting..." : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Approval
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
