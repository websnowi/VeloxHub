
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  salary: number;
  workHours: number;
  status: string;
  position: string;
}

interface PayrollManagerProps {
  employees: Employee[];
}

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  payPeriod: string;
  status: 'pending' | 'processed' | 'paid';
  payDate: string;
}

export const PayrollManager = ({ employees }: PayrollManagerProps) => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const { toast } = useToast();

  const generatePayroll = () => {
    const currentDate = new Date();
    const payPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const newRecords: PayrollRecord[] = employees.map(emp => {
      const grossPay = emp.salary / 12; // Monthly salary
      const deductions = grossPay * 0.25; // 25% deductions (taxes, benefits, etc.)
      const netPay = grossPay - deductions;
      
      return {
        id: `${emp.id}-${payPeriod}`,
        employeeId: emp.id,
        employeeName: emp.name,
        grossPay,
        deductions,
        netPay,
        payPeriod,
        status: 'pending',
        payDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString().split('T')[0]
      };
    });

    setPayrollRecords(newRecords);
    toast({
      title: "Payroll Generated",
      description: `Payroll has been generated for ${employees.length} employees.`,
    });
  };

  const processPayroll = (recordId: string) => {
    setPayrollRecords(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { ...record, status: 'processed' as const }
          : record
      )
    );
    toast({
      title: "Payroll Processed",
      description: "Payroll record has been processed successfully.",
    });
  };

  const sendPayment = (recordId: string) => {
    setPayrollRecords(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { ...record, status: 'paid' as const }
          : record
      )
    );
    toast({
      title: "Payment Sent",
      description: "Payment has been sent to employee's bank account.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-600 hover:bg-green-700';
      case 'processed': return 'bg-blue-600 hover:bg-blue-700';
      case 'pending': return 'bg-yellow-600 hover:bg-yellow-700';
      default: return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'processed': return CreditCard;
      case 'pending': return Clock;
      default: return AlertCircle;
    }
  };

  const totalGrossPay = payrollRecords.reduce((sum, record) => sum + record.grossPay, 0);
  const totalDeductions = payrollRecords.reduce((sum, record) => sum + record.deductions, 0);
  const totalNetPay = payrollRecords.reduce((sum, record) => sum + record.netPay, 0);

  return (
    <div className="space-y-6">
      {/* Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Gross Pay</p>
                <p className="text-xl font-bold text-white">${totalGrossPay.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Deductions</p>
                <p className="text-xl font-bold text-white">${totalDeductions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Net Pay</p>
                <p className="text-xl font-bold text-white">${totalNetPay.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Employees</p>
                <p className="text-xl font-bold text-white">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-white">Payroll Management</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={generatePayroll}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={employees.length === 0}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Generate Payroll
              </Button>
              <Button 
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {payrollRecords.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Payroll Records</h3>
              <p className="text-slate-400 mb-4">Generate payroll for your employees to get started</p>
              <Button 
                onClick={generatePayroll}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={employees.length === 0}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Generate Payroll
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Employee</TableHead>
                  <TableHead className="text-slate-300">Gross Pay</TableHead>
                  <TableHead className="text-slate-300">Deductions</TableHead>
                  <TableHead className="text-slate-300">Net Pay</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Pay Date</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollRecords.map((record) => {
                  const StatusIcon = getStatusIcon(record.status);
                  return (
                    <TableRow key={record.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell className="text-slate-300 font-medium">{record.employeeName}</TableCell>
                      <TableCell className="text-slate-300">${record.grossPay.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-300">${record.deductions.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-300 font-medium">${record.netPay.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(record.status)} text-white flex items-center gap-1 w-fit`}>
                          <StatusIcon className="h-3 w-3" />
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400">{record.payDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {record.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => processPayroll(record.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Process
                            </Button>
                          )}
                          {record.status === 'processed' && (
                            <Button
                              size="sm"
                              onClick={() => sendPayment(record.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Pay
                            </Button>
                          )}
                          {record.status === 'paid' && (
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Paid
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Bank Integration Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Bank Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Connect Your Bank</h3>
            <p className="text-slate-400 mb-4">Integrate with your bank to automate payroll payments</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Connect Bank Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
