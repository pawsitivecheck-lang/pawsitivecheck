import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bell, Shield, Mail, Users, Package, AlertTriangle, Settings, Save } from "lucide-react";
import type { UserNotificationPreferences } from "@shared/schema";

export function NotificationPreferences() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['/api/user/notification-preferences'],
    enabled: isAuthenticated,
  }) as { data: UserNotificationPreferences | undefined, isLoading: boolean };

  const [formData, setFormData] = useState({
    emailNotifications: preferences?.emailNotifications ?? true,
    recallAlerts: preferences?.recallAlerts ?? true,
    safetyAlerts: preferences?.safetyAlerts ?? true,
    productUpdates: preferences?.productUpdates ?? false,
    communityUpdates: preferences?.communityUpdates ?? false,
    marketingEmails: preferences?.marketingEmails ?? false,
    dataRetentionDays: preferences?.dataRetentionDays ?? 365,
  });

  // Update form data when preferences load
  useState(() => {
    if (preferences) {
      setFormData({
        emailNotifications: preferences.emailNotifications,
        recallAlerts: preferences.recallAlerts,
        safetyAlerts: preferences.safetyAlerts,
        productUpdates: preferences.productUpdates,
        communityUpdates: preferences.communityUpdates,
        marketingEmails: preferences.marketingEmails,
        dataRetentionDays: preferences.dataRetentionDays,
      });
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: UserNotificationPreferences) => {
      return await apiRequest("/api/user/notification-preferences", "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/notification-preferences'] });
      toast({
        title: "Success",
        description: "Notification preferences updated successfully!",
      });
    },
    onError: (error) => {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferencesMutation.mutate(formData);
  };

  const handleSwitchChange = (key: keyof UserNotificationPreferences) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [key]: checked }));
  };

  const handleRetentionChange = (value: string) => {
    const days = parseInt(value) || 365;
    const clampedDays = Math.max(30, Math.min(2555, days)); // 30 days to 7 years
    setFormData(prev => ({ ...prev, dataRetentionDays: clampedDays }));
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading preferences...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow" data-testid="card-notification-preferences">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Critical Safety Alerts */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              Critical Safety Alerts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              These alerts help keep your pets safe and are recommended for all users.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between" data-testid="switch-recall-alerts">
                <div className="space-y-0.5">
                  <Label className="text-base">Product Recall Alerts</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified immediately when products you've saved are recalled
                  </div>
                </div>
                <Switch
                  checked={formData.recallAlerts}
                  onCheckedChange={handleSwitchChange('recallAlerts')}
                />
              </div>

              <div className="flex items-center justify-between" data-testid="switch-safety-alerts">
                <div className="space-y-0.5">
                  <Label className="text-base">Safety Alerts</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Important safety updates and ingredient warnings
                  </div>
                </div>
                <Switch
                  checked={formData.safetyAlerts}
                  onCheckedChange={handleSwitchChange('safetyAlerts')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Product & Community Updates */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              Product & Community Updates
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between" data-testid="switch-product-updates">
                <div className="space-y-0.5">
                  <Label className="text-base">Product Updates</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Changes to products in your saved lists or scan history
                  </div>
                </div>
                <Switch
                  checked={formData.productUpdates}
                  onCheckedChange={handleSwitchChange('productUpdates')}
                />
              </div>

              <div className="flex items-center justify-between" data-testid="switch-community-updates">
                <div className="space-y-0.5">
                  <Label className="text-base">Community Updates</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    New reviews, comments, and community discussions
                  </div>
                </div>
                <Switch
                  checked={formData.communityUpdates}
                  onCheckedChange={handleSwitchChange('communityUpdates')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Communication Preferences */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-green-500" />
              Communication Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between" data-testid="switch-email-notifications">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Receive notifications via email (required for critical alerts)
                  </div>
                </div>
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={handleSwitchChange('emailNotifications')}
                />
              </div>

              <div className="flex items-center justify-between" data-testid="switch-marketing-emails">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Communications</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Tips, feature updates, and promotional content
                  </div>
                </div>
                <Switch
                  checked={formData.marketingEmails}
                  onCheckedChange={handleSwitchChange('marketingEmails')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Retention */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4 text-purple-500" />
              Data Retention
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base">Auto-Delete Old Data After</Label>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Automatically delete scan history and non-critical data after this period (30-2555 days)
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="30"
                    max="2555"
                    value={formData.dataRetentionDays}
                    onChange={(e) => handleRetentionChange(e.target.value)}
                    className="w-24"
                    data-testid="input-data-retention"
                  />
                  <span className="text-sm text-gray-500">days</span>
                  <span className="text-xs text-gray-400 ml-2">
                    ({Math.round(formData.dataRetentionDays / 365 * 10) / 10} years)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit"
              disabled={updatePreferencesMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-save-preferences"
            >
              <Save className="h-4 w-4 mr-2" />
              {updatePreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}