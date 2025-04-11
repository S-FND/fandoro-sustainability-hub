
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Users } from "lucide-react";

const EnterpriseSetup = () => {
  const [departments, setDepartments] = useState<string[]>([
    "HR",
    "Finance",
    "Operations",
  ]);
  const [newDepartment, setNewDepartment] = useState<string>("");
  
  const [units, setUnits] = useState<Array<{ name: string; type: string; address: string }>>([
    {
      name: "Headquarters",
      type: "Corporate headquarters",
      address: "123 Main Street, Mumbai, Maharashtra",
    },
  ]);
  const [newUnit, setNewUnit] = useState<{ name: string; type: string; address: string }>({
    name: "",
    type: "",
    address: "",
  });
  
  const [employees, setEmployees] = useState<Array<{ name: string; designation: string; department: string; gender: string }>>([
    {
      name: "John Doe",
      designation: "CEO",
      department: "Operations",
      gender: "Male",
    },
    {
      name: "Jane Smith",
      designation: "HR Manager",
      department: "HR",
      gender: "Female",
    },
  ]);
  const [newEmployee, setNewEmployee] = useState<{ name: string; designation: string; department: string; gender: string }>({
    name: "",
    designation: "",
    department: "",
    gender: "",
  });
  
  const { toast } = useToast();

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      toast({
        title: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    if (departments.includes(newDepartment.trim())) {
      toast({
        title: "Department already exists",
        variant: "destructive",
      });
      return;
    }

    setDepartments([...departments, newDepartment.trim()]);
    setNewDepartment("");
    
    toast({
      title: "Department added",
      description: `${newDepartment} has been added to departments`,
    });
  };

  const handleRemoveDepartment = (dept: string) => {
    setDepartments(departments.filter((d) => d !== dept));
    
    toast({
      title: "Department removed",
      description: `${dept} has been removed from departments`,
    });
  };

  const handleAddUnit = () => {
    if (!newUnit.name.trim() || !newUnit.type || !newUnit.address.trim()) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setUnits([...units, { ...newUnit }]);
    setNewUnit({ name: "", type: "", address: "" });
    
    toast({
      title: "Unit added",
      description: `${newUnit.name} has been added to units`,
    });
  };

  const handleRemoveUnit = (index: number) => {
    const unitName = units[index].name;
    const newUnits = [...units];
    newUnits.splice(index, 1);
    setUnits(newUnits);
    
    toast({
      title: "Unit removed",
      description: `${unitName} has been removed from units`,
    });
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name.trim() || !newEmployee.designation.trim() || !newEmployee.department || !newEmployee.gender) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setEmployees([...employees, { ...newEmployee }]);
    setNewEmployee({ name: "", designation: "", department: "", gender: "" });
    
    toast({
      title: "Employee added",
      description: `${newEmployee.name} has been added to employees`,
    });
  };

  const handleRemoveEmployee = (index: number) => {
    const employeeName = employees[index].name;
    const newEmployees = [...employees];
    newEmployees.splice(index, 1);
    setEmployees(newEmployees);
    
    toast({
      title: "Employee removed",
      description: `${employeeName} has been removed from employees`,
    });
  };

  const handleBulkUpload = () => {
    toast({
      title: "Bulk upload",
      description: "This feature is not implemented in the demo",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enterprise Setup</h1>
          <p className="text-muted-foreground">
            Configure your organization structure, locations, and team members
          </p>
        </div>

        <Tabs defaultValue="departments">
          <TabsList className="mb-4">
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="units">Units & Locations</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Department</CardTitle>
                <CardDescription>
                  Create departments for your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="department">Department Name</Label>
                    <Input
                      id="department"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      placeholder="e.g., Marketing"
                    />
                  </div>
                  <Button onClick={handleAddDepartment}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department List</CardTitle>
                <CardDescription>
                  Manage your organization's departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {departments.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No departments added yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <div
                        key={dept}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                      >
                        <span>{dept}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDepartment(dept)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Unit</CardTitle>
                <CardDescription>
                  Add offices, warehouses, or other locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="unit-name">Unit Name</Label>
                    <Input
                      id="unit-name"
                      value={newUnit.name}
                      onChange={(e) =>
                        setNewUnit({ ...newUnit, name: e.target.value })
                      }
                      placeholder="e.g., Mumbai Office"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit-type">Unit Type</Label>
                    <Select
                      value={newUnit.type}
                      onValueChange={(value) =>
                        setNewUnit({ ...newUnit, type: value })
                      }
                    >
                      <SelectTrigger id="unit-type">
                        <SelectValue placeholder="Select unit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Corporate headquarters">
                          Corporate Headquarters
                        </SelectItem>
                        <SelectItem value="Unit Office">Unit Office</SelectItem>
                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                        <SelectItem value="Distribution center">
                          Distribution Center
                        </SelectItem>
                        <SelectItem value="Dark store">Dark Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="unit-address">Address</Label>
                    <Input
                      id="unit-address"
                      value={newUnit.address}
                      onChange={(e) =>
                        setNewUnit({ ...newUnit, address: e.target.value })
                      }
                      placeholder="Full address"
                    />
                  </div>
                  <Button onClick={handleAddUnit} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" /> Add Unit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unit List</CardTitle>
                <CardDescription>Manage your organization's units</CardDescription>
              </CardHeader>
              <CardContent>
                {units.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No units added yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {units.map((unit, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-md"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{unit.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {unit.type}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveUnit(index)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <p className="text-sm mt-2 border-t pt-2">{unit.address}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Employee Management</h2>
              <Button variant="outline" onClick={handleBulkUpload}>
                <Upload className="h-4 w-4 mr-2" /> Bulk Upload
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Add Employee</CardTitle>
                <CardDescription>
                  Add team members to your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee-name">Full Name</Label>
                    <Input
                      id="employee-name"
                      value={newEmployee.name}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, name: e.target.value })
                      }
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employee-designation">Designation</Label>
                    <Input
                      id="employee-designation"
                      value={newEmployee.designation}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          designation: e.target.value,
                        })
                      }
                      placeholder="Job title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employee-department">Department</Label>
                    <Select
                      value={newEmployee.department}
                      onValueChange={(value) =>
                        setNewEmployee({ ...newEmployee, department: value })
                      }
                    >
                      <SelectTrigger id="employee-department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="employee-gender">Gender</Label>
                    <Select
                      value={newEmployee.gender}
                      onValueChange={(value) =>
                        setNewEmployee({ ...newEmployee, gender: value })
                      }
                    >
                      <SelectTrigger id="employee-gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddEmployee} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add Employee
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Employee List</CardTitle>
                  <CardDescription>
                    Manage your organization's team members
                  </CardDescription>
                </div>
                <div className="bg-muted/50 px-3 py-1 rounded-full flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {employees.length} Employees
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {employees.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No employees added yet
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">Name</th>
                          <th className="text-left p-3 font-medium">Designation</th>
                          <th className="text-left p-3 font-medium">Department</th>
                          <th className="text-left p-3 font-medium">Gender</th>
                          <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">{employee.name}</td>
                            <td className="p-3">{employee.designation}</td>
                            <td className="p-3">{employee.department}</td>
                            <td className="p-3">{employee.gender}</td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveEmployee(index)}
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EnterpriseSetup;
