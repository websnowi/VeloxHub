
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface TableWidgetProps {
  title: string;
  subtitle: string;
}

const tableData = [
  { id: '#1234', customer: 'John Smith', product: 'Pro Plan', amount: '$99.00', status: 'Completed', date: '2024-01-15' },
  { id: '#1235', customer: 'Sarah Johnson', product: 'Enterprise', amount: '$299.00', status: 'Pending', date: '2024-01-15' },
  { id: '#1236', customer: 'Mike Wilson', product: 'Basic Plan', amount: '$29.00', status: 'Completed', date: '2024-01-14' },
  { id: '#1237', customer: 'Emily Davis', product: 'Pro Plan', amount: '$99.00', status: 'Failed', date: '2024-01-14' },
  { id: '#1238', customer: 'David Brown', product: 'Enterprise', amount: '$299.00', status: 'Completed', date: '2024-01-13' },
];

export const TableWidget = ({ title, subtitle }: TableWidgetProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-600 hover:bg-green-700';
      case 'Pending':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'Failed':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
        <p className="text-slate-400 text-sm">{subtitle}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-slate-300">Order ID</TableHead>
              <TableHead className="text-slate-300">Customer</TableHead>
              <TableHead className="text-slate-300">Product</TableHead>
              <TableHead className="text-slate-300">Amount</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead className="text-slate-300">Date</TableHead>
              <TableHead className="text-slate-300"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id} className="border-slate-700 hover:bg-slate-700/30">
                <TableCell className="text-slate-300 font-medium">{row.id}</TableCell>
                <TableCell className="text-slate-300">{row.customer}</TableCell>
                <TableCell className="text-slate-300">{row.product}</TableCell>
                <TableCell className="text-slate-300 font-medium">{row.amount}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(row.status)} text-white`}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-400">{row.date}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
