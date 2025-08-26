import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PlusIcon, Edit2, Trash2, TrendingUp, DollarSign, Wheat } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FeedRecord {
  id: number;
  petId: number;
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

interface PetFeedTrackingProps {
  petId: number;
  petName: string;
  species: string;
}

export default function PetFeedTracking({ petId, petName, species }: PetFeedTrackingProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddingFeed, setIsAddingFeed] = useState(false);
  const [editingFeed, setEditingFeed] = useState<FeedRecord | null>(null);

  const { data: feedRecords, isLoading: feedsLoading } = useQuery<FeedRecord[]>({
    queryKey: ['/api/pets', petId, 'feeds'],
    enabled: !!petId,
  });

  const createFeedMutation = useMutation({
    mutationFn: (feedData: any) => apiRequest('/api/pets/feeds', {
      method: 'POST',
      body: JSON.stringify(feedData),
    }),
    onSuccess: () => {
      toast({ title: "Feed record created successfully" });
      setIsAddingFeed(false);
      queryClient.invalidateQueries({ queryKey: ['/api/pets', petId, 'feeds'] });
    },
    onError: () => {
      toast({ title: "Failed to create feed record", variant: "destructive" });
    }
  });

  const updateFeedMutation = useMutation({
    mutationFn: ({ id, ...feedData }: any) => apiRequest(`/api/pets/feeds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feedData),
    }),
    onSuccess: () => {
      toast({ title: "Feed record updated successfully" });
      setEditingFeed(null);
      queryClient.invalidateQueries({ queryKey: ['/api/pets', petId, 'feeds'] });
    },
    onError: () => {
      toast({ title: "Failed to update feed record", variant: "destructive" });
    }
  });

  const deleteFeedMutation = useMutation({
    mutationFn: (feedId: number) => apiRequest(`/api/pets/feeds/${feedId}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      toast({ title: "Feed record deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/pets', petId, 'feeds'] });
    },
    onError: () => {
      toast({ title: "Failed to delete feed record", variant: "destructive" });
    }
  });

  const handleSubmitFeed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const feedData = {
      petId: petId,
      feedType: formData.get('feedType'),
      feedName: formData.get('feedName'),
      supplier: formData.get('supplier') || undefined,
      quantityPerFeeding: formData.get('quantityPerFeeding') || undefined,
      quantityUnit: formData.get('quantityUnit') || 'cups',
      feedingsPerDay: parseInt(formData.get('feedingsPerDay') as string) || 2,
      costPerUnit: formData.get('costPerUnit') || undefined,
      lastPurchaseDate: formData.get('lastPurchaseDate') || undefined,
      currentStock: formData.get('currentStock') || undefined,
      stockUnit: formData.get('stockUnit') || 'cups',
      withdrawalPeriod: formData.get('withdrawalPeriod') ? parseInt(formData.get('withdrawalPeriod') as string) : undefined,
      notes: formData.get('notes') || undefined,
    };

    if (editingFeed) {
      updateFeedMutation.mutate({ id: editingFeed.id, ...feedData });
    } else {
      createFeedMutation.mutate(feedData);
    }
  };

  const getPetFeedTypes = (species: string) => {
    const baseTypes = ['kibble', 'wet_food', 'treats', 'supplement'];
    
    if (['dog', 'cat'].includes(species.toLowerCase())) {
      return [...baseTypes, 'raw_food', 'dental_chews'];
    } else if (['bird', 'chicken', 'duck', 'turkey'].includes(species.toLowerCase())) {
      return ['seed', 'pellets', 'treats', 'supplement', 'grit'];
    } else if (['rabbit', 'guinea_pig', 'hamster'].includes(species.toLowerCase())) {
      return ['pellets', 'hay', 'treats', 'supplement'];
    } else if (['fish'].includes(species.toLowerCase())) {
      return ['flakes', 'pellets', 'frozen_food', 'live_food'];
    } else {
      return ['grain', 'hay', 'pellets', 'treats', 'supplement'];
    }
  };

  const getDefaultUnits = (species: string) => {
    if (['dog', 'cat', 'bird', 'rabbit', 'guinea_pig', 'hamster'].includes(species.toLowerCase())) {
      return ['cups', 'oz', 'grams', 'pieces'];
    } else if (['fish'].includes(species.toLowerCase())) {
      return ['pinches', 'grams', 'pieces'];
    } else {
      return ['lbs', 'kg', 'cups', 'bushels'];
    }
  };

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

  const feedTypes = getPetFeedTypes(species);
  const defaultUnits = getDefaultUnits(species);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">🍽️ Feed Tracking for {petName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor feeding schedule, costs, and nutrition
          </p>
        </div>
        <Dialog open={isAddingFeed} onOpenChange={setIsAddingFeed}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-pet-feed">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Feed
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmitFeed}>
              <DialogHeader>
                <DialogTitle>Add Feed Record</DialogTitle>
                <DialogDescription>
                  Add a new feed type for {petName}
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
                      {feedTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="feedName">Feed Name *</Label>
                  <Input
                    name="feedName"
                    placeholder="e.g., Blue Buffalo Adult, Hill's Science Diet"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="supplier">Brand/Supplier</Label>
                  <Input
                    name="supplier"
                    placeholder="Feed brand or supplier"
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
                      {defaultUnits.map(unit => (
                        <SelectItem key={unit} value={unit}>
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </SelectItem>
                      ))}
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
                  data-testid="button-save-pet-feed"
                >
                  {createFeedMutation.isPending ? "Saving..." : "Save Feed"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      {feedRecords && feedRecords.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    {totalDailyFeed.toFixed(1)} {feedRecords[0]?.quantityUnit || 'units'}
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
      )}

      {/* Feed Records */}
      <Card>
        <CardHeader>
          <CardTitle>Feed Records</CardTitle>
          <CardDescription>Track different feed types for {petName}</CardDescription>
        </CardHeader>
        <CardContent>
          {feedsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : feedRecords && feedRecords.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {feedRecords.map((feed) => (
                <Card key={feed.id} data-testid={`card-pet-feed-${feed.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{feed.feedName}</CardTitle>
                        <CardDescription>
                          <Badge variant="secondary" className="mr-2">
                            {feed.feedType.replace('_', ' ')}
                          </Badge>
                          {feed.supplier}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingFeed(feed)}
                          data-testid={`button-edit-pet-feed-${feed.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteFeedMutation.mutate(feed.id)}
                          data-testid={`button-delete-pet-feed-${feed.id}`}
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
              <Wheat className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No feed records found for {petName}</p>
              <Button onClick={() => setIsAddingFeed(true)} data-testid="button-create-first-pet-feed">
                Add First Feed Record
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}