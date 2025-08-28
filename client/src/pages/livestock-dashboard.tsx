import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Home, Users, Activity, TrendingUp, Eye, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LivestockOperation {
  id: number;
  operationName: string;
  operationType: string;
  totalHeadCount: number;
  primarySpecies: string[];
  city: string;
  state: string;
  isActive: boolean;
  createdAt: string;
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

export default function LivestockDashboard() {
  const [, navigate] = useLocation();
  const [selectedOperation, setSelectedOperation] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    operationName: "",
    operationType: "",
    city: "",
    state: "",
    totalHeadCount: "",
    primarySpecies: [] as string[]
  });
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use preview endpoints for non-authenticated users
  const operationsEndpoint = isAuthenticated ? '/api/livestock/operations' : '/api/preview/livestock/operations';
  const herdsEndpoint = isAuthenticated 
    ? `/api/livestock/operations/${selectedOperation}/herds`
    : `/api/preview/livestock/operations/${selectedOperation}/herds`;

  const { data: operations, isLoading: operationsLoading } = useQuery<LivestockOperation[]>({
    queryKey: [operationsEndpoint],
    enabled: !authLoading, // Don't fetch until we know auth status
  });

  const { data: herds, isLoading: herdsLoading } = useQuery<LivestockHerd[]>({
    queryKey: [herdsEndpoint],
    enabled: !!selectedOperation && !authLoading,
  });

  const createOperationMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Mutation called with data:", data);
      
      const response = await fetch('/api/livestock/operations', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Response error:", errorData);
        throw new Error(`Failed to create operation: ${errorData}`);
      }
      
      const result = await response.json();
      console.log("Success result:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [operationsEndpoint] });
      setShowCreateForm(false);
      setFormData({
        operationName: "",
        operationType: "",
        city: "",
        state: "",
        totalHeadCount: "",
        primarySpecies: []
      });
      toast({
        title: "Success!",
        description: "Livestock operation created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create livestock operation. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateOperation = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);
    console.log("Form validation check:");
    console.log("- operationName:", formData.operationName);
    console.log("- operationType:", formData.operationType); 
    console.log("- city:", formData.city);
    console.log("- state:", formData.state);
    
    // Validate required fields
    if (!formData.operationName || !formData.operationType || !formData.city || !formData.state) {
      console.log("Validation failed - missing required fields");
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Validation passed, proceeding with mutation...");
    
    // Get species based on operation type
    const getSpeciesForOperationType = (operationType: string): string[] => {
      switch (operationType) {
        case 'beef-cattle':
        case 'dairy-cattle':
          return ['cattle'];
        case 'swine':
          return ['pigs'];
        case 'poultry':
          return ['chickens'];
        case 'sheep-goat':
          return ['sheep', 'goats'];
        case 'mixed':
          return ['cattle', 'pigs', 'chickens'];
        default:
          return ['cattle'];
      }
    };
    
    const finalData = {
      ...formData,
      totalHeadCount: parseInt(formData.totalHeadCount) || 0,
      primarySpecies: getSpeciesForOperationType(formData.operationType),
    };
    
    console.log("Submitting operation data:", finalData);
    
    createOperationMutation.mutate(finalData);
  };

  if (operationsLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading livestock operations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasOperations = operations && operations.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Preview Mode Alert */}
      {!isAuthenticated && (
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950" data-testid="preview-mode-alert">
          <Eye className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Preview Mode:</strong> You're viewing sample data. 
            <Button 
              variant="link" 
              className="ml-2 p-0 h-auto text-blue-700 dark:text-blue-300 underline"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login-preview"
            >
              Sign in to manage your own livestock operations
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🐄 Livestock Management {!isAuthenticated && <span className="text-lg text-blue-600 dark:text-blue-400 font-normal">(Preview)</span>}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isAuthenticated 
              ? "Manage your farm operations, herds, feed, and health records"
              : "Explore livestock management features with sample data"
            }
          </p>
        </div>
        {hasOperations && (
          <Button 
            onClick={() => isAuthenticated ? navigate("/livestock") : window.location.href = "/api/login"}
            className="flex items-center gap-2"
            data-testid="button-add-operation"
            variant={isAuthenticated ? "default" : "outline"}
          >
            {isAuthenticated ? <PlusIcon className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {isAuthenticated ? "Manage Operations" : "Sign In to Add Operations"}
          </Button>
        )}
      </div>

      {!hasOperations ? (
        // Welcome/Empty State
        <div className="text-center py-12">
          <Home className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {isAuthenticated ? "Welcome to Livestock Management" : "Livestock Management Preview"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {isAuthenticated 
              ? "Get started by setting up your first livestock operation. Track herds, manage feed, monitor health, and ensure product safety."
              : "This feature allows farmers to track their operations, herds, feed management, and health records. Sign in to start managing your own livestock operation."
            }
          </p>
          {isAuthenticated ? (
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  className="flex items-center gap-2"
                  data-testid="button-create-first-operation"
                >
                  <PlusIcon className="h-5 w-5" />
                  Get Started with Livestock
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Livestock Operation</DialogTitle>
                  <DialogDescription>
                    Set up your first livestock operation to start tracking herds, feed, and health records.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateOperation} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="operationName">Operation Name</Label>
                    <Input
                      id="operationName"
                      value={formData.operationName}
                      onChange={(e) => setFormData({...formData, operationName: e.target.value})}
                      placeholder="My Farm"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="operationType">Operation Type</Label>
                    <Select value={formData.operationType} onValueChange={(value) => setFormData({...formData, operationType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beef-cattle">Beef Cattle</SelectItem>
                        <SelectItem value="dairy-cattle">Dairy Cattle</SelectItem>
                        <SelectItem value="swine">Swine</SelectItem>
                        <SelectItem value="poultry">Poultry</SelectItem>
                        <SelectItem value="sheep-goat">Sheep & Goat</SelectItem>
                        <SelectItem value="mixed">Mixed Operation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="totalHeadCount">Total Head Count</Label>
                    <Input
                      id="totalHeadCount"
                      type="number"
                      value={formData.totalHeadCount}
                      onChange={(e) => setFormData({...formData, totalHeadCount: e.target.value})}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                      disabled={createOperationMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createOperationMutation.isPending}
                    >
                      {createOperationMutation.isPending ? "Creating..." : "Create Operation"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <Button 
              onClick={() => window.location.href = "/api/login"}
              size="lg"
              className="flex items-center gap-2"
              variant="outline"
              data-testid="button-create-first-operation"
            >
              <LogIn className="h-5 w-5" />
              Sign In to Get Started
            </Button>
          )}
        </div>
      ) : (
        // Main Dashboard
        <div className="space-y-6">
          {/* Operations Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Operations
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {operations?.length || 0}
                    </p>
                  </div>
                  <Home className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Animals
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {operations?.reduce((sum, op) => sum + op.totalHeadCount, 0) || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
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
                      {herds?.length || 0}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Feed Records
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      -
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Operations List and Details */}
          <Tabs defaultValue="operations" className="space-y-4">
            <TabsList>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="herds" disabled={!selectedOperation}>Herds</TabsTrigger>
              <TabsTrigger value="feed" disabled={!selectedOperation}>
                🌾 Feed Tracking
              </TabsTrigger>
              <TabsTrigger value="health" disabled={!selectedOperation}>Health Records</TabsTrigger>
            </TabsList>

            <TabsContent value="operations">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {operations?.map((operation) => (
                  <Card 
                    key={operation.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedOperation === operation.id 
                        ? 'ring-2 ring-purple-500' 
                        : ''
                    }`}
                    onClick={() => setSelectedOperation(operation.id)}
                    data-testid={`card-operation-${operation.id}`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{operation.operationName}</CardTitle>
                          <CardDescription>
                            {operation.city}, {operation.state}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {operation.operationType}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Animals:</span> {operation.totalHeadCount}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {operation.primarySpecies.map((species) => (
                            <Badge key={species} variant="outline" className="text-xs">
                              {species}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Created: {new Date(operation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="herds">
              {selectedOperation ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Herds</h3>
                    <Button 
                      onClick={() => isAuthenticated ? navigate(`/livestock`) : window.location.href = "/api/login"}
                      size="sm"
                      data-testid="button-add-herd"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {isAuthenticated ? "Manage Herds" : "Sign In to Manage"}
                    </Button>
                  </div>
                  
                  {herdsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                  ) : herds && herds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {herds.map((herd) => (
                        <Card 
                          key={herd.id} 
                          className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                          onClick={() => isAuthenticated ? navigate(`/livestock/herds/${herd.id}`) : window.location.href = "/api/login"}
                          data-testid={`card-herd-${herd.id}`}
                        >
                          <CardHeader>
                            <CardTitle className="text-base">{herd.herdName}</CardTitle>
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
                                  isAuthenticated ? navigate(`/livestock/herds/${herd.id}`) : window.location.href = "/api/login";
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
                      <p className="text-gray-500 dark:text-gray-400">No herds found for this operation.</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => isAuthenticated ? navigate(`/livestock`) : window.location.href = "/api/login"}
                        data-testid="button-create-first-herd"
                      >
                        {isAuthenticated ? "Go to Livestock Management" : "Sign In to Manage"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Select an operation to view its herds
                </p>
              )}
            </TabsContent>

            <TabsContent value="feed">
              {selectedOperation ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">🌾 Feed Tracking</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Monitor feed consumption, costs, and nutrition across your herds
                      </p>
                    </div>
                    <Button 
                      onClick={() => isAuthenticated ? navigate(`/livestock/feed`) : window.location.href = "/api/login"}
                      data-testid="button-add-feed-record"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {isAuthenticated ? "Go to Feed Tracking" : "Sign In to Track Feed"}
                    </Button>
                  </div>

                  {/* Feed tracking will be implemented next */}
                  <Card>
                    <CardContent className="p-8 text-center">
                      <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Feed Tracking System</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Track feed types, quantities, costs, and nutrition for each herd
                      </p>
                      <Button 
                        onClick={() => isAuthenticated ? navigate(`/livestock/feed`) : window.location.href = "/api/login"}
                        data-testid="button-start-feed-tracking"
                      >
                        {isAuthenticated ? "Go to Feed Tracking" : "Sign In to Track Feed"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Select an operation to track feed
                </p>
              )}
            </TabsContent>

            <TabsContent value="health">
              {selectedOperation ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Health Records</h3>
                    <Button 
                      onClick={() => isAuthenticated ? navigate(`/livestock`) : window.location.href = "/api/login"}
                      size="sm"
                      data-testid="button-add-health-record"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {isAuthenticated ? "Manage Health" : "Sign In to Manage"}
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Activity className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Health Monitoring</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Track veterinary visits, treatments, and health events
                      </p>
                      <Button 
                        onClick={() => isAuthenticated ? navigate(`/livestock`) : window.location.href = "/api/login"}
                        data-testid="button-start-health-tracking"
                      >
                        {isAuthenticated ? "Go to Livestock Management" : "Sign In to Manage"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Select an operation to view health records
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}