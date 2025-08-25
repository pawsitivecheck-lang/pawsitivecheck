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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ArrowLeft, PlusCircle, Users, Heart, Baby, TrendingUp, DollarSign, 
  Edit, Trash2, Calendar, Weight, MapPin, Activity, Beef, Milk, 
  Egg, ShoppingCart, FileText, Search
} from "lucide-react";
import type { LivestockHerd, FarmAnimal, BreedingRecord, ProductionRecord, AnimalMovement } from "@shared/schema";

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
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get herd ID from URL
  const herdId = window.location.pathname.split('/').pop();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
            <Dialog open={isAddAnimalDialogOpen} onOpenChange={setIsAddAnimalDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" data-testid="button-add-animal">
                  <PlusCircle className="h-4 w-4" />
                  Add Animal
                </Button>
              </DialogTrigger>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="animals">Animals ({animals.length})</TabsTrigger>
            <TabsTrigger value="breeding">Breeding</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="movements">Movements</TabsTrigger>
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
                  <Button data-testid="button-add-production-record">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Production Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                  <p>No production records found</p>
                  <p className="text-sm mt-2">Start tracking production data for your herd</p>
                </div>
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