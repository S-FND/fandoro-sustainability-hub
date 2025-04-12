
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { UserPlus, Trash2, Mail, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Stakeholder {
  id: string;
  name: string;
  email: string;
  type: string;
  organization: string;
  phone: string;
  notes: string;
}

const stakeholderTypes = [
  "Employee",
  "Investor",
  "Customer",
  "Supplier",
  "NGO",
  "Government",
  "Community",
  "Partner",
  "Media",
  "Other"
];

const Stakeholders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newStakeholder, setNewStakeholder] = useState({
    name: "",
    email: "",
    type: "",
    organization: "",
    phone: "",
    notes: ""
  });

  // Fetch stakeholders on component mount
  useEffect(() => {
    const fetchStakeholders = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("enterprise_stakeholders")
          .select("*")
          .eq("enterprise_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setStakeholders(data || []);
      } catch (error) {
        console.error("Error fetching stakeholders:", error);
        toast({
          title: "Error fetching stakeholders",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStakeholders();
  }, [user?.id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStakeholder((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setNewStakeholder((prev) => ({ ...prev, type: value }));
  };

  const handleAddStakeholder = async () => {
    if (!newStakeholder.name || !newStakeholder.email || !newStakeholder.type) {
      toast({
        title: "Missing required fields",
        description: "Name, email and type are required",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication error",
        description: "Please login again",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("enterprise_stakeholders")
        .insert({
          name: newStakeholder.name,
          email: newStakeholder.email.toLowerCase(),
          type: newStakeholder.type,
          organization: newStakeholder.organization,
          phone: newStakeholder.phone,
          notes: newStakeholder.notes,
          enterprise_id: user.id
        })
        .select();

      if (error) {
        if (error.code === '23505') {
          // Unique violation
          toast({
            title: "Stakeholder already exists",
            description: "A stakeholder with this email already exists",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Stakeholder added",
        description: `${newStakeholder.name} has been added to your stakeholders`,
      });

      // Add new stakeholder to the list
      if (data && data.length > 0) {
        setStakeholders((prev) => [data[0], ...prev]);
      }

      // Reset form
      setNewStakeholder({
        name: "",
        email: "",
        type: "",
        organization: "",
        phone: "",
        notes: ""
      });
    } catch (error) {
      console.error("Error adding stakeholder:", error);
      toast({
        title: "Error adding stakeholder",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStakeholder = async (id: string) => {
    try {
      const { error } = await supabase
        .from("enterprise_stakeholders")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStakeholders((prev) => prev.filter((stakeholder) => stakeholder.id !== id));
      toast({
        title: "Stakeholder removed",
        description: "The stakeholder has been removed from your list",
      });
    } catch (error) {
      console.error("Error deleting stakeholder:", error);
      toast({
        title: "Error removing stakeholder",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    if (stakeholders.length === 0) {
      toast({
        title: "No stakeholders to export",
        description: "Add some stakeholders first",
        variant: "destructive",
      });
      return;
    }

    // Create CSV string
    const headers = ["Name", "Email", "Type", "Organization", "Phone", "Notes"];
    const csvRows = [headers.join(',')];

    stakeholders.forEach(s => {
      const values = [
        `"${s.name}"`, 
        `"${s.email}"`, 
        `"${s.type}"`, 
        `"${s.organization || ''}"`,
        `"${s.phone || ''}"`,
        `"${s.notes?.replace(/"/g, '""') || ''}"`
      ];
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'stakeholders.csv';
    link.href = url;
    link.click();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stakeholder Management</h1>
          <p className="text-muted-foreground">
            Manage and engage with your organization's stakeholders
          </p>
        </div>

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">Stakeholder List</TabsTrigger>
            <TabsTrigger value="add">Add Stakeholder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Your Stakeholders</h2>
                <p className="text-sm text-muted-foreground">
                  Total: {stakeholders.length} stakeholders
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleExportCSV} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="py-8 text-center">Loading stakeholders...</div>
                ) : stakeholders.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No stakeholders added yet.</p>
                    <p className="text-sm">Use the "Add Stakeholder" tab to add your first stakeholder.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Organization</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stakeholders.map((stakeholder) => (
                          <TableRow key={stakeholder.id}>
                            <TableCell className="font-medium">{stakeholder.name}</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted">
                                {stakeholder.type}
                              </span>
                            </TableCell>
                            <TableCell>{stakeholder.organization || "-"}</TableCell>
                            <TableCell>{stakeholder.email}</TableCell>
                            <TableCell>{stakeholder.phone || "-"}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="ghost" size="icon">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteStakeholder(stakeholder.id)}
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
          </TabsContent>
          
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add New Stakeholder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      value={newStakeholder.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      name="email"
                      value={newStakeholder.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      type="email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stakeholderType">Stakeholder Type <span className="text-destructive">*</span></Label>
                    <Select
                      value={newStakeholder.type}
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger id="stakeholderType">
                        <SelectValue placeholder="Select stakeholder type" />
                      </SelectTrigger>
                      <SelectContent>
                        {stakeholderTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={newStakeholder.organization}
                      onChange={handleInputChange}
                      placeholder="Company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newStakeholder.phone}
                      onChange={handleInputChange}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={newStakeholder.notes}
                    onChange={handleInputChange}
                    placeholder="Additional information about this stakeholder..."
                  />
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleAddStakeholder}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Stakeholder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Stakeholders;
