
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type ActivityType = 
  | 'hr_management'
  | 'website_management'
  | 'social_media_management'
  | 'marketing_campaigns'
  | 'payroll_management'
  | 'attendance_tracking'
  | 'reports_generation'
  | 'analytics_viewing'
  | 'employee_management'
  | 'integration_management'  
  | 'dashboard_management';

type ActivityAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'export'
  | 'import'
  | 'login'
  | 'logout'
  | 'connect'
  | 'disconnect'
  | 'publish'
  | 'schedule'
  | 'approve'
  | 'reject';

interface LogActivityParams {
  activityType: ActivityType;
  activityAction: ActivityAction;
  resourceType?: string;
  resourceId?: string;
  resourceName?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export const useActivityLogger = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const logActivity = async ({
    activityType,
    activityAction,
    resourceType,
    resourceId,
    resourceName,
    description,
    metadata = {}
  }: LogActivityParams) => {
    if (!user) {
      console.log('No user found, skipping activity log');
      return;
    }

    try {
      console.log('Logging activity:', {
        activityType,
        activityAction,
        resourceType,
        resourceId,
        resourceName,
        description,
        metadata
      });

      const { error } = await supabase.rpc('log_user_activity', {
        p_activity_type: activityType,
        p_activity_action: activityAction,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_resource_name: resourceName,
        p_description: description,
        p_metadata: metadata
      });

      if (error) {
        console.error('Error logging activity:', error);
        throw error;
      }

      console.log('Activity logged successfully');
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return { logActivity };
};
