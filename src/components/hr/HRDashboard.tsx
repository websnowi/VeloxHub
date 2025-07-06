import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  Clock, 
  Upload,
  Plus,
  Search,
  Filter,
  Star,
  Linkedin,
  Calendar,
  FileText,
  CreditCard,
  UserX,
  UserCheck,
  Globe,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { EmployeeForm } from "@/components/hr/EmployeeForm";
import { PayrollManager } from "@/components/hr/PayrollManager";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive' | 'trial' | 'terminated';
  workHours: number;
  startDate: string;
  linkedinProfile?: string;
  rating: number;
  workType: 'full-time' | 'part-time' | 'intern' | 'remote' | 'contract';
}

export const HRDashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const handleAddEmployee = (employeeData: any) => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...employeeData,
      rating: 0,
      status: 'active'
    };
    setEmployees([...employees, newEmployee]);
    setShowEmployeeForm(false);
    
    // Log employee creation
    logActivity({
      activityType: 'employee_management',
      activityAction: 'create',
      resourceType: 'employee',
      resourceId: newEmployee.id,
      resourceName: newEmployee.name,
      description: `Added new employee: ${newEmployee.name}`,
      metadata: { position: newEmployee.position, department: newEmployee.department }
    });
    
    toast({
      title: "Employee Added",
      description: "New employee has been successfully added to the system.",
    });
  };

  const handleTabChange = (tab: string) => {
    // Log tab navigation
    logActivity({
      activityType: 'hr_management',
      activityAction: 'view',
      resourceType: 'tab',
      resourceName: tab,
      description: `Navigated to ${tab} tab in HR dashboard`
    });
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 hover:bg-green-700';
      case 'trial': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'terminated': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const hrStats = [
    { title: "Total Employees", value: employees.length.toString(), icon: Users },
    { title: "Active", value: employees.filter(e => e.status === 'active').length.toString(), icon: UserCheck },
    { title: "On Trial", value: employees.filter(e => e.status === 'trial').length.toString(), icon: Clock },
    { title: "Monthly Payroll", value: `$${employees.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}`, icon: DollarSign }
  ];

  return (
    <div className="space-y-6">
      {/* HR Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hrStats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="employees" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="employees" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Employees
          </TabsTrigger>
          <TabsTrigger value="payroll" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Payroll
          </TabsTrigger>
          <TabsTrigger value="attendance" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-white">Employee Management</CardTitle>
                <Button 
                  onClick={() => setShowEmployeeForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Employees Found</h3>
                  <p className="text-slate-400 mb-4">Start building your team by adding your first employee</p>
                  <Button 
                    onClick={() => setShowEmployeeForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Employee
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.map((employee) => (
                    <Card key={employee.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{employee.name}</h4>
                            <p className="text-sm text-slate-400">{employee.position}</p>
                            <p className="text-xs text-slate-500">{employee.department}</p>
                          </div>
                          <Badge className={`${getStatusColor(employee.status)} text-white text-xs`}>
                            {employee.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-slate-300">
                            <span>Salary:</span>
                            <span className="font-medium">${employee.salary.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Work Type:</span>
                            <span className="font-medium capitalize">{employee.workType}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Hours/Week:</span>
                            <span className="font-medium">{employee.workHours}h</span>
                          </div>
                          {employee.linkedinProfile && (
                            <div className="flex items-center gap-2 mt-2">
                              <Linkedin className="h-4 w-4 text-blue-400" />
                              <a 
                                href={employee.linkedinProfile} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-xs"
                              >
                                LinkedIn Profile
                              </a>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedEmployee(employee)}
                            className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="mt-6">
          <PayrollManager employees={employees} />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Attendance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Attendance System</h3>
                <p className="text-slate-400">Track employee work hours, breaks, and attendance patterns</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">HR Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">HR Analytics</h3>
                <p className="text-slate-400">Generate reports on employee performance, payroll, and HR metrics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Form Modal */}
      {showEmployeeForm && (
        <EmployeeForm
          onSubmit={handleAddEmployee}
          onClose={() => setShowEmployeeForm(false)}
        />
      )}
    </div>
  );
};
