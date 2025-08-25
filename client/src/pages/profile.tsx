import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserReview from "@/components/user-review";
import { PetForm } from "@/components/pet-form";
import { SavedProductsList } from "@/components/saved-products-list";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { User, Star, Crown, Eye, Calendar, Package, MessageCircle, Shield, TrendingUp, PlusCircle, Heart, Dog, Cat, Bird, Fish, Weight, Stethoscope, Edit, Trash2 } from "lucide-react";
import type { PetProfile } from "@shared/schema";

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: userReviews = [] } = useQuery({
    queryKey: ['/api/user/reviews'],
    enabled: isAuthenticated,
  });

  const { data: userScans = [] } = useQuery({
    queryKey: ['/api/scans'],
    enabled: isAuthenticated,
  });

  const { data: pets = [], isLoading: isPetsLoading } = useQuery({
    queryKey: ["/api/pets"],
    enabled: isAuthenticated,
  });

  const getRankIcon = (reviewCount: number) => {
    if (reviewCount >= 50) return <Crown className="text-blue-500 h-5 w-5" />;
    if (reviewCount >= 20) return <Star className="text-green-600 h-5 w-5" />;
    if (reviewCount >= 5) return <Eye className="text-blue-600 h-5 w-5" />;
    return <User className="text-gray-400 h-5 w-5" />;
  };

  const getRankTitle = (reviewCount: number) => {
    if (reviewCount >= 50) return "Expert Reviewer";
    if (reviewCount >= 20) return "Trusted Member";
    if (reviewCount >= 5) return "Active Member";
    return "New Member";
  };

  const getRankDescription = (reviewCount: number) => {
    if (reviewCount >= 50) return "Experienced pet product expert, trusted by the community";
    if (reviewCount >= 20) return "Knowledgeable reviewer helping fellow pet owners";
    if (reviewCount >= 5) return "Active community member sharing valuable insights";
    return "New to the PawsitiveCheck community";
  };

  const getNextRankProgress = (reviewCount: number) => {
    if (reviewCount >= 50) return { current: reviewCount, max: 50, nextRank: "Maximum Rank Achieved" };
    if (reviewCount >= 20) return { current: reviewCount, max: 50, nextRank: "Expert Reviewer" };
    if (reviewCount >= 5) return { current: reviewCount, max: 20, nextRank: "Trusted Member" };
    return { current: reviewCount, max: 5, nextRank: "Active Member" };
  };

  const reviewCount = Array.isArray(userReviews) ? userReviews.length : 0;
  const scanCount = Array.isArray(userScans) ? userScans.length : 0;
  const petCount = Array.isArray(pets) ? pets.length : 0;
  const rankProgress = getNextRankProgress(reviewCount);

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
    mutationFn: async (petId: number) => {
      return await apiRequest(`/api/pets/${petId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "Success",
        description: "Pet profile deleted successfully!",
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
    switch (species?.toLowerCase()) {
      case 'dog': return Dog;
      case 'cat': return Cat;
      case 'bird': return Bird;
      case 'fish': return Fish;
      default: return Heart;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="mb-12">
            <Card className="bg-white dark:bg-gray-800 border border-blue-500/20 shadow-lg" data-testid="card-profile-header">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="text-center md:text-left">
                    <div className="w-24 h-24 mx-auto md:mx-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                      {user?.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                          data-testid="img-profile-avatar"
                        />
                      ) : (
                        <User className="text-white text-3xl" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-profile-name">
                        {user?.firstName || 'Anonymous'} {user?.lastName || 'Seeker'}
                      </h1>
                      {getRankIcon(reviewCount)}
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600" data-testid="badge-user-rank">
                        {getRankTitle(reviewCount)}
                      </Badge>
                      {user?.isAdmin && (
                        <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600" data-testid="badge-admin">
                          Platform Admin
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4" data-testid="text-rank-description">
                      {getRankDescription(reviewCount)}
                    </p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-1 text-gray-500 dark:text-gray-400 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span data-testid="text-join-date">
                        Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      data-testid="button-edit-profile"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pet Profiles Section */}
          <div className="mb-8">
            <Card className="bg-white dark:bg-gray-800 border border-pink-500/20 shadow-lg" data-testid="card-pet-profiles">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                    <Heart className="h-5 w-5" />
                    Pet Profiles
                  </CardTitle>
                  {Array.isArray(pets) && pets.length > 0 && (
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-pink-600 hover:bg-pink-700 text-white" data-testid="button-add-pet">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Pet
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create Pet Profile</DialogTitle>
                        </DialogHeader>
                        <PetForm 
                          onSubmit={createPetMutation.mutate}
                          isLoading={createPetMutation.isPending}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isPetsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Loading pets...</p>
                  </div>
                ) : Array.isArray(pets) && pets.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {(pets as any[]).map((pet: any) => {
                      const SpeciesIcon = getSpeciesIcon(pet.species);
                      return (
                        <Card key={pet.id} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow" data-testid={`pet-card-${pet.id}`}>
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                  {pet.profileImageUrl ? (
                                    <AvatarImage src={pet.profileImageUrl} alt={pet.name} />
                                  ) : (
                                    <AvatarFallback className="bg-pink-100 dark:bg-pink-900/20">
                                      <SpeciesIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100" data-testid="text-pet-name">
                                    {pet.name}
                                  </CardTitle>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize" data-testid="text-pet-species">
                                    {pet.breed ? `${pet.breed} ${pet.species}` : pet.species}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Dialog open={isEditDialogOpen && selectedPet?.id === pet.id} onOpenChange={(open) => {
                                  setIsEditDialogOpen(open);
                                  if (!open) setSelectedPet(null);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedPet(pet)}
                                      data-testid={`button-edit-pet-${pet.id}`}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Edit {pet.name}'s Profile</DialogTitle>
                                    </DialogHeader>
                                    <PetForm 
                                      initialData={selectedPet || undefined}
                                      onSubmit={(data) => updatePetMutation.mutate({ id: selectedPet?.id, ...data })}
                                      isLoading={updatePetMutation.isPending}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${pet.name}'s profile?`)) {
                                      deletePetMutation.mutate(pet.id);
                                    }
                                  }}
                                  className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                                  data-testid={`button-delete-pet-${pet.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {/* Pet Details */}
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                {pet.age && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-300">{pet.age} years old</span>
                                  </div>
                                )}
                                {pet.weight && (
                                  <div className="flex items-center gap-2">
                                    <Weight className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-300">{pet.weight} {pet.weightUnit || 'lbs'}</span>
                                  </div>
                                )}
                                {pet.gender && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600 dark:text-gray-300 capitalize">{pet.gender}</span>
                                  </div>
                                )}
                                {pet.isSpayedNeutered !== null && (
                                  <div className="flex items-center gap-2">
                                    <Stethoscope className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-300">
                                      {pet.isSpayedNeutered ? 'Spayed/Neutered' : 'Intact'}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Health Information */}
                              {(pet.allergies?.length > 0 || pet.medicalConditions?.length > 0 || pet.dietaryRestrictions?.length > 0) && (
                                <div className="space-y-2">
                                  <Separator />
                                  <div className="text-sm">
                                    {pet.allergies?.length > 0 && (
                                      <div className="mb-2">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">Allergies:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {pet.allergies.map((allergy: string, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                              {allergy}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {pet.medicalConditions?.length > 0 && (
                                      <div className="mb-2">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">Medical Conditions:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {pet.medicalConditions.map((condition: string, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                                              {condition}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {pet.dietaryRestrictions?.length > 0 && (
                                      <div>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">Dietary Restrictions:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {pet.dietaryRestrictions.map((restriction: string, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                              {restriction}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Notes */}
                              {pet.notes && (
                                <div className="text-sm">
                                  <span className="font-medium text-gray-900 dark:text-gray-100">Notes:</span>
                                  <p className="text-gray-600 dark:text-gray-300 mt-1">{pet.notes}</p>
                                </div>
                              )}

                              {/* Saved Products */}
                              <div className="pt-2">
                                <Separator className="mb-4" />
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Saved Products</h4>
                                <SavedProductsList petId={pet.id} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4" data-testid="text-no-pets-title">
                      No Pet Profiles Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6" data-testid="text-no-pets-description">
                      Create profiles for your pets to track product safety and preferences
                    </p>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-pink-600 hover:bg-pink-700 text-white" data-testid="button-create-first-pet">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Your First Pet Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create Pet Profile</DialogTitle>
                        </DialogHeader>
                        <PetForm 
                          onSubmit={createPetMutation.mutate}
                          isLoading={createPetMutation.isPending}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow" data-testid="card-stat-reviews">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2" data-testid="text-review-count">
                  {reviewCount}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Product Reviews</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow" data-testid="card-stat-scans">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <Package className="text-green-600 dark:text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2" data-testid="text-scan-count">
                  {scanCount}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Products Scanned</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow" data-testid="card-stat-helpfulness">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2" data-testid="text-helpfulness-score">
                  {Math.round((reviewCount * 4.2) + (scanCount * 1.5))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Community Score</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow" data-testid="card-stat-pets">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-pink-600 dark:text-pink-400" />
                </div>
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2" data-testid="text-pet-count">
                  {petCount}
                </div>
                <p className="text-gray-600 dark:text-gray-300">Pet Profiles</p>
              </CardContent>
            </Card>
          </div>

          {/* Fifth stat card for rank progress - moved to separate row */}
          <div className="mb-8">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow" data-testid="card-stat-rank-progress">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2" data-testid="text-rank-progress">
                  {rankProgress.current}/{rankProgress.max}
                </div>
                <p className="text-gray-600 dark:text-gray-300">to {rankProgress.nextRank}</p>
              </CardContent>
            </Card>
          </div>

          {/* Rank Progress */}
          {rankProgress.current < rankProgress.max && (
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow mb-8" data-testid="card-rank-progress">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="h-5 w-5" />
                  Path to {rankProgress.nextRank}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(rankProgress.current / rankProgress.max) * 100}%` }}
                      data-testid="progress-bar-rank"
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span data-testid="text-progress-current">
                      {rankProgress.current} reviews completed
                    </span>
                    <span data-testid="text-progress-remaining">
                      {rankProgress.max - rankProgress.current} more needed
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Tabs */}
          <Tabs defaultValue="reviews" className="w-full" data-testid="tabs-profile">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400" data-testid="tab-reviews">
                My Reviews
              </TabsTrigger>
              <TabsTrigger value="scans" className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/20 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400" data-testid="tab-scans">
                Scan History
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/20 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400" data-testid="tab-achievements">
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-6" data-testid="content-reviews">
              {Array.isArray(userReviews) && userReviews.length > 0 ? (
                <div className="space-y-6">
                  {(userReviews as any[]).map((review: any) => (
                    <Card key={review.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow" data-testid={`review-card-${review.id}`}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1" data-testid="text-review-title">
                              {review.title || 'Untitled Review'}
                            </h3>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={i < review.rating ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}
                                  data-testid={`review-paw-${i}`}
                                >
                                  🐾
                                </span>
                              ))}
                              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                                {review.rating}/5 Paws
                              </span>
                            </div>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm" data-testid="text-review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4" data-testid="text-review-content">
                          {review.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            Product ID: {review.productId}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300" data-testid="button-edit-review">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400" data-testid="button-delete-review">
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow" data-testid="card-no-reviews">
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4" data-testid="text-no-reviews-title">
                      No Reviews Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6" data-testid="text-no-reviews-description">
                      Share your experience with pet products to help fellow pet owners
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-write-first-review">
                      Write Your First Review
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="scans" className="mt-6" data-testid="content-scans">
              {Array.isArray(userScans) && userScans.length > 0 ? (
                <div className="space-y-4">
                  {(userScans as any[]).map((scan: any) => (
                    <Card key={scan.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow" data-testid={`scan-card-${scan.id}`}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2" data-testid="text-scan-data">
                              {scan.scannedData || 'Unknown Product'}
                            </h3>
                            {scan.analysisResult && (
                              <Badge 
                                className={
                                  scan.analysisResult.cosmicClarity === 'blessed' 
                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                    : scan.analysisResult.cosmicClarity === 'cursed'
                                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                                }
                                data-testid="badge-scan-clarity"
                              >
                                {scan.analysisResult.cosmicClarity?.toUpperCase() || 'ANALYZED'}
                              </Badge>
                            )}
                          </div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm" data-testid="text-scan-date">
                            {new Date(scan.scannedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow" data-testid="card-no-scans">
                  <CardContent className="p-12 text-center">
                    <Package className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4" data-testid="text-no-scans-title">
                      No Scans Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6" data-testid="text-no-scans-description">
                      Start analyzing pet products for safety information
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-start-scanning">
                      Start Scanning
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>


            <TabsContent value="achievements" className="mt-6" data-testid="content-achievements">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Achievement Cards */}
                <Card className={`bg-white dark:bg-gray-800 border shadow ${reviewCount >= 1 ? 'border-green-300 dark:border-green-600' : 'border-gray-200 dark:border-gray-700'}`} data-testid="achievement-first-review">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      reviewCount >= 1 ? 'bg-mystical-green/20' : 'bg-cosmic-700'
                    }`}>
                      <MessageCircle className={reviewCount >= 1 ? 'text-mystical-green' : 'text-cosmic-500'} />
                    </div>
                    <h3 className={`font-mystical text-lg mb-2 ${reviewCount >= 1 ? 'text-mystical-green' : 'text-cosmic-400'}`}>
                      First Insight
                    </h3>
                    <p className="text-cosmic-300 text-sm">
                      Share your first mystical review
                    </p>
                    {reviewCount >= 1 && (
                      <Badge className="mt-2 bg-mystical-green/20 text-mystical-green" data-testid="badge-achievement-unlocked">
                        Unlocked!
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                <Card className={`cosmic-card ${scanCount >= 5 ? 'border-mystical-purple/50' : 'border-cosmic-600/50'}`} data-testid="achievement-scanner">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      scanCount >= 5 ? 'bg-mystical-purple/20' : 'bg-cosmic-700'
                    }`}>
                      <Package className={scanCount >= 5 ? 'text-mystical-purple' : 'text-cosmic-500'} />
                    </div>
                    <h3 className={`font-mystical text-lg mb-2 ${scanCount >= 5 ? 'text-mystical-purple' : 'text-cosmic-400'}`}>
                      Mystic Scanner
                    </h3>
                    <p className="text-cosmic-300 text-sm">
                      Scan 5 products with the cosmic scanner
                    </p>
                    {scanCount >= 5 ? (
                      <Badge className="mt-2 bg-mystical-purple/20 text-mystical-purple" data-testid="badge-scanner-unlocked">
                        Unlocked!
                      </Badge>
                    ) : (
                      <Badge className="mt-2 bg-cosmic-700 text-cosmic-400" data-testid="badge-scanner-progress">
                        {scanCount}/5
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                <Card className={`bg-white dark:bg-gray-800 border shadow ${reviewCount >= 5 ? 'border-blue-300 dark:border-blue-600' : 'border-gray-200 dark:border-gray-700'}`} data-testid="achievement-truth-seeker">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      reviewCount >= 5 ? 'bg-starlight-500/20' : 'bg-cosmic-700'
                    }`}>
                      <Eye className={reviewCount >= 5 ? 'text-starlight-500' : 'text-cosmic-500'} />
                    </div>
                    <h3 className={`font-mystical text-lg mb-2 ${reviewCount >= 5 ? 'text-starlight-500' : 'text-cosmic-400'}`}>
                      Truth Seeker
                    </h3>
                    <p className="text-cosmic-300 text-sm">
                      Achieve Truth Seeker rank
                    </p>
                    {reviewCount >= 5 ? (
                      <Badge className="mt-2 bg-starlight-500/20 text-starlight-500" data-testid="badge-truth-seeker-unlocked">
                        Unlocked!
                      </Badge>
                    ) : (
                      <Badge className="mt-2 bg-cosmic-700 text-cosmic-400" data-testid="badge-truth-seeker-progress">
                        {reviewCount}/5
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                <Card className={`bg-white dark:bg-gray-800 border shadow ${user?.isAdmin ? 'border-orange-300 dark:border-orange-600' : 'border-gray-200 dark:border-gray-700'}`} data-testid="achievement-syndicate">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      user?.isAdmin ? 'bg-mystical-red/20' : 'bg-cosmic-700'
                    }`}>
                      <Crown className={user?.isAdmin ? 'text-mystical-red' : 'text-cosmic-500'} />
                    </div>
                    <h3 className={`font-mystical text-lg mb-2 ${user?.isAdmin ? 'text-mystical-red' : 'text-cosmic-400'}`}>
                      Syndicate Member
                    </h3>
                    <p className="text-cosmic-300 text-sm">
                      Join the Audit Syndicate
                    </p>
                    {user?.isAdmin && (
                      <Badge className="mt-2 bg-mystical-red/20 text-mystical-red" data-testid="badge-syndicate-unlocked">
                        Unlocked!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
