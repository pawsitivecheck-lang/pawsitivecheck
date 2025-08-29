import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PlusIcon, Edit2, Trash2, TrendingUp, DollarSign, Wheat, Eye, LogIn } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ThemeToggle from "@/components/theme-toggle";

interface FeedRecord {
  id: number;
  herdId: number;
  feedType: string;
  feedName: string;
  supplier?: string;
  quantityPerFeeding?: string;
  quantityUnit: string;
  feedingsPerDay: number;
  costPerUnit?: string;
  lastPurchaseDate?: string;
  currentStock?: string;
  stockUnit: string;
  nutritionAnalysis?: any;
  medications?: string[];
  withdrawalPeriod?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

interface LivestockHerd {
  id: number;
  herdName: string;
  species: string;
  headCount: number;
}

export default function FeedTracking() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedHerd, setSelectedHerd] = useState<number | null>(null);
  const [isAddingFeed, setIsAddingFeed] = useState(false);
  const [editingFeed, setEditingFeed] = useState<FeedRecord | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Get operation ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const operationId = urlParams.get('operation');

  // Use preview endpoints for non-authenticated users
  const herdsEndpoint = isAuthenticated 
    ? `/api/livestock/operations/${operationId}/herds`
    : `/api/preview/livestock/operations/${operationId}/herds`;
  const feedsEndpoint = isAuthenticated
    ? `/api/livestock/herds/${selectedHerd}/feeds`
    : `/api/preview/livestock/herds/${selectedHerd}/feeds`;

  const { data: herds } = useQuery<LivestockHerd[]>({
    queryKey: [herdsEndpoint],
    enabled: !!operationId && !authLoading,
  });

  const { data: feedRecords, isLoading: feedsLoading } = useQuery<FeedRecord[]>({
    queryKey: [feedsEndpoint],
    enabled: !!selectedHerd && !authLoading,
  });

  const createFeedMutation = useMutation({
    mutationFn: (feedData: any) => {
      const endpoint = isAuthenticated ? '/api/livestock/feeds' : '/api/preview/livestock/feeds';
      return apiRequest('POST', endpoint, feedData);
    },
    onSuccess: () => {
      const message = isAuthenticated ? "Feed record created successfully" : "Preview mode: Feed record not actually saved";
      toast({ title: message });
      setIsAddingFeed(false);
      queryClient.invalidateQueries({ queryKey: [feedsEndpoint] });
    },
    onError: () => {
      toast({ title: "Failed to create feed record", variant: "destructive" });
    }
  });

  const updateFeedMutation = useMutation({
    mutationFn: ({ id, ...feedData }: any) => {
      const endpoint = isAuthenticated ? `/api/livestock/feeds/${id}` : `/api/preview/livestock/feeds/${id}`;
      return apiRequest('PUT', endpoint, feedData);
    },
    onSuccess: () => {
      const message = isAuthenticated ? "Feed record updated successfully" : "Preview mode: Changes not actually saved";
      toast({ title: message });
      setEditingFeed(null);
      queryClient.invalidateQueries({ queryKey: [feedsEndpoint] });
    },
    onError: () => {
      toast({ title: "Failed to update feed record", variant: "destructive" });
    }
  });

  const deleteFeedMutation = useMutation({
    mutationFn: (feedId: number) => {
      const endpoint = isAuthenticated ? `/api/livestock/feeds/${feedId}` : `/api/preview/livestock/feeds/${feedId}`;
      return apiRequest('DELETE', endpoint);
    },
    onSuccess: () => {
      const message = isAuthenticated ? "Feed record deleted successfully" : "Preview mode: Record not actually deleted";
      toast({ title: message });
      queryClient.invalidateQueries({ queryKey: [feedsEndpoint] });
    },
    onError: () => {
      toast({ title: "Failed to delete feed record", variant: "destructive" });
    }
  });

  const handleSubmitFeed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const feedData = {
      herdId: selectedHerd,
      feedType: formData.get('feedType'),
      feedName: formData.get('feedName'),
      supplier: formData.get('supplier') || undefined,
      quantityPerFeeding: formData.get('quantityPerFeeding') || undefined,
      quantityUnit: formData.get('quantityUnit') || 'lbs',
      feedingsPerDay: parseInt(formData.get('feedingsPerDay') as string) || 2,
      costPerUnit: formData.get('costPerUnit') || undefined,
      lastPurchaseDate: formData.get('lastPurchaseDate') || undefined,
      currentStock: formData.get('currentStock') || undefined,
      stockUnit: formData.get('stockUnit') || 'lbs',
      withdrawalPeriod: formData.get('withdrawalPeriod') ? parseInt(formData.get('withdrawalPeriod') as string) : undefined,
      notes: formData.get('notes') || undefined,
    };

    if (editingFeed) {
      updateFeedMutation.mutate({ id: editingFeed.id, ...feedData });
    } else {
      createFeedMutation.mutate(feedData);
    }
  };

  if (!operationId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">No operation selected</p>
      </div>
    );
  }

  // Calculate totals
  const totalDailyCost = feedRecords?.reduce((total, feed) => {
    const cost = parseFloat(feed.costPerUnit || '0');
    const quantity = parseFloat(feed.quantityPerFeeding || '0');
    return total + (cost * quantity * feed.feedingsPerDay);
  }, 0) || 0;

  const totalDailyFeed = feedRecords?.reduce((total, feed) => {
    const quantity = parseFloat(feed.quantityPerFeeding || '0');
    return total + (quantity * feed.feedingsPerDay);
  }, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Preview Mode Alert */}
      {!isAuthenticated && (
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950" data-testid="preview-mode-alert">
          <Eye className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Preview Mode:</strong> You're viewing sample feed tracking data. 
            <Button 
              variant="link" 
              className="ml-2 p-0 h-auto text-blue-700 dark:text-blue-300 underline"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login-preview"
            >
              Sign in to manage your own feed tracking
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/livestock')}
          data-testid="button-back-to-livestock"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Livestock
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            🌾 Feed Tracking {!isAuthenticated && <span className="text-lg text-blue-600 dark:text-blue-400 font-normal">(Preview)</span>}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isAuthenticated 
              ? "Monitor feed consumption, costs, and nutrition"
              : "Explore feed tracking features with sample data"
            }
          </p>
        </div>
      </div>

      {/* Herd Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Herd</CardTitle>
          <CardDescription>Choose a herd to track feed for</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedHerd?.toString() || ""} onValueChange={(value) => setSelectedHerd(parseInt(value))}>
            <SelectTrigger data-testid="select-herd">
              <SelectValue placeholder="Select a herd to track feed" />
            </SelectTrigger>
            <SelectContent>
              {herds?.map((herd) => (
                <SelectItem key={herd.id} value={herd.id.toString()}>
                  {herd.herdName} - {herd.species} ({herd.headCount} animals)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedHerd && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Daily Feed Cost
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${totalDailyCost.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Daily Feed Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalDailyFeed.toFixed(1)} lbs
                    </p>
                  </div>
                  <Wheat className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Feed Types
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {feedRecords?.length || 0}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feed Records */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Feed Records</CardTitle>
                  <CardDescription>Track different feed types for this herd</CardDescription>
                </div>
                <Dialog open={isAddingFeed} onOpenChange={setIsAddingFeed}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-feed">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Feed
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <form onSubmit={handleSubmitFeed}>
                      <DialogHeader>
                        <DialogTitle>Add Feed Record</DialogTitle>
                        <DialogDescription>
                          Add a new feed type for tracking
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div>
                          <Label htmlFor="feedType">Feed Type *</Label>
                          <Select name="feedType" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select feed type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grain">Grain</SelectItem>
                              <SelectItem value="grass">Grass</SelectItem>
                              <SelectItem value="hay">Hay</SelectItem>
                              <SelectItem value="silage">Silage</SelectItem>
                              <SelectItem value="supplement">Supplement</SelectItem>
                              <SelectItem value="concentrate">Concentrate</SelectItem>
                              <SelectItem value="roughage">Roughage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="feedName">Feed Name *</Label>
                          <Input
                            name="feedName"
                            placeholder="e.g., Alfalfa Hay, Corn Feed"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="supplier">Supplier</Label>
                          <Input
                            name="supplier"
                            placeholder="Feed supplier name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="quantityPerFeeding">Quantity per Feeding</Label>
                          <Input
                            name="quantityPerFeeding"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="quantityUnit">Quantity Unit</Label>
                          <Select name="quantityUnit">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                              <SelectItem value="kg">Kilograms (kg)</SelectItem>
                              <SelectItem value="bushels">Bushels</SelectItem>
                              <SelectItem value="tons">Tons</SelectItem>
                              <SelectItem value="tray">Tray</SelectItem>
                              <SelectItem value="half_tray">Half Tray</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="feedingsPerDay">Feedings per Day</Label>
                          <Input
                            name="feedingsPerDay"
                            type="number"
                            min="1"
                            defaultValue="2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="costPerUnit">Cost per Unit ($)</Label>
                          <Input
                            name="costPerUnit"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="currentStock">Current Stock</Label>
                          <Input
                            name="currentStock"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                          />
                        </div>

                        <div>
                          <Label htmlFor="withdrawalPeriod">Withdrawal Period (days)</Label>
                          <Input
                            name="withdrawalPeriod"
                            type="number"
                            min="0"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="lastPurchaseDate">Last Purchase Date</Label>
                          <Input
                            name="lastPurchaseDate"
                            type="date"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            name="notes"
                            placeholder="Additional notes about this feed..."
                            rows={3}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddingFeed(false)}>
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createFeedMutation.isPending}
                          data-testid="button-save-feed"
                        >
                          {createFeedMutation.isPending ? "Saving..." : "Save Feed"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {feedsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : feedRecords && feedRecords.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {feedRecords.map((feed) => (
                    <Card key={feed.id} data-testid={`card-feed-${feed.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{feed.feedName}</CardTitle>
                            <CardDescription>
                              <Badge variant="secondary" className="mr-2">
                                {feed.feedType}
                              </Badge>
                              {feed.supplier}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingFeed(feed)}
                              data-testid={`button-edit-feed-${feed.id}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteFeedMutation.mutate(feed.id)}
                              data-testid={`button-delete-feed-${feed.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {feed.quantityPerFeeding && (
                            <p>
                              <span className="font-medium">Quantity:</span>{" "}
                              {feed.quantityPerFeeding} {feed.quantityUnit} × {feed.feedingsPerDay}/day
                            </p>
                          )}
                          {feed.costPerUnit && (
                            <p>
                              <span className="font-medium">Cost:</span> ${feed.costPerUnit}/{feed.quantityUnit}
                              {feed.quantityPerFeeding && (
                                <span className="text-green-600 ml-2">
                                  (${(parseFloat(feed.costPerUnit) * parseFloat(feed.quantityPerFeeding) * feed.feedingsPerDay).toFixed(2)}/day)
                                </span>
                              )}
                            </p>
                          )}
                          {feed.currentStock && (
                            <p>
                              <span className="font-medium">Stock:</span>{" "}
                              {feed.currentStock} {feed.stockUnit}
                            </p>
                          )}
                          {feed.withdrawalPeriod && (
                            <p>
                              <span className="font-medium">Withdrawal:</span>{" "}
                              {feed.withdrawalPeriod} days
                            </p>
                          )}
                          {feed.notes && (
                            <p className="text-gray-600 dark:text-gray-400">
                              {feed.notes}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wheat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No feed records found for this herd</p>
                  <Button onClick={() => setIsAddingFeed(true)} data-testid="button-create-first-feed">
                    Add First Feed Record
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}