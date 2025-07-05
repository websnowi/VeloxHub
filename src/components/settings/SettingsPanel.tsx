
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings, User, Trash2, Plus, Star, StarOff } from "lucide-react";

interface Dashboard {
  id: string;
  name: string;
  type: string;
  starred: boolean;
  created_at: string;
}

export const SettingsPanel = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadProfile();
      loadDashboards();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setUsername(data.username || '');
      setEmail(data.email || user.email || '');
    } else if (error && error.code !== 'PGRST116') {
      console.error('Error loading profile:', error);
    }
  };

  const loadDashboards = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('dashboards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setDashboards(data);
    } else if (error) {
      console.error('Error loading dashboards:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username,
          email,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!newPassword) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setNewPassword("");
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDashboard = async () => {
    if (!user || !newDashboardName.trim()) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('dashboards')
        .insert({
          user_id: user.id,
          name: newDashboardName.trim(),
          type: 'custom',
          config: {},
          starred: false
        });

      if (error) throw error;

      setNewDashboardName("");
      loadDashboards();
      toast({
        title: "Dashboard Created",
        description: "Your new dashboard has been created.",
      });
    } catch (error) {
      console.error('Error creating dashboard:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create dashboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDashboardStar = async (dashboardId: string, starred: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('dashboards')
        .update({ starred: !starred })
        .eq('id', dashboardId)
        .eq('user_id', user.id);

      if (error) throw error;

      loadDashboards();
      toast({
        title: starred ? "Removed from Favorites" : "Added to Favorites",
        description: `Dashboard ${starred ? 'removed from' : 'added to'} favorites.`,
      });
    } catch (error) {
      console.error('Error updating dashboard:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update dashboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteDashboard = async (dashboardId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('dashboards')
        .delete()
        .eq('id', dashboardId)
        .eq('user_id', user.id);

      if (error) throw error;

      loadDashboards();
      toast({
        title: "Dashboard Deleted",
        description: "Dashboard has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete dashboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Settings</h2>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="profile" className="text-slate-300 data-[state=active]:text-white">
            Profile Settings
          </TabsTrigger>
          <TabsTrigger value="dashboards" className="text-slate-300 data-[state=active]:text-white">
            Dashboard Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="Enter your username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <Button
                onClick={updateProfile}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>

              <div className="border-t border-slate-600 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="Enter new password"
                      minLength={6}
                    />
                  </div>
                  <Button
                    onClick={updatePassword}
                    disabled={loading || !newPassword}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-6">
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:text-red-300 hover:bg-red-600/10"
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboards" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Dashboard Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Enter dashboard name"
                />
                <Button
                  onClick={createDashboard}
                  disabled={loading || !newDashboardName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>

              <div className="space-y-3">
                {dashboards.map((dashboard) => (
                  <Card key={dashboard.id} className="bg-slate-700/30 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{dashboard.name}</h4>
                          <p className="text-sm text-slate-400 capitalize">{dashboard.type} dashboard</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleDashboardStar(dashboard.id, dashboard.starred)}
                            className="text-slate-400 hover:text-yellow-400"
                          >
                            {dashboard.starred ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-4 w-4" />}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-400 hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-800 border-slate-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete Dashboard</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                  Are you sure you want to delete "{dashboard.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteDashboard(dashboard.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {dashboards.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-400">No custom dashboards created yet.</p>
                    <p className="text-sm text-slate-500">Create your first dashboard above.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
