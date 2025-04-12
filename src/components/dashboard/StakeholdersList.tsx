
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Building2, Phone, Mail, Plus, Edit, Trash2 } from 'lucide-react';

// Mock data for testing
const mockStakeholders = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '+91 98765 43210',
    organization: 'Acme Corporation',
    type: 'supplier',
    notes: 'Key raw material supplier'
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.doe@investor.com',
    phone: '+91 87654 32109',
    organization: 'Green Investments',
    type: 'investor',
    notes: 'ESG-focused institutional investor'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@community.org',
    phone: '+91 76543 21098',
    organization: 'Local Community Association',
    type: 'community',
    notes: 'Community representative for Bangalore operations'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'swilson@enterprise.com',
    phone: '+91 65432 10987',
    organization: 'Internal',
    type: 'employee',
    notes: 'Sustainability team lead'
  },
  {
    id: '5',
    name: 'Raj Kumar',
    email: 'raj@regulators.gov',
    phone: '+91 54321 09876',
    organization: 'Environmental Regulatory Body',
    type: 'regulator',
    notes: 'Regional compliance officer'
  }
];

const stakeholderTypes = [
  'customer',
  'supplier',
  'employee',
  'investor',
  'regulator',
  'community',
  'partner',
  'ngo'
];

export const StakeholdersList = () => {
  const { toast } = useToast();
  const [stakeholders, setStakeholders] = useState(mockStakeholders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStakeholder, setCurrentStakeholder] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    organization: '',
    type: 'supplier',
    notes: ''
  });

  const handleAddNew = () => {
    setCurrentStakeholder({
      id: '',
      name: '',
      email: '',
      phone: '',
      organization: '',
      type: 'supplier',
      notes: ''
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (stakeholder) => {
    setCurrentStakeholder(stakeholder);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
    toast({
      title: "Stakeholder removed",
      description: "The stakeholder has been removed successfully",
    });
  };

  const handleSave = () => {
    if (!currentStakeholder.name || !currentStakeholder.email || !currentStakeholder.type) {
      toast({
        title: "Missing information",
        description: "Please provide name, email and type",
        variant: "destructive",
      });
      return;
    }

    if (isEditing) {
      setStakeholders(stakeholders.map(s => 
        s.id === currentStakeholder.id ? currentStakeholder : s
      ));
      toast({
        title: "Stakeholder updated",
        description: "The stakeholder has been updated successfully",
      });
    } else {
      const newStakeholder = {
        ...currentStakeholder,
        id: Date.now().toString(),
      };
      setStakeholders([...stakeholders, newStakeholder]);
      toast({
        title: "Stakeholder added",
        description: "The stakeholder has been added successfully",
      });
    }
    
    setIsDialogOpen(false);
  };

  const getTypeColor = (type) => {
    const colors = {
      customer: "bg-blue-100 text-blue-800",
      supplier: "bg-green-100 text-green-800",
      employee: "bg-purple-100 text-purple-800",
      investor: "bg-amber-100 text-amber-800",
      regulator: "bg-red-100 text-red-800",
      community: "bg-teal-100 text-teal-800",
      partner: "bg-indigo-100 text-indigo-800",
      ngo: "bg-orange-100 text-orange-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Stakeholders</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stakeholder
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stakeholder Management</CardTitle>
        </CardHeader>
        <CardContent>
          {stakeholders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No stakeholders added yet.</p>
              <p className="text-sm text-muted-foreground">Add stakeholders to begin materiality assessment.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stakeholders.map((stakeholder) => (
                  <TableRow key={stakeholder.id}>
                    <TableCell className="font-medium">{stakeholder.name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(stakeholder.type)}>
                        {stakeholder.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{stakeholder.organization || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{stakeholder.email}</span>
                        </div>
                        {stakeholder.phone && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{stakeholder.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {stakeholder.notes || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(stakeholder)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(stakeholder.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Stakeholder" : "Add Stakeholder"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update stakeholder information" 
                : "Add a new stakeholder to your network"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentStakeholder.name}
                onChange={(e) => setCurrentStakeholder({...currentStakeholder, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={currentStakeholder.email}
                onChange={(e) => setCurrentStakeholder({...currentStakeholder, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={currentStakeholder.phone}
                onChange={(e) => setCurrentStakeholder({...currentStakeholder, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={currentStakeholder.type}
                onValueChange={(value) => setCurrentStakeholder({...currentStakeholder, type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select stakeholder type" />
                </SelectTrigger>
                <SelectContent>
                  {stakeholderTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="organization" className="text-right">
                Organization
              </Label>
              <Input
                id="organization"
                value={currentStakeholder.organization}
                onChange={(e) => setCurrentStakeholder({...currentStakeholder, organization: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={currentStakeholder.notes}
                onChange={(e) => setCurrentStakeholder({...currentStakeholder, notes: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
