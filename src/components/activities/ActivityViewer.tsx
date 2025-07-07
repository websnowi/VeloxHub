
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Calendar, 
  Filter, 
  Search,
  Users,
  Globe,
  Share2,
  Target,
  DollarSign,
  Clock,
  FileText,
  BarChart3,
  Settings,
  Layers
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type UserActivity = Database['public']['Tables']['user_activities']['Row'];

const activityIcons: Record<string, any> = {
  hr_management: Users,
  website_management: Globe,
  social_media_management: Share2,
  marketing_campaigns: Target,
  payroll_management: DollarSign,
  attendance_tracking: Clock,
  reports_generation: FileText,
  analytics_viewing: BarChart3,
  employee_management: Users,
  integration_management: Settings,
  dashboard_management: Layers
};

const activityColors: Record<string, string> = {
  hr_management: 'bg-blue-600',
  website_management: 'bg-green-600',
  social_media_management: 'bg-purple-600',
  marketing_campaigns: 'bg-orange-600',
  payroll_management: 'bg-emerald-600',
  attendance_tracking: 'bg-yellow-600',
  reports_generation: 'bg-cyan-600',
  analytics_viewing: 'bg-pink-600',
  employee_management: 'bg-indigo-600',
  integration_management: 'bg-gray-600',
  dashboard_management: 'bg-red-600'
};

export const ActivityViewer = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user]);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, selectedType, selectedAction]);

  const loadActivities = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Loading activities for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error loading activities:', error);
        throw error;
      }
      
      console.log('Loaded activities:', data);
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.resource_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(activity => activity.activity_type === selectedType);
    }

    if (selectedAction !== "all") {
      filtered = filtered.filter(activity => activity.activity_action === selectedAction);
    }

    setFilteredActivities(filtered);
  };

  const getActivityIcon = (type: string) => {
    const IconComponent = activityIcons[type] || Activity;
    return IconComponent;
  };

  const getActivityColor = (type: string) => {
    return activityColors[type] || 'bg-gray-600';
  };

  const formatActivityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatActivityAction = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading activities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            User Activities ({activities.length} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hr_management">HR Management</SelectItem>
                <SelectItem value="website_management">Website Management</SelectItem>
                <SelectItem value="social_media_management">Social Media</SelectItem>
                <SelectItem value="marketing_campaigns">Marketing</SelectItem>
                <SelectItem value="payroll_management">Payroll</SelectItem>
                <SelectItem value="employee_management">Employees</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="export">Export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activities Table */}
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {activities.length === 0 ? 'No Activities Yet' : 'No Activities Found'}
              </h3>
              <p className="text-slate-400">
                {activities.length === 0 
                  ? 'Start using the dashboard to see your activity history here.'
                  : 'No activities match your current filters.'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Action</TableHead>
                  <TableHead className="text-slate-300">Resource</TableHead>
                  <TableHead className="text-slate-300">Description</TableHead>
                  <TableHead className="text-slate-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.activity_type);
                  return (
                    <TableRow key={activity.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${getActivityColor(activity.activity_type)}/20`}>
                            <IconComponent className={`h-4 w-4 text-white`} />
                          </div>
                          <Badge className={`${getActivityColor(activity.activity_type)} text-white text-xs`}>
                            {formatActivityType(activity.activity_type)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {formatActivityAction(activity.activity_action)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {activity.resource_name || activity.resource_type || '-'}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {activity.description || '-'}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {format(new Date(activity.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
