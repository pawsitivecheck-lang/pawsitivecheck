import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isUnauthorizedError } from "@/lib/authUtils";
import ThemeToggle from "@/components/theme-toggle";
import { 
  ArrowLeft, PlusCircle, Users, Home, TrendingUp, DollarSign, 
  Edit, Trash2, Calendar, Weight, MapPin, Activity, Beef, Milk, 
  Egg, ShoppingCart, FileText, Search, Stethoscope
} from "lucide-react";

interface LivestockOperation {
  id: number;
  operationName: string;
  operationType: string;
  totalHeadCount: number;
  primarySpecies: string[];
  city: string;
  state: string;
  address?: string;
  zipCode?: string;
  certifications?: string[];
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LivestockHerd {
  id: number;
  operationId: number;
  herdName: string;
  species: string;
  breed?: string;
  headCount: number;
  averageWeight?: string;
  weightUnit: string;
  purpose: string;
  housingType: string;
  isActive: boolean;
}

export default function OperationProfile() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddHerdDialogOpen, setIsAddHerdDialogOpen] = useState(false);
  
  // Get operation ID from URL
  const operationId = window.location.pathname.split('/').pop();

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  const { data: operation, isLoading: operationLoading } = useQuery<LivestockOperation>({
    queryKey: [`/api/livestock/operations/${operationId}`],
    enabled: !!operationId && isAuthenticated,
  });

  const { data: herds = [], isLoading: herdsLoading } = useQuery<LivestockHerd[]>({
    queryKey: [`/api/livestock/operations/${operationId}/herds`],
    enabled: !!operationId && isAuthenticated,
  });

  const createHerdMutation = useMutation({
    mutationFn: async (herdData: any) => {
      return await apiRequest("/api/livestock/herds", "POST", herdData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/livestock/operations/${operationId}/herds`] });
      setIsAddHerdDialogOpen(false);
      toast({
        title: "Success",
        description: "Herd created successfully!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create herd. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitHerd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const herdData = {
      operationId: parseInt(operationId!),
      herdName: formData.get('herdName'),
      species: formData.get('species'),
      breed: formData.get('breed') || undefined,
      headCount: parseInt(formData.get('headCount') as string) || 0,
      averageWeight: formData.get('averageWeight') || undefined,
      weightUnit: formData.get('weightUnit') || 'lbs',
      purpose: formData.get('purpose'),
      housingType: formData.get('housingType'),
      ageRange: formData.get('ageRange') || undefined,
      notes: formData.get('notes') || undefined,
    };

    createHerdMutation.mutate(herdData);
  };

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case 'cattle':
        return <Beef className="h-5 w-5" />;
      case 'dairy':
        return <Milk className="h-5 w-5" />;
      case 'poultry':
        return <Egg className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getOperationTypeDisplay = (type: string) => {
    switch (type) {
      case 'beef-cattle':
        return 'Beef Cattle';
      case 'dairy-cattle':
        return 'Dairy Cattle';
      case 'sheep-goat':
        return 'Sheep & Goat';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getTotalHerdCount = () => {
    return herds.reduce((total, herd) => total + herd.headCount, 0);
  };

  const getAverageHerdSize = () => {
    if (herds.length === 0) return 0;
    return Math.round(getTotalHerdCount() / herds.length);
  };

  if (authLoading || operationLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!operation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Operation not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested livestock operation could not be found.
          </p>
          <Button onClick={() => navigate("/livestock")}>
            Back to Livestock Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-xl">
                  {operation.operationName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Home className="h-8 w-8" />
                  {operation.operationName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {getOperationTypeDisplay(operation.operationType)}
                  </Badge>
                  <Badge variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    {operation.city}, {operation.state}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(true)}
              data-testid="button-edit-operation"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Operation
            </Button>
            <Dialog open={isAddHerdDialogOpen} onOpenChange={setIsAddHerdDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" data-testid="button-add-herd">
                  <PlusCircle className="h-4 w-4" />
                  Add Herd
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Herd to {operation.operationName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitHerd}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div>
                      <Label htmlFor="herdName">Herd Name *</Label>
                      <Input name="herdName" placeholder="Main Herd" required />
                    </div>
                    <div>
                      <Label htmlFor="species">Species *</Label>
                      <Select name="species" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cattle">Cattle</SelectItem>
                          <SelectItem value="pigs">Pigs</SelectItem>
                          <SelectItem value="chickens">Chickens</SelectItem>
                          <SelectItem value="sheep">Sheep</SelectItem>
                          <SelectItem value="goats">Goats</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="breed">Breed</Label>
                      <Input name="breed" placeholder="Breed (optional)" />
                    </div>
                    <div>
                      <Label htmlFor="headCount">Head Count *</Label>
                      <Input name="headCount" type="number" placeholder="0" required />
                    </div>
                    <div>
                      <Label htmlFor="purpose">Purpose *</Label>
                      <Select name="purpose" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breeding">Breeding</SelectItem>
                          <SelectItem value="dairy">Dairy</SelectItem>
                          <SelectItem value="meat">Meat</SelectItem>
                          <SelectItem value="show">Show</SelectItem>
                          <SelectItem value="working">Working</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="housingType">Housing Type *</Label>
                      <Select name="housingType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select housing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pasture">Pasture</SelectItem>
                          <SelectItem value="barn">Barn</SelectItem>
                          <SelectItem value="feedlot">Feedlot</SelectItem>
                          <SelectItem value="free-range">Free Range</SelectItem>
                          <SelectItem value="confinement">Confinement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="averageWeight">Average Weight</Label>
                      <Input name="averageWeight" type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div>
                      <Label htmlFor="weightUnit">Weight Unit</Label>
                      <Select name="weightUnit">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea name="notes" placeholder="Additional notes about this herd..." rows={3} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddHerdDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createHerdMutation.isPending}
                      data-testid="button-save-herd"
                    >
                      {createHerdMutation.isPending ? "Creating..." : "Create Herd"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Animals
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {operation.totalHeadCount}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Herds
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {herds.length}
                  </p>
                </div>
                <Home className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Herd Size
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getAverageHerdSize()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Species Count
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {operation.primarySpecies.length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="herds">Herds ({herds.length})</TabsTrigger>
            <TabsTrigger value="feed">Feed Tracking</TabsTrigger>
            <TabsTrigger value="health">Health Records</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Operation Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</p>
                        <p className="text-lg font-semibold">{getOperationTypeDisplay(operation.operationType)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Animals</p>
                        <p className="text-lg font-semibold">{operation.totalHeadCount}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</p>
                        <p className="text-lg font-semibold">{operation.city}, {operation.state}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</p>
                        <p className="text-lg font-semibold">{new Date(operation.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Primary Species</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {operation.primarySpecies.map((species) => (
                          <Badge key={species} variant="outline">
                            {species}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {operation.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{operation.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No recent activity</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="herds" className="space-y-6">
            {herdsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : herds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {herds.map((herd) => (
                  <Card
                    key={herd.id}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/livestock/herds/${herd.id}`)}
                    data-testid={`card-herd-${herd.id}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        {getSpeciesIcon(herd.species)}
                        {herd.herdName}
                      </CardTitle>
                      <CardDescription>
                        {herd.species} {herd.breed && `• ${herd.breed}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Count:</span> {herd.headCount}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Purpose:</span> {herd.purpose}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Housing:</span> {herd.housingType}
                        </p>
                        {herd.averageWeight && (
                          <p className="text-sm">
                            <span className="font-medium">Avg Weight:</span>{" "}
                            {herd.averageWeight} {herd.weightUnit}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/livestock/herds/${herd.id}`);
                          }}
                          data-testid={`button-manage-herd-${herd.id}`}
                        >
                          Manage Herd
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No herds yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start organizing your livestock by creating your first herd.
                </p>
                <Button 
                  onClick={() => setIsAddHerdDialogOpen(true)}
                  data-testid="button-create-first-herd"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create First Herd
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="feed" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Feed Tracking System</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Track feed types, quantities, costs, and nutrition for each herd
                </p>
                <Button 
                  onClick={() => navigate(`/livestock/feed`)}
                  data-testid="button-start-feed-tracking"
                >
                  Go to Feed Tracking
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Stethoscope className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Health Management</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Monitor animal health, vaccinations, and veterinary care
                </p>
                <Button 
                  variant="outline"
                  data-testid="button-start-health-tracking"
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}