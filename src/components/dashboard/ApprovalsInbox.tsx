
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Clock, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ApprovalRequest {
  id: string;
  data_id: string;
  data_type: string;
  submitted_at: string;
  submitted_by: string;
  status: string;
  comments: string | null;
  submitter_name?: string;
  data_details?: any;
}

export const ApprovalsInbox = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [comments, setComments] = useState("");
  const [viewMode, setViewMode] = useState<"inbox" | "outbox">("inbox");

  useEffect(() => {
    if (user?.id) {
      fetchApprovalRequests();
    }
  }, [user, viewMode]);

  const fetchApprovalRequests = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('enterprise_data_approvals')
        .select('*');
      
      if (viewMode === "inbox") {
        query = query.eq('approver_id', user.id);
      } else {
        query = query.eq('submitted_by', user.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Enhancement: Fetch additional data about each request
      const enhancedRequests = await Promise.all((data || []).map(async (request) => {
        let dataDetails;
        let submitterName = "Unknown User";
        
        // Fetch data details based on data_type
        if (request.data_type === 'sdg') {
          const { data: sdgData } = await supabase
            .from('enterprise_sdg_progress')
            .select('*')
            .eq('id', request.data_id)
            .single();
          
          dataDetails = sdgData;
        } else if (request.data_type === 'ghg_emission') {
          const { data: ghgData } = await supabase
            .from('enterprise_ghg_emissions')
            .select('*')
            .eq('id', request.data_id)
            .single();
          
          dataDetails = ghgData;
        }
        
        // In a real app, you would fetch user details from your users table
        // For this example, we'll use placeholder names
        if (viewMode === "inbox") {
          submitterName = "User " + request.submitted_by.substring(0, 4);
        }
        
        return {
          ...request,
          submitter_name: submitterName,
          data_details: dataDetails,
        };
      }));
      
      setApprovalRequests(enhancedRequests);
      
    } catch (error) {
      console.error('Error fetching approval requests:', error);
      toast({
        title: "Error",
        description: "Failed to load approval requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setComments(request.comments || "");
    setShowDetailsDialog(true);
  };

  const handleApproval = async (approve: boolean) => {
    if (!selectedRequest || !user?.id) return;
    
    try {
      const { error } = await supabase
        .from('enterprise_data_approvals')
        .update({
          status: approve ? 'approved' : 'rejected',
          responded_at: new Date().toISOString(),
          comments: comments,
        })
        .eq('id', selectedRequest.id);
      
      if (error) throw error;
      
      toast({
        title: approve ? "Approved" : "Rejected",
        description: `The request has been ${approve ? 'approved' : 'rejected'} successfully`,
      });
      
      setShowDetailsDialog(false);
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

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <Check className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <X className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" /> Unknown
          </Badge>
        );
    }
  };

  const renderDataTypeLabel = (dataType: string) => {
    switch (dataType) {
      case 'sdg':
        return 'SDG Progress';
      case 'ghg_emission':
        return 'GHG Emission';
      default:
        return dataType;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDetails = () => {
    if (!selectedRequest?.data_details) return "No details available";
    
    const details = selectedRequest.data_details;
    
    switch (selectedRequest.data_type) {
      case 'sdg':
        return (
          <div className="space-y-4">
            <div>
              <span className="font-semibold">SDG Number:</span> {details.sdg_number}
            </div>
            <div>
              <span className="font-semibold">Target Description:</span> {details.target_description}
            </div>
            <div>
              <span className="font-semibold">Progress:</span> {details.progress_percentage}%
            </div>
            {details.initiatives && (
              <div>
                <span className="font-semibold">Initiatives:</span> {details.initiatives}
              </div>
            )}
            {details.metrics && (
              <div>
                <span className="font-semibold">Metrics:</span> {details.metrics}
              </div>
            )}
          </div>
        );
      case 'ghg_emission':
        return (
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Emission Source:</span> {details.emission_source}
            </div>
            <div>
              <span className="font-semibold">Emission Value:</span> {details.emission_value} {details.emission_unit}
            </div>
            <div>
              <span className="font-semibold">Scope:</span> {details.scope_type}
            </div>
            <div>
              <span className="font-semibold">Reporting Period:</span> {new Date(details.reporting_period_start).toLocaleDateString()} - {new Date(details.reporting_period_end).toLocaleDateString()}
            </div>
          </div>
        );
      default:
        return "Unknown data type";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>
            {viewMode === "inbox" ? "Approvals Inbox" : "My Submissions"}
          </CardTitle>
          <div className="space-x-2">
            <Button 
              size="sm" 
              variant={viewMode === "inbox" ? "default" : "outline"} 
              onClick={() => setViewMode("inbox")}
            >
              Inbox
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === "outbox" ? "default" : "outline"} 
              onClick={() => setViewMode("outbox")}
            >
              My Submissions
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">Loading...</div>
        ) : approvalRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No {viewMode === "inbox" ? "approval requests" : "submissions"} found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  {viewMode === "inbox" && <TableHead>Submitted By</TableHead>}
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvalRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{renderDataTypeLabel(request.data_type)}</TableCell>
                    {viewMode === "inbox" && (
                      <TableCell>{request.submitter_name}</TableCell>
                    )}
                    <TableCell>{formatDate(request.submitted_at)}</TableCell>
                    <TableCell>{renderStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewDetails(request)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {renderDataTypeLabel(selectedRequest?.data_type || "")} Details
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedRequest?.submitted_at ? formatDate(selectedRequest.submitted_at) : ""}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {renderDetails()}
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Comments</h4>
              {viewMode === "inbox" && selectedRequest?.status === "pending" ? (
                <Textarea
                  placeholder="Add your comments here..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedRequest?.comments || "No comments provided."}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            {viewMode === "inbox" && selectedRequest?.status === "pending" ? (
              <>
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => handleApproval(false)}>
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button onClick={() => handleApproval(true)}>
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
