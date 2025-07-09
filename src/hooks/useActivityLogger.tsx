
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ActivityData {
  activityType: string;
  activityAction: string;
  resourceType?: string;
  resourceId?: string;
  resourceName?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export const useActivityLogger = () => {
  const { user } = useAuth();

  const logActivity = async (activityData: ActivityData) => {
    if (!user) {
      console.warn('Cannot log activity: user not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityData.activityType,
          activity_action: activityData.activityAction,
          resource_type: activityData.resourceType || null,
          resource_name: activityData.resourceName || null,
          description: activityData.description || null,
          metadata: activityData.metadata || null,
        });

      if (error) {
        console.error('Error logging activity:', error);
        throw error;
      }

      console.log('Activity logged successfully:', activityData);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  return { logActivity };
};
