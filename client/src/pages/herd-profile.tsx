import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link, useParams } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isUnauthorizedError } from "@/lib/authUtils";
import ThemeToggle from "@/components/theme-toggle";
import { 
  ArrowLeft, PlusCircle, Users, Heart, Baby, TrendingUp, DollarSign, 
  Edit, Trash2, Calendar, Weight, MapPin, Activity, Beef, Milk, 
  Egg, ShoppingCart, FileText, Search, Stethoscope, Wheat, Package
} from "lucide-react";
import type { LivestockHerd, FarmAnimal, BreedingRecord, ProductionRecord, AnimalMovement, FeedManagement, InsertFeedManagement, LivestockHealthRecord, InsertLivestockHealthRecord, InsertProductionRecord } from "@shared/schema";

interface HerdProfileProps {
  herdId: string;
}

export default function HerdProfile() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAnimal, setSelectedAnimal] = useState<FarmAnimal | null>(null);
  const [isAddAnimalDialogOpen, setIsAddAnimalDialogOpen] = useState(false);
  const [isEditHerdDialogOpen, setIsEditHerdDialogOpen] = useState(false);
  const [isAddFeedDialogOpen, setIsAddFeedDialogOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<FeedManagement | null>(null);
  const [isAddHealthDialogOpen, setIsAddHealthDialogOpen] = useState(false);
  const [editingHealth, setEditingHealth] = useState<LivestockHealthRecord | null>(null);
  const [isAddProductionDialogOpen, setIsAddProductionDialogOpen] = useState(false);
  const [editingProduction, setEditingProduction] = useState<ProductionRecord | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAnimalTracking, setShowAnimalTracking] = useState(false);
  
  // Get herd ID from URL
  const params = useParams();
  const herdId = params.id;

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

  const { data: herd, isLoading: herdLoading } = useQuery<LivestockHerd>({
    queryKey: ["/api/livestock/herds", herdId],
    enabled: !!herdId && isAuthenticated,
  });

  const { data: animals = [], isLoading: animalsLoading } = useQuery<FarmAnimal[]>({
    queryKey: ["/api/livestock/herds", herdId, "animals"],
    enabled: !!herdId && isAuthenticated,
  });

  const { data: breedingRecords = [], isLoading: breedingLoading } = useQuery<BreedingRecord[]>({
    queryKey: ["/api/breeding-records"],
    enabled: !!herdId && isAuthenticated,
  });

  const { data: productionRecords = [], isLoading: productionLoading } = useQuery<ProductionRecord[]>({
    queryKey: ["/api/production-records"],
    enabled: !!herdId && isAuthenticated,
  });

  const { data: feedRecords = [], isLoading: feedLoading } = useQuery<FeedManagement[]>({
    queryKey: ["/api/livestock/herds", herdId, "feeds"],
    enabled: !!herdId && isAuthenticated,
  });

  const { data: healthRecords = [], isLoading: healthLoading } = useQuery<LivestockHealthRecord[]>({
    queryKey: ["/api/livestock/herds", herdId, "health-records"],
    enabled: !!herdId && isAuthenticated,
  });

  const createAnimalMutation = useMutation({
    mutationFn: async (animalData: any) => {
      return await apiRequest("/api/farm-animals", "POST", animalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/livestock/herds", herdId, "animals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/livestock/herds", herdId] });
      setIsAddAnimalDialogOpen(false);
      toast({
        title: "Success",
        description: "Animal added to herd successfully!",
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
        description: "Failed to add animal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createFeedMutation = useMutation({
    mutationFn: async (feedData: InsertFeedManagement) => {
      return await apiRequest("/api/livestock/feeds", "POST", feedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/livestock/herds", herdId, "feeds"] });
      setIsAddFeedDialogOpen(false);
      setEditingFeed(null);
      toast({
        title: "Success",
        description: "Feed record added successfully!",
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
        description: "Failed to add feed record. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateFeedMutation = useMutation({
    mutationFn: async ({ id, ...feedData }: { id: number } & Partial<InsertFeedManagement>) => {
      return await apiRequest(`/api/livestock/feeds/${id}`, "PUT", feedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/livestock/herds", herdId, "feeds"] });
      setEditingFeed(null);
      toast({
        title: "Success",
        description: "Feed record updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update feed record. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteFeedMutation = useMutation({
    mutationFn: async (feedId: number) => {
      return await apiRequest(`/api/livestock/feeds/${feedId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/livestock/herds", herdId, "feeds"] });
      toast({
        title: "Success",
        description: "Feed record deleted successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete feed record. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Health record mutations
  const createHealthMutation = useMutation({
    mutationFn: async (healthData: InsertLivestockHealthRecord) => {
      return await apiRequest("/api/livestock/health-records", "POST", healthData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/livestock/herds", herdId, "health-records"] });
      setIsAddHealthDialogOpen(false);
      setEditingHealth(null);
      toast({
        title: "Success",
        description: "Health record added successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to add health record. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateHealthMutation = useMutation({
    mutationFn: async ({ id, ...healthData }: { id: number } & InsertLivestockHealthRecord) => {
      return await apiRequest(`/api/livestock/health-records/${id}`, "PUT", healthData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/livestock/herds", herdId, "health-records"] });
      setIsAddHealthDialogOpen(false);
      setEditingHealth(null);
      toast({
        title: "Success",
        description: "Health record updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update health record. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteHealthMutation = useMutation({
    mutationFn: async (healthId: number) => {
      return await apiRequest(`/api/livestock/health-records/${healthId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/livestock/herds", herdId, "health-records"] });
      toast({
        title: "Success",
        description: "Health record deleted successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete health record. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Production record mutations
  const createProductionMutation = useMutation({
    mutationFn: async (productionData: InsertProductionRecord) => {
      return await apiRequest("/api/production-records", "POST", productionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production-records"] });
      setIsAddProductionDialogOpen(false);
      setEditingProduction(null);
      toast({
        title: "Success",
        description: "Production record added successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to add production record. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProductionMutation = useMutation({
    mutationFn: async ({ id, ...productionData }: { id: number } & InsertProductionRecord) => {
      return await apiRequest(`/api/production-records/${id}`, "PUT", productionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production-records"] });
      setIsAddProductionDialogOpen(false);
      setEditingProduction(null);
      toast({
        title: "Success",
        description: "Production record updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update production record. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProductionMutation = useMutation({
    mutationFn: async (productionId: number) => {
      return await apiRequest(`/api/production-records/${productionId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production-records"] });
      toast({
        title: "Success",
        description: "Production record deleted successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete production record. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitAnimal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const animalData = {
      herdId: parseInt(herdId!),
      name: formData.get('name') || undefined,
      earTag: formData.get('earTag') || undefined,
      microchipId: formData.get('microchipId') || undefined,
      species: herd?.species || formData.get('species'),
      breed: formData.get('breed') || undefined,
      gender: formData.get('gender'),
      birthDate: formData.get('birthDate') || undefined,
      birthWeight: formData.get('birthWeight') ? parseFloat(formData.get('birthWeight') as string) : undefined,
      currentWeight: formData.get('currentWeight') ? parseFloat(formData.get('currentWeight') as string) : undefined,
      weightUnit: formData.get('weightUnit') || 'lbs',
      purpose: formData.get('purpose') || 'meat',
      acquisitionDate: formData.get('acquisitionDate') || undefined,
      acquisitionType: formData.get('acquisitionType') || 'born_on_farm',
      acquisitionCost: formData.get('acquisitionCost') ? parseFloat(formData.get('acquisitionCost') as string) : undefined,
      isBreeder: formData.get('isBreeder') === 'true',
      notes: formData.get('notes') || undefined,
    };

    createAnimalMutation.mutate(animalData);
  };

  const handleSubmitFeed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const feedData: InsertFeedManagement = {
      herdId: parseInt(herdId!),
      userId: user!.id,
      feedType: formData.get('feedType') as string,
      feedName: formData.get('feedName') as string,
      supplier: formData.get('supplier') as string || null,
      quantityPerFeeding: formData.get('quantityPerFeeding') ? formData.get('quantityPerFeeding') as string : null,
      quantityUnit: formData.get('quantityUnit') as string || 'lbs',
      feedingsPerDay: parseInt(formData.get('feedingsPerDay') as string) || 1,
      costPerUnit: formData.get('costPerUnit') ? formData.get('costPerUnit') as string : null,
      lastPurchaseDate: formData.get('lastPurchaseDate') ? new Date(formData.get('lastPurchaseDate') as string) : null,
      currentStock: formData.get('currentStock') ? formData.get('currentStock') as string : null,
      stockUnit: formData.get('stockUnit') as string || 'lbs',
      notes: formData.get('notes') as string || null,
    };

    if (editingFeed) {
      updateFeedMutation.mutate({ id: editingFeed.id, ...feedData });
    } else {
      createFeedMutation.mutate(feedData);
    }
  };

  const handleSubmitHealth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const healthData: InsertLivestockHealthRecord = {
      herdId: parseInt(herdId!),
      userId: user!.id,
      recordDate: formData.get("recordDate") ? new Date(formData.get("recordDate") as string) : new Date(),
      animalCount: parseInt(formData.get("animalCount") as string) || 1,
      healthIssue: formData.get("healthIssue") as string || null,
      treatment: formData.get("treatment") as string || null,
      medicationUsed: formData.get("medicationUsed") as string || null,
      withdrawalPeriod: formData.get("withdrawalPeriod") ? parseInt(formData.get("withdrawalPeriod") as string) : null,
      veterinarian: formData.get("veterinarian") as string || null,
      treatmentCost: formData.get("treatmentCost") ? formData.get("treatmentCost") as string : null,
      followUpRequired: formData.get("followUpRequired") === "true",
      followUpDate: formData.get("followUpDate") ? new Date(formData.get("followUpDate") as string) : null,
      notes: formData.get("notes") as string || null,
    };

    if (editingHealth) {
      updateHealthMutation.mutate({ id: editingHealth.id, ...healthData });
    } else {
      createHealthMutation.mutate(healthData);
    }
  };

  const handleSubmitProduction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productionData: InsertProductionRecord = {
      herdId: parseInt(herdId!),
      userId: user!.id,
      recordDate: formData.get("recordDate") ? new Date(formData.get("recordDate") as string) : new Date(),
      productType: formData.get("productType") as string,
      quantity: formData.get("quantity") ? formData.get("quantity") as string : null,
      quantityUnit: formData.get("quantityUnit") as string || 'lbs',
      qualityGrade: formData.get("qualityGrade") as string || null,
      marketPrice: formData.get("marketPrice") ? formData.get("marketPrice") as string : null,
      totalValue: formData.get("totalValue") ? formData.get("totalValue") as string : null,
      buyer: formData.get("buyer") as string || null,
      notes: formData.get("notes") as string || null,
    };

    if (editingProduction) {
      updateProductionMutation.mutate({ id: editingProduction.id, ...productionData });
    } else {
      createProductionMutation.mutate(productionData);
    }
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

  const getGenderBadgeColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'female':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTotalHerdValue = () => {
    return animals.reduce((total, animal) => {
      return total + (Number(animal.acquisitionCost) || 0);
    }, 0);
  };

  const getAverageWeight = () => {
    const animalsWithWeight = animals.filter(animal => animal.currentWeight);
    if (animalsWithWeight.length === 0) return 0;
    return animalsWithWeight.reduce((total, animal) => total + (Number(animal.currentWeight) || 0), 0) / animalsWithWeight.length;
  };

  const getBreedingFemales = () => {
    return animals.filter(animal => animal.isBreeder && animal.gender === 'female').length;
  };

  const getPregnantAnimals = () => {
    return animals.filter(animal => animal.expectedCalvingDate).length;
  };

  if (authLoading || herdLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!herd) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Herd not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested herd could not be found.
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
                  {herd.herdName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  {getSpeciesIcon(herd.species)}
                  {herd.herdName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {herd.species} {herd.breed && `• ${herd.breed}`}
                  </Badge>
                  <Badge variant="outline">
                    {herd.purpose}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditHerdDialogOpen(true)}
              data-testid="button-edit-herd"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Herd
            </Button>
            
            <Button 
              onClick={() => setIsAddFeedDialogOpen(true)}
              className="flex items-center gap-2"
              data-testid="button-add-feed"
            >
              <Wheat className="h-4 w-4" />
              Manage Feed
            </Button>
            
            {showAnimalTracking ? (
              <Button 
                onClick={() => setIsAddAnimalDialogOpen(true)}
                variant="outline" 
                className="flex items-center gap-2" 
                data-testid="button-add-animal"
              >
                <PlusCircle className="h-4 w-4" />
                Add Animal
              </Button>
            ) : (
              <Button 
                onClick={() => setShowAnimalTracking(true)}
                variant="outline"
                className="flex items-center gap-2"
                data-testid="button-enable-animal-tracking"
              >
                <Users className="h-4 w-4" />
                Track Individual Animals (Optional)
              </Button>
            )}
          </div>
        </div>

        
        {/* Add Animal Dialog */}
        {showAnimalTracking && (
          <Dialog open={isAddAnimalDialogOpen} onOpenChange={setIsAddAnimalDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Animal to {herd.herdName}</DialogTitle>
              </DialogHeader>
                <form onSubmit={handleSubmitAnimal}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div>
                      <Label htmlFor="name">Name (Optional)</Label>
                      <Input name="name" placeholder="Animal name" />
                    </div>
                    <div>
                      <Label htmlFor="earTag">Ear Tag</Label>
                      <Input name="earTag" placeholder="e.g., 001, A123" />
                    </div>
                    <div>
                      <Label htmlFor="microchipId">Microchip ID</Label>
                      <Input name="microchipId" placeholder="15-digit microchip number" />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select name="gender" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="castrated">Castrated</SelectItem>
                          <SelectItem value="spayed">Spayed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="breed">Breed</Label>
                      <Input name="breed" placeholder="Animal breed" defaultValue={herd.breed || ""} />
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <Input name="birthDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="currentWeight">Current Weight</Label>
                      <Input name="currentWeight" type="number" step="0.01" placeholder="0.00" />
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
                    <div>
                      <Label htmlFor="purpose">Purpose</Label>
                      <Select name="purpose">
                        <SelectTrigger>
                          <SelectValue />
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
                      <Label htmlFor="acquisitionType">Acquisition Type</Label>
                      <Select name="acquisitionType">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="born_on_farm">Born on Farm</SelectItem>
                          <SelectItem value="purchased">Purchased</SelectItem>
                          <SelectItem value="gift">Gift</SelectItem>
                          <SelectItem value="trade">Trade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="acquisitionCost">Acquisition Cost ($)</Label>
                      <Input name="acquisitionCost" type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div>
                      <Label htmlFor="isBreeder">Is Breeder?</Label>
                      <Select name="isBreeder">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">No</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea name="notes" placeholder="Additional notes about this animal..." rows={3} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddAnimalDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createAnimalMutation.isPending}
                      data-testid="button-save-animal"
                    >
                      {createAnimalMutation.isPending ? "Saving..." : "Add Animal"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        )}

        {/* Feed Management Dialog */}
        <Dialog open={isAddFeedDialogOpen} onOpenChange={setIsAddFeedDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingFeed ? 'Edit Feed Record' : 'Add Feed Record'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitFeed}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="feedType">Feed Type *</Label>
                  <Select name="feedType" required defaultValue={editingFeed?.feedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feed type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grain">Grain</SelectItem>
                      <SelectItem value="hay">Hay</SelectItem>
                      <SelectItem value="silage">Silage</SelectItem>
                      <SelectItem value="supplement">Supplement</SelectItem>
                      <SelectItem value="concentrate">Concentrate</SelectItem>
                      <SelectItem value="mineral">Mineral Mix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="feedName">Feed Name *</Label>
                  <Input name="feedName" placeholder="e.g., Corn Silage, Alfalfa Hay" required defaultValue={editingFeed?.feedName} />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input name="supplier" placeholder="Feed supplier name" defaultValue={editingFeed?.supplier || ""} />
                </div>
                <div>
                  <Label htmlFor="quantityPerFeeding">Quantity per Feeding</Label>
                  <Input name="quantityPerFeeding" type="number" step="0.01" placeholder="0.00" defaultValue={editingFeed?.quantityPerFeeding || ""} />
                </div>
                <div>
                  <Label htmlFor="quantityUnit">Unit</Label>
                  <Select name="quantityUnit" defaultValue={editingFeed?.quantityUnit || 'lbs'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="bushels">Bushels</SelectItem>
                      <SelectItem value="bales">Bales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="feedingsPerDay">Feedings per Day</Label>
                  <Input name="feedingsPerDay" type="number" placeholder="1" defaultValue={editingFeed?.feedingsPerDay || 1} />
                </div>
                <div>
                  <Label htmlFor="costPerUnit">Cost per Unit ($)</Label>
                  <Input name="costPerUnit" type="number" step="0.01" placeholder="0.00" defaultValue={editingFeed?.costPerUnit || ""} />
                </div>
                <div>
                  <Label htmlFor="lastPurchaseDate">Last Purchase Date</Label>
                  <Input name="lastPurchaseDate" type="date" defaultValue={editingFeed?.lastPurchaseDate ? new Date(editingFeed.lastPurchaseDate).toISOString().split('T')[0] : ""} />
                </div>
                <div>
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input name="currentStock" type="number" step="0.01" placeholder="0.00" defaultValue={editingFeed?.currentStock || ""} />
                </div>
                <div>
                  <Label htmlFor="stockUnit">Stock Unit</Label>
                  <Select name="stockUnit" defaultValue={editingFeed?.stockUnit || 'lbs'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="bushels">Bushels</SelectItem>
                      <SelectItem value="bales">Bales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea name="notes" placeholder="Additional feed notes..." defaultValue={editingFeed?.notes || ""} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsAddFeedDialogOpen(false);
                  setEditingFeed(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createFeedMutation.isPending || updateFeedMutation.isPending}
                  data-testid="button-save-feed"
                >
                  {(createFeedMutation.isPending || updateFeedMutation.isPending) ? "Saving..." : (editingFeed ? "Update Feed" : "Add Feed")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Health Record Dialog */}
        <Dialog open={isAddHealthDialogOpen} onOpenChange={setIsAddHealthDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingHealth ? 'Edit Health Record' : 'Add Health Record'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitHealth}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="recordDate">Record Date *</Label>
                  <Input name="recordDate" type="date" required defaultValue={editingHealth?.recordDate ? new Date(editingHealth.recordDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <Label htmlFor="animalCount">Number of Animals *</Label>
                  <Input name="animalCount" type="number" min="1" required defaultValue={editingHealth?.animalCount || animals.length || 1} />
                </div>
                <div>
                  <Label htmlFor="healthIssue">Health Issue</Label>
                  <Input name="healthIssue" placeholder="e.g., Vaccination, Injury, Illness" defaultValue={editingHealth?.healthIssue || ""} />
                </div>
                <div>
                  <Label htmlFor="veterinarian">Veterinarian</Label>
                  <Input name="veterinarian" placeholder="Veterinarian name" defaultValue={editingHealth?.veterinarian || ""} />
                </div>
                <div>
                  <Label htmlFor="medicationUsed">Medication Used</Label>
                  <Input name="medicationUsed" placeholder="Medication name" defaultValue={editingHealth?.medicationUsed || ""} />
                </div>
                <div>
                  <Label htmlFor="withdrawalPeriod">Withdrawal Period (days)</Label>
                  <Input name="withdrawalPeriod" type="number" placeholder="0" defaultValue={editingHealth?.withdrawalPeriod || ""} />
                </div>
                <div>
                  <Label htmlFor="treatmentCost">Treatment Cost ($)</Label>
                  <Input name="treatmentCost" type="number" step="0.01" placeholder="0.00" defaultValue={editingHealth?.treatmentCost || ""} />
                </div>
                <div>
                  <Label htmlFor="followUpRequired">Follow-up Required</Label>
                  <Select name="followUpRequired" defaultValue={editingHealth?.followUpRequired ? "true" : "false"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input name="followUpDate" type="date" defaultValue={editingHealth?.followUpDate ? new Date(editingHealth.followUpDate).toISOString().split('T')[0] : ""} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="treatment">Treatment Description</Label>
                  <Textarea name="treatment" placeholder="Describe the treatment given..." defaultValue={editingHealth?.treatment || ""} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea name="notes" placeholder="Additional health notes..." defaultValue={editingHealth?.notes || ""} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsAddHealthDialogOpen(false);
                  setEditingHealth(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createHealthMutation.isPending || updateHealthMutation.isPending}
                  data-testid="button-save-health"
                >
                  {(createHealthMutation.isPending || updateHealthMutation.isPending) ? "Saving..." : (editingHealth ? "Update Record" : "Add Record")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Production Record Dialog */}
        <Dialog open={isAddProductionDialogOpen} onOpenChange={setIsAddProductionDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduction ? 'Edit Production Record' : 'Add Production Record'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitProduction}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="recordDate">Record Date *</Label>
                  <Input name="recordDate" type="date" required defaultValue={editingProduction?.recordDate ? new Date(editingProduction.recordDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <Label htmlFor="productType">Product Type *</Label>
                  <Select name="productType" required defaultValue={editingProduction?.productType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="milk">Milk</SelectItem>
                      <SelectItem value="eggs">Eggs</SelectItem>
                      <SelectItem value="wool">Wool</SelectItem>
                      <SelectItem value="meat">Meat</SelectItem>
                      <SelectItem value="leather">Leather</SelectItem>
                      <SelectItem value="manure">Manure</SelectItem>
                      <SelectItem value="offspring">Offspring</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input name="quantity" type="number" step="0.01" placeholder="0.00" defaultValue={editingProduction?.quantity || ""} />
                </div>
                <div>
                  <Label htmlFor="quantityUnit">Unit</Label>
                  <Select name="quantityUnit" defaultValue={editingProduction?.quantityUnit || 'lbs'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="gallons">Gallons</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                      <SelectItem value="dozens">Dozens</SelectItem>
                      <SelectItem value="head">Head</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="qualityGrade">Quality Grade</Label>
                  <Select name="qualityGrade" defaultValue={editingProduction?.qualityGrade || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="grade_a">Grade A</SelectItem>
                      <SelectItem value="grade_b">Grade B</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="free_range">Free Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="marketPrice">Market Price ($/unit)</Label>
                  <Input name="marketPrice" type="number" step="0.01" placeholder="0.00" defaultValue={editingProduction?.marketPrice || ""} />
                </div>
                <div>
                  <Label htmlFor="totalValue">Total Value ($)</Label>
                  <Input name="totalValue" type="number" step="0.01" placeholder="0.00" defaultValue={editingProduction?.totalValue || ""} />
                </div>
                <div>
                  <Label htmlFor="buyer">Buyer/Customer</Label>
                  <Input name="buyer" placeholder="Buyer or customer name" defaultValue={editingProduction?.buyer || ""} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea name="notes" placeholder="Additional production notes..." defaultValue={editingProduction?.notes || ""} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsAddProductionDialogOpen(false);
                  setEditingProduction(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createProductionMutation.isPending || updateProductionMutation.isPending}
                  data-testid="button-save-production"
                >
                  {(createProductionMutation.isPending || updateProductionMutation.isPending) ? "Saving..." : (editingProduction ? "Update Record" : "Add Record")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
                    {animals.length}
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
                    Herd Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${getTotalHerdValue().toFixed(2)}
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
                    Breeding Females
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getBreedingFemales()}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Weight
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getAverageWeight().toFixed(0)} {herd.weightUnit}
                  </p>
                </div>
                <Weight className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${showAnimalTracking ? 'grid-cols-6' : 'grid-cols-5'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="feed">Feed Management</TabsTrigger>
            {showAnimalTracking && <TabsTrigger value="animals">Animals ({animals.length})</TabsTrigger>}
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="breeding">Breeding</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Herd Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Species</p>
                        <p className="text-lg font-semibold">{herd.species}</p>
                      </div>
                      {herd.breed && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Breed</p>
                          <p className="text-lg font-semibold">{herd.breed}</p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Purpose</p>
                        <p className="text-lg font-semibold capitalize">{herd.purpose}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Housing</p>
                        <p className="text-lg font-semibold">{herd.housingType}</p>
                      </div>
                    </div>
                    {herd.ageRange && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Age Range</p>
                        <p className="text-lg font-semibold">{herd.ageRange}</p>
                      </div>
                    )}
                    {herd.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{herd.notes}</p>
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

          <TabsContent value="feed" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Herd Feed Management</CardTitle>
                    <CardDescription>Manage feed records and nutrition for the entire herd</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsAddFeedDialogOpen(true)}
                    data-testid="button-add-feed-record"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Add Feed Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {feedLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : feedRecords.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feedRecords.map((feed) => (
                      <Card 
                        key={feed.id} 
                        className="hover:shadow-lg transition-all duration-300"
                        data-testid={`card-feed-${feed.id}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <Wheat className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{feed.feedName}</CardTitle>
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  {feed.feedType}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingFeed(feed);
                                  setIsAddFeedDialogOpen(true);
                                }}
                                data-testid={`button-edit-feed-${feed.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteFeedMutation.mutate(feed.id)}
                                data-testid={`button-delete-feed-${feed.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {feed.supplier && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Supplier:</span>
                                <span>{feed.supplier}</span>
                              </div>
                            )}
                            {feed.quantityPerFeeding && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Per Feeding:</span>
                                <span>{feed.quantityPerFeeding} {feed.quantityUnit}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Daily Feedings:</span>
                              <span>{feed.feedingsPerDay}</span>
                            </div>
                            {feed.costPerUnit && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Cost:</span>
                                <span>${feed.costPerUnit}/{feed.quantityUnit}</span>
                              </div>
                            )}
                            {feed.currentStock && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Stock:</span>
                                <Badge variant="outline">
                                  {feed.currentStock} {feed.stockUnit}
                                </Badge>
                              </div>
                            )}
                            {feed.notes && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-gray-500 dark:text-gray-400">{feed.notes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wheat className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No Feed Records
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start tracking feed for your herd to monitor nutrition and costs.
                    </p>
                    <Button 
                      onClick={() => setIsAddFeedDialogOpen(true)}
                      className="flex items-center gap-2"
                      data-testid="button-add-first-feed"
                    >
                      <Package className="h-4 w-4" />
                      Add First Feed Record
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {showAnimalTracking && (
            <TabsContent value="animals" className="space-y-6">
            {animalsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : animals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {animals.map((animal) => (
                  <Card
                    key={animal.id}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedAnimal(animal)}
                    data-testid={`card-animal-${animal.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={animal.profileImageUrl || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                              {animal.name ? animal.name.slice(0, 2).toUpperCase() : animal.earTag?.slice(0, 2) || "AN"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {animal.name || `Tag: ${animal.earTag || "No Tag"}`}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getGenderBadgeColor(animal.gender)}>
                                {animal.gender}
                              </Badge>
                              {animal.isBreeder && (
                                <Badge variant="outline">
                                  <Heart className="h-3 w-3 mr-1" />
                                  Breeder
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {animal.breed && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Breed:</span>
                            <span>{animal.breed}</span>
                          </div>
                        )}
                        {animal.currentWeight && (
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4" />
                            <span>{animal.currentWeight} {animal.weightUnit}</span>
                          </div>
                        )}
                        {animal.birthDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(animal.birthDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {animal.purpose && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Purpose:</span>
                            <span className="capitalize">{animal.purpose}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No animals yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Add individual animals to start tracking breeding, production, and health
                  </p>
                  <Button
                    onClick={() => setIsAddAnimalDialogOpen(true)}
                    className="flex items-center gap-2"
                    data-testid="button-add-first-animal"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add First Animal
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Health & Medical Records</CardTitle>
                    <CardDescription>Veterinary care, vaccinations, and health monitoring</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsAddHealthDialogOpen(true)}
                    data-testid="button-add-health-record"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Health Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Vaccination Schedule */}
                  <Card className="border-green-200 dark:border-green-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-base">Vaccinations</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <span className="text-sm font-medium">Core Vaccines</span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Up to date</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                          <span className="text-sm font-medium">Annual Boosters</span>
                          <Badge variant="outline">Due Soon</Badge>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          View Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Health Monitoring */}
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base">Health Monitoring</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Body Score</span>
                          <span className="font-medium">7.2/9</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Last Health Check</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">2 weeks ago</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Health Alerts</span>
                          <Badge variant="outline">None</Badge>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          Record Check
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Veterinary Care */}
                  <Card className="border-purple-200 dark:border-purple-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-base">Veterinary Care</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Last Vet Visit</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">3 months ago</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Active Treatments</span>
                          <Badge variant="outline">None</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Next Checkup</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Due in 1 month</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          Schedule Visit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Health Records */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Health Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {healthLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    ) : healthRecords.length > 0 ? (
                      <div className="space-y-4">
                        {healthRecords.map((record) => (
                          <Card key={record.id} className="border-l-4 border-l-blue-500" data-testid={`card-health-${record.id}`}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Stethoscope className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-base">
                                      {record.healthIssue || 'Health Record'}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {new Date(record.recordDate).toLocaleDateString()} • {record.animalCount} animal{record.animalCount > 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setEditingHealth(record);
                                      setIsAddHealthDialogOpen(true);
                                    }}
                                    data-testid={`button-edit-health-${record.id}`}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => deleteHealthMutation.mutate(record.id)}
                                    data-testid={`button-delete-health-${record.id}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {record.veterinarian && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Veterinarian:</span>
                                    <span>{record.veterinarian}</span>
                                  </div>
                                )}
                                {record.medicationUsed && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Medication:</span>
                                    <span>{record.medicationUsed}</span>
                                  </div>
                                )}
                                {record.treatmentCost && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Cost:</span>
                                    <span>${record.treatmentCost}</span>
                                  </div>
                                )}
                                {record.withdrawalPeriod && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Withdrawal:</span>
                                    <span>{record.withdrawalPeriod} days</span>
                                  </div>
                                )}
                                {record.followUpRequired && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Follow-up:</span>
                                    <Badge variant="outline">
                                      {record.followUpDate ? new Date(record.followUpDate).toLocaleDateString() : 'Required'}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              {record.treatment && (
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Treatment:</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{record.treatment}</p>
                                </div>
                              )}
                              {record.notes && (
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Notes:</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{record.notes}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Stethoscope className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <p>No health records found</p>
                        <p className="text-sm mt-2">Start tracking health and medical care for your animals</p>
                        <Button 
                          onClick={() => setIsAddHealthDialogOpen(true)}
                          className="mt-4"
                          data-testid="button-add-first-health"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add First Health Record
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breeding" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Breeding Records</CardTitle>
                    <CardDescription>Track breeding activities and pregnancies</CardDescription>
                  </div>
                  <Button data-testid="button-add-breeding-record">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Breeding Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Baby className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                  <p>No breeding records found</p>
                  <p className="text-sm mt-2">Start tracking breeding activities for your herd</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Production Records</CardTitle>
                    <CardDescription>Track milk, eggs, wool, and other production</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsAddProductionDialogOpen(true)}
                    data-testid="button-add-production-record"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Production Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {productionRecords?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productionRecords.map((record) => (
                      <Card 
                        key={record.id} 
                        className="hover:shadow-lg transition-all duration-300"
                        data-testid={`card-production-${record.id}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                                {record.productType === 'milk' && <Milk className="h-6 w-6 text-white" />}
                                {record.productType === 'eggs' && <Egg className="h-6 w-6 text-white" />}
                                {record.productType === 'meat' && <Beef className="h-6 w-6 text-white" />}
                                {!['milk', 'eggs', 'meat'].includes(record.productType) && <Package className="h-6 w-6 text-white" />}
                              </div>
                              <div>
                                <CardTitle className="text-lg capitalize">{record.productType}</CardTitle>
                                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                  {new Date(record.recordDate).toLocaleDateString()}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingProduction(record);
                                  setIsAddProductionDialogOpen(true);
                                }}
                                data-testid={`button-edit-production-${record.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteProductionMutation.mutate(record.id)}
                                data-testid={`button-delete-production-${record.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {record.quantity && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Quantity:</span>
                                <span>{record.quantity} {record.quantityUnit}</span>
                              </div>
                            )}
                            {record.qualityGrade && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Grade:</span>
                                <Badge variant="outline" className="capitalize">
                                  {record.qualityGrade.replace('_', ' ')}
                                </Badge>
                              </div>
                            )}
                            {record.marketPrice && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Price:</span>
                                <span>${record.marketPrice}/{record.quantityUnit}</span>
                              </div>
                            )}
                            {record.totalValue && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Total Value:</span>
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  ${record.totalValue}
                                </Badge>
                              </div>
                            )}
                            {record.buyer && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Buyer:</span>
                                <span>{record.buyer}</span>
                              </div>
                            )}
                            {record.notes && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-gray-500 dark:text-gray-400">{record.notes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No Production Records
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start tracking production like milk yield, egg count, or wool harvest.
                    </p>
                    <Button 
                      onClick={() => setIsAddProductionDialogOpen(true)}
                      className="flex items-center gap-2"
                      data-testid="button-add-first-production"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Add First Production Record
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Animal Movements</CardTitle>
                    <CardDescription>Track sales, transfers, and animal movements</CardDescription>
                  </div>
                  <Button data-testid="button-add-movement-record">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Movement Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                  <p>No movement records found</p>
                  <p className="text-sm mt-2">Track animal sales, transfers, and movements</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Animal Detail Dialog */}
        <Dialog open={!!selectedAnimal} onOpenChange={() => setSelectedAnimal(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            {selectedAnimal && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedAnimal.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xl">
                          {selectedAnimal.name ? selectedAnimal.name.slice(0, 2).toUpperCase() : selectedAnimal.earTag?.slice(0, 2) || "AN"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <DialogTitle className="text-2xl">
                          {selectedAnimal.name || `Tag: ${selectedAnimal.earTag || "No Tag"}`}
                        </DialogTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getGenderBadgeColor(selectedAnimal.gender)}>
                            {selectedAnimal.gender}
                          </Badge>
                          {selectedAnimal.isBreeder && (
                            <Badge variant="outline">
                              <Heart className="h-3 w-3 mr-1" />
                              Breeder
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid="button-edit-animal"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid="button-delete-animal"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Basic Information</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400">Species:</span>
                            <span className="ml-2">{selectedAnimal.species}</span>
                          </div>
                          {selectedAnimal.breed && (
                            <div>
                              <span className="font-medium text-gray-600 dark:text-gray-400">Breed:</span>
                              <span className="ml-2">{selectedAnimal.breed}</span>
                            </div>
                          )}
                          {selectedAnimal.earTag && (
                            <div>
                              <span className="font-medium text-gray-600 dark:text-gray-400">Ear Tag:</span>
                              <span className="ml-2">{selectedAnimal.earTag}</span>
                            </div>
                          )}
                          {selectedAnimal.microchipId && (
                            <div>
                              <span className="font-medium text-gray-600 dark:text-gray-400">Microchip:</span>
                              <span className="ml-2">{selectedAnimal.microchipId}</span>
                            </div>
                          )}
                          {selectedAnimal.birthDate && (
                            <div>
                              <span className="font-medium text-gray-600 dark:text-gray-400">Birth Date:</span>
                              <span className="ml-2">{new Date(selectedAnimal.birthDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Physical & Status</h4>
                        <div className="space-y-3 text-sm">
                          {selectedAnimal.currentWeight && (
                            <div>
                              <span className="font-medium text-gray-600 dark:text-gray-400">Weight:</span>
                              <span className="ml-2">{selectedAnimal.currentWeight} {selectedAnimal.weightUnit}</span>
                            </div>
                          )}
                          {selectedAnimal.purpose && (
                            <div>
                              <span className="font-medium text-gray-600 dark:text-gray-400">Purpose:</span>
                              <span className="ml-2 capitalize">{selectedAnimal.purpose}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                            <span className="ml-2 capitalize">{selectedAnimal.status}</span>
                          </div>
                          {selectedAnimal.acquisitionCost && (
                            <div>
                              <span className="font-medium text-gray-600 dark:text-gray-400">Value:</span>
                              <span className="ml-2">${selectedAnimal.acquisitionCost}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedAnimal.notes && (
                      <div>
                        <h4 className="font-semibold mb-2">Notes</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          {selectedAnimal.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}