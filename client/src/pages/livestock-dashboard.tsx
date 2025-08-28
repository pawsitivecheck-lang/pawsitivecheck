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
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  // Header and footer are properly implemented
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

  const { data: operations, isLoading: operationsLoading } = useQuery<LivestockOperation[]>({
    queryKey: [operationsEndpoint],
    enabled: !authLoading, // Don't fetch until we know auth status
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading livestock operations...
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasOperations = operations && operations.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
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
            onClick={() => isAuthenticated ? navigate("/livestock/create") : window.location.href = "/api/login"}
            className="flex items-center gap-2"
            data-testid="button-add-operation"
            variant={isAuthenticated ? "default" : "outline"}
          >
            {isAuthenticated ? <PlusIcon className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {isAuthenticated ? "Add New Operation" : "Sign In to Add Operations"}
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
            <Button 
              onClick={() => navigate("/livestock/create")}
              size="lg"
              className="flex items-center gap-2"
              data-testid="button-create-first-operation"
            >
              <PlusIcon className="h-5 w-5" />
              Get Started with Livestock
            </Button>
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
                      0
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
            </TabsList>

            <TabsContent value="operations">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {operations?.map((operation) => (
                  <Card 
                    key={operation.id}
                    className="cursor-pointer transition-all hover:shadow-lg"
                    onClick={() => isAuthenticated ? navigate(`/livestock/operations/${operation.id}`) : window.location.href = "/api/login"}
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

          </Tabs>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
}