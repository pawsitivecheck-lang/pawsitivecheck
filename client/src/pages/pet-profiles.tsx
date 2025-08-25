import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PetForm } from "@/components/pet-form";
import { SavedProductsList } from "@/components/saved-products-list";
import { isUnauthorizedError } from "@/lib/authUtils";
import { PlusCircle, Heart, Dog, Cat, Bird, Fish, Calendar, Weight, Stethoscope, Edit, Trash2 } from "lucide-react";
import type { PetProfile, SavedProduct } from "@shared/schema";

export default function PetProfiles() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
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

  const { data: pets = [], isLoading: isPetsLoading } = useQuery({
    queryKey: ["/api/pets"],
    enabled: isAuthenticated,
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
      }
    },
  });

  const createPetMutation = useMutation({
    mutationFn: async (petData: any) => {
      return await apiRequest("/api/pets", "POST", petData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Pet profile created successfully!",
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
        description: "Failed to create pet profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: async ({ id, ...petData }: any) => {
      return await apiRequest(`/api/pets/${id}`, "PUT", petData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      setIsEditDialogOpen(false);
      setSelectedPet(null);
      toast({
        title: "Success",
        description: "Pet profile updated successfully!",
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
        description: "Failed to update pet profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/pets/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "Success",
        description: "Pet profile deleted successfully.",
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
        description: "Failed to delete pet profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case 'dog':
        return <Dog className="h-5 w-5" />;
      case 'cat':
        return <Cat className="h-5 w-5" />;
      case 'bird':
        return <Bird className="h-5 w-5" />;
      case 'fish':
        return <Fish className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  const getSpeciesBadgeColor = (species: string) => {
    switch (species.toLowerCase()) {
      case 'dog':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'cat':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'bird':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300';
      case 'fish':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading || isPetsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Pet Profiles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your pets and track their favorite products
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" data-testid="button-add-pet">
              <PlusCircle className="h-4 w-4" />
              Add Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Pet Profile</DialogTitle>
            </DialogHeader>
            <PetForm
              onSubmit={(data) => createPetMutation.mutate(data)}
              isLoading={createPetMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {pets.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No pets yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first pet profile to start tracking their favorite products
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
              data-testid="button-create-first-pet"
            >
              <PlusCircle className="h-4 w-4" />
              Add Your First Pet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet: PetProfile) => (
            <Card
              key={pet.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedPet(pet)}
              data-testid={`card-pet-${pet.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={pet.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {pet.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{pet.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getSpeciesBadgeColor(pet.species)}>
                          <div className="flex items-center gap-1">
                            {getSpeciesIcon(pet.species)}
                            {pet.species}
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {pet.breed && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Breed:</span>
                      <span>{pet.breed}</span>
                    </div>
                  )}
                  {pet.age && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{pet.age} years old</span>
                    </div>
                  )}
                  {pet.weight && (
                    <div className="flex items-center gap-2">
                      <Weight className="h-4 w-4" />
                      <span>{pet.weight} {pet.weightUnit}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pet Detail Dialog */}
      <Dialog open={!!selectedPet} onOpenChange={() => setSelectedPet(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {selectedPet && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedPet.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                        {selectedPet.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-2xl">{selectedPet.name}</DialogTitle>
                      <Badge className={getSpeciesBadgeColor(selectedPet.species)}>
                        <div className="flex items-center gap-1">
                          {getSpeciesIcon(selectedPet.species)}
                          {selectedPet.species}
                        </div>
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditDialogOpen(true)}
                      data-testid="button-edit-pet"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${selectedPet.name}'s profile?`)) {
                          deletePetMutation.mutate(selectedPet.id);
                          setSelectedPet(null);
                        }
                      }}
                      data-testid="button-delete-pet"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Pet Details</TabsTrigger>
                  <TabsTrigger value="products">Saved Products</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Basic Information</h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="font-medium text-gray-600 dark:text-gray-400">Species:</span>
                              <span className="ml-2">{selectedPet.species}</span>
                            </div>
                            {selectedPet.breed && (
                              <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Breed:</span>
                                <span className="ml-2">{selectedPet.breed}</span>
                              </div>
                            )}
                            {selectedPet.age && (
                              <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Age:</span>
                                <span className="ml-2">{selectedPet.age} years</span>
                              </div>
                            )}
                            {selectedPet.weight && (
                              <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Weight:</span>
                                <span className="ml-2">{selectedPet.weight} {selectedPet.weightUnit}</span>
                              </div>
                            )}
                            {selectedPet.gender && (
                              <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Gender:</span>
                                <span className="ml-2 capitalize">{selectedPet.gender}</span>
                              </div>
                            )}
                            {selectedPet.isSpayedNeutered !== null && (
                              <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Spayed/Neutered:</span>
                                <span className="ml-2">{selectedPet.isSpayedNeutered ? 'Yes' : 'No'}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Health Information
                          </h4>
                          <div className="space-y-3 text-sm">
                            {selectedPet.allergies && selectedPet.allergies.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Allergies:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {selectedPet.allergies.map((allergy, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {allergy}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedPet.medicalConditions && selectedPet.medicalConditions.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Medical Conditions:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {selectedPet.medicalConditions.map((condition, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {condition}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedPet.dietaryRestrictions && selectedPet.dietaryRestrictions.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Dietary Restrictions:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {selectedPet.dietaryRestrictions.map((restriction, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {restriction}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {selectedPet.notes && (
                        <div>
                          <h4 className="font-semibold mb-2">Notes</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                            {selectedPet.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="products" className="mt-6">
                  <SavedProductsList petId={selectedPet.id} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Pet Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pet Profile</DialogTitle>
          </DialogHeader>
          {selectedPet && (
            <PetForm
              initialData={selectedPet}
              onSubmit={(data) => updatePetMutation.mutate({ id: selectedPet.id, ...data })}
              isLoading={updatePetMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}