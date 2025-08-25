import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import AdBanner from "@/components/ad-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation, 
  Search, 
  Heart,
  Stethoscope,
  Building2,
  Globe,
  Loader2
} from "lucide-react";

interface VetPractice {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website?: string;
  rating: number;
  reviewCount: number;
  services: string[];
  hours: {
    [key: string]: string;
  };
  specialties: string[];
  emergencyServices: boolean;
  distance?: number;
}

export default function VetFinder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState("");
  const [vetPractices, setVetPractices] = useState<VetPractice[]>([]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError("");
        toast({
          title: "Location Found",
          description: "Found your cosmic coordinates for vet search",
        });
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        toast({
          title: "Location Error",
          description: "Please enter your location manually",
          variant: "destructive",
        });
      }
    );
  };

  const searchVetsMutation = useMutation({
    mutationFn: async (searchData: { query: string; location?: {lat: number, lng: number} }) => {
      // In a real implementation, this would call Google Places API, Yelp API, or similar
      // For now, we'll use web search to find actual vet information
      const response = await fetch('/api/vets/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to search for veterinarians');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setVetPractices(data.practices || []);
      toast({
        title: "Cosmic Healers Found!",
        description: `Found ${data.practices?.length || 0} mystical veterinary guardians near you`,
      });
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: "Unable to locate cosmic veterinary guardians",
        variant: "destructive",
      });
    },
  });

  const handleLocationSearch = () => {
    if (userLocation) {
      searchVetsMutation.mutate({
        query: searchQuery || "veterinarian",
        location: userLocation
      });
    } else {
      searchVetsMutation.mutate({
        query: searchQuery || "veterinarian"
      });
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "Enter Location",
        description: "Please enter a city, zip code, or address to search",
        variant: "destructive",
      });
      return;
    }
    
    searchVetsMutation.mutate({
      query: `veterinarian ${searchQuery}`
    });
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}mi`;
  };

  const formatHours = (hours: { [key: string]: string }) => {
    const today = new Date().toLocaleDateString('en', { weekday: 'long' });
    return hours[today] || "Hours vary";
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Top Ad */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <AdBanner size="leaderboard" position="vet-finder-header" />
        </div>
      </div>
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="cosmic-card p-8 text-center">
              <h1 className="font-mystical text-4xl md:text-5xl font-bold text-starlight-500 mb-4" data-testid="text-vet-finder-title">
                Cosmic Healer Locator
              </h1>
              <p className="text-cosmic-300 text-lg" data-testid="text-vet-finder-subtitle">
                Find mystical veterinary guardians in your realm
              </p>
            </div>
          </div>

          {/* Search Controls */}
          <div className="mb-8">
            <Card className="cosmic-card" data-testid="card-search-controls">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-starlight-400">
                  <Stethoscope className="h-5 w-5" />
                  Locate Cosmic Healers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location-based Search */}
                <div>
                  <h3 className="text-cosmic-200 font-medium mb-3">Use Current Location</h3>
                  <div className="flex gap-3">
                    <Button
                      onClick={getCurrentLocation}
                      variant="outline"
                      className="border-starlight-500 text-starlight-500 hover:bg-starlight-500/10"
                      data-testid="button-get-location"
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Get My Location
                    </Button>
                    
                    {userLocation && (
                      <Button
                        onClick={handleLocationSearch}
                        disabled={searchVetsMutation.isPending}
                        className="mystical-button"
                        data-testid="button-search-nearby"
                      >
                        {searchVetsMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Heart className="mr-2 h-4 w-4" />
                        )}
                        Find Nearby Healers
                      </Button>
                    )}
                  </div>
                  
                  {userLocation && (
                    <p className="text-cosmic-400 text-sm mt-2">
                      ✨ Cosmic coordinates acquired: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </p>
                  )}
                  
                  {locationError && (
                    <p className="text-mystical-red text-sm mt-2">{locationError}</p>
                  )}
                </div>

                {/* Manual Search */}
                <div className="pt-4 border-t border-cosmic-700">
                  <h3 className="text-cosmic-200 font-medium mb-3">Search by Location</h3>
                  <form onSubmit={handleManualSearch} className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="Enter city, zip code, or address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-cosmic-900/50 border-cosmic-600 text-cosmic-100"
                      data-testid="input-location-search"
                    />
                    <Button
                      type="submit"
                      disabled={searchVetsMutation.isPending}
                      className="mystical-button"
                      data-testid="button-manual-search"
                    >
                      {searchVetsMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {vetPractices.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-mystical text-starlight-400 mb-4" data-testid="text-results-header">
                Mystical Veterinary Guardians ({vetPractices.length})
              </h2>
              
              <div className="grid gap-6">
                {vetPractices.map((vet) => (
                  <Card key={vet.id} className="cosmic-card" data-testid={`vet-card-${vet.id}`}>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Main Info */}
                        <div className="md:col-span-2">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-starlight-400 mb-2" data-testid={`vet-name-${vet.id}`}>
                                {vet.name}
                              </h3>
                              <div className="flex items-center gap-2 text-cosmic-300 mb-2">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm" data-testid={`vet-address-${vet.id}`}>
                                  {vet.address}, {vet.city}, {vet.state} {vet.zipCode}
                                </span>
                                {vet.distance && (
                                  <Badge variant="secondary" className="bg-cosmic-700 text-cosmic-200">
                                    {formatDistance(vet.distance)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            {vet.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-starlight-500 fill-current" />
                                <span className="text-starlight-400 font-medium">{vet.rating}</span>
                                <span className="text-cosmic-400 text-sm">({vet.reviewCount})</span>
                              </div>
                            )}
                          </div>

                          {/* Contact & Hours */}
                          <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-cosmic-300">
                              <Phone className="h-4 w-4" />
                              <a 
                                href={`tel:${vet.phone}`}
                                className="hover:text-starlight-400 transition-colors"
                                data-testid={`vet-phone-${vet.id}`}
                              >
                                {vet.phone}
                              </a>
                            </div>
                            
                            <div className="flex items-center gap-2 text-cosmic-300">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{formatHours(vet.hours)}</span>
                            </div>
                            
                            {vet.website && (
                              <div className="flex items-center gap-2 text-cosmic-300 sm:col-span-2">
                                <Globe className="h-4 w-4" />
                                <a 
                                  href={vet.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-starlight-400 transition-colors text-sm"
                                  data-testid={`vet-website-${vet.id}`}
                                >
                                  Visit Website
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Services */}
                          {vet.services.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-cosmic-200 font-medium mb-2">Services</h4>
                              <div className="flex flex-wrap gap-2">
                                {vet.services.map((service, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="border-cosmic-600 text-cosmic-300"
                                    data-testid={`service-${vet.id}-${index}`}
                                  >
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Specialties */}
                          {vet.specialties.length > 0 && (
                            <div>
                              <h4 className="text-cosmic-200 font-medium mb-2">Specialties</h4>
                              <div className="flex flex-wrap gap-2">
                                {vet.specialties.map((specialty, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-mystical-purple/20 text-mystical-purple border-mystical-purple/30"
                                    data-testid={`specialty-${vet.id}-${index}`}
                                  >
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Panel */}
                        <div className="space-y-4">
                          {vet.emergencyServices && (
                            <Badge className="bg-mystical-red/20 text-mystical-red border-mystical-red/30 w-full justify-center">
                              🚨 Emergency Services
                            </Badge>
                          )}
                          
                          <div className="space-y-2">
                            <Button
                              onClick={() => window.open(`tel:${vet.phone}`)}
                              className="w-full mystical-button"
                              data-testid={`button-call-${vet.id}`}
                            >
                              <Phone className="mr-2 h-4 w-4" />
                              Call Now
                            </Button>
                            
                            <Button
                              onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(vet.address + ', ' + vet.city + ', ' + vet.state)}`)}
                              variant="outline"
                              className="w-full border-cosmic-600 text-cosmic-300 hover:bg-cosmic-600/10"
                              data-testid={`button-directions-${vet.id}`}
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              Get Directions
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchVetsMutation.data && vetPractices.length === 0 && (
            <Card className="cosmic-card text-center p-8" data-testid="card-no-results">
              <Building2 className="mx-auto h-12 w-12 text-cosmic-500 mb-4" />
              <h3 className="text-xl font-mystical text-cosmic-300 mb-2">No Cosmic Healers Found</h3>
              <p className="text-cosmic-400 mb-4">
                The mystical search found no veterinary guardians in this realm. Try expanding your search area or checking a different location.
              </p>
              <Button
                onClick={() => setVetPractices([])}
                variant="outline"
                className="border-starlight-500 text-starlight-500 hover:bg-starlight-500/10"
                data-testid="button-try-again"
              >
                Try Another Search
              </Button>
            </Card>
          )}

          {/* Welcome State */}
          {vetPractices.length === 0 && !searchVetsMutation.data && (
            <Card className="cosmic-card text-center p-8" data-testid="card-welcome">
              <Heart className="mx-auto h-16 w-16 text-starlight-500 mb-4" />
              <h3 className="text-2xl font-mystical text-starlight-400 mb-4">Find Your Pet's Guardian</h3>
              <p className="text-cosmic-300 max-w-2xl mx-auto mb-6">
                Use the mystical locator above to find trusted veterinary healers near you. 
                Get their cosmic coordinates, divine their services, and connect with the guardians 
                who will protect your beloved companion's well-being.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 max-w-lg mx-auto text-left">
                <div className="flex items-start gap-3">
                  <Navigation className="h-5 w-5 text-starlight-500 mt-0.5" />
                  <div>
                    <h4 className="text-cosmic-200 font-medium">Location Search</h4>
                    <p className="text-cosmic-400 text-sm">Find vets using your current location</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Search className="h-5 w-5 text-starlight-500 mt-0.5" />
                  <div>
                    <h4 className="text-cosmic-200 font-medium">Manual Search</h4>
                    <p className="text-cosmic-400 text-sm">Search by city, zip, or address</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}