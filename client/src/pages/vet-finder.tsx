import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import AdBanner from "@/components/ad-banner";
import VetMap from "@/components/vet-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import Footer from "@/components/footer";

interface VetPractice {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  phone: string;
  website?: string;
  rating: number;
  reviewCount: number;
  services?: string[];
  hours: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  specialties?: string[];
  emergencyServices?: boolean;
  distance?: number;
  latitude?: number;
  longitude?: number;
  isOpen?: boolean;
  hoursLastUpdated?: string;
}

export default function VetFinder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState(""); // For manual location entry
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [manualLocation, setManualLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState("");
  const [vetPractices, setVetPractices] = useState<VetPractice[]>([]);
  const [searchRadius, setSearchRadius] = useState(15); // Default 15 miles
  const [visibleResults, setVisibleResults] = useState(6); // Show 6 results initially
  const [isGeocodingLocation, setIsGeocodingLocation] = useState(false);

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
        setManualLocation(null); // Clear manual location when GPS is used
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

  // Geocode manually entered location
  const geocodeLocation = async (locationString: string): Promise<{lat: number, lng: number} | null> => {
    if (!locationString.trim()) return null;
    
    try {
      setIsGeocodingLocation(true);
      
      // Use Google Maps Geocoding API
      const response = await fetch('/api/google-maps-key');
      const { key } = await response.json();
      
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationString)}&key=${key}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
        const location = geocodeData.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Location Error",
        description: "Could not find the specified location. Please try a different address.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGeocodingLocation(false);
    }
  };

  const searchVetsMutation = useMutation({
    mutationFn: async (searchData: { query: string; location?: {lat: number, lng: number}; radius?: number }) => {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        const response = await fetch('/api/vets/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchData),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to search for veterinarians');
        }
        
        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    onSuccess: (data) => {
      setVetPractices(data.practices || []);
      setVisibleResults(6); // Reset to show first 6 results
      toast({
        title: "Cosmic Healers Found!",
        description: `Found ${data.practices?.length || 0} mystical veterinary guardians near you`,
      });
    },
    onError: (error) => {
      setVetPractices([]);
      toast({
        title: "Search Failed",
        description: "Unable to locate cosmic veterinary guardians. Please try a different location or check your internet connection.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = async () => {
    // Priority 1: Use GPS location if available
    if (userLocation) {
      searchVetsMutation.mutate({
        query: searchQuery || "veterinarian",
        location: userLocation,
        radius: searchRadius
      });
      return;
    }

    // Priority 2: Use previously geocoded manual location
    if (manualLocation) {
      searchVetsMutation.mutate({
        query: searchQuery || "veterinarian",
        location: manualLocation,
        radius: searchRadius
      });
      return;
    }

    // Priority 3: Geocode manually entered location if provided
    if (locationQuery.trim()) {
      const geocodedLocation = await geocodeLocation(locationQuery.trim());
      if (geocodedLocation) {
        setManualLocation(geocodedLocation);
        setUserLocation(null); // Clear GPS location when manual location is used
        toast({
          title: "Location Geocoded",
          description: `Found coordinates for: ${locationQuery}`,
        });
        
        searchVetsMutation.mutate({
          query: searchQuery || "veterinarian",
          location: geocodedLocation,
          radius: searchRadius
        });
        return;
      } else {
        // Geocoding failed, fall back to text search
        toast({
          title: "Using Text Search",
          description: "Searching with location as text instead of coordinates",
          variant: "default",
        });
      }
    }

    // Fallback: Use text-based search (less accurate)
    const fullQuery = locationQuery.trim() 
      ? `${searchQuery || "veterinarian"} ${locationQuery.trim()}`
      : searchQuery || "veterinarian";
      
    searchVetsMutation.mutate({
      query: fullQuery,
      radius: searchRadius
    });
  };

  // Removed auto-search - user must manually trigger search

  // Remove handleManualSearch since we're using handleSearch now

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return distance < 1 ? `${(distance * 5280).toFixed(0)}ft` : `${distance.toFixed(1)}mi`;
  };

  const formatHours = (hours: { [key: string]: string }, isOpen?: boolean) => {
    const today = new Date().toLocaleDateString('en', { weekday: 'long' });
    const todayHours = hours[today] || "Hours vary";
    
    if (typeof isOpen === 'boolean') {
      const status = isOpen ? '🟢 OPEN' : '🔴 CLOSED';
      return `${status} • ${todayHours}`;
    }
    
    return todayHours;
  };

  const handleLoadMore = () => {
    setVisibleResults(prev => Math.min(prev + 6, vetPractices.length));
  };

  const getCurrentDay = () => {
    return new Date().toLocaleDateString('en', { weekday: 'long' });
  };

  const HoursDisplay = ({ 
    hours, 
    vetId, 
    isOpen, 
    hoursLastUpdated 
  }: { 
    hours: { [key: string]: string }, 
    vetId: string,
    isOpen?: boolean,
    hoursLastUpdated?: string
  }) => {
    const currentDay = getCurrentDay();
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const formatLastUpdated = (timestamp?: string) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `Updated ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };
    
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-cosmic-200 font-medium">Real-Time Hours</h4>
          {hoursLastUpdated && (
            <span className="text-xs text-cosmic-400" title={`Hours last updated: ${new Date(hoursLastUpdated).toLocaleString()}`}>
              {formatLastUpdated(hoursLastUpdated)}
            </span>
          )}
        </div>
        {daysOrder.map((day) => {
          const isToday = day === currentDay;
          const dayHours = hours[day] || 'Call for hours';
          
          return (
            <div 
              key={day}
              className={`flex justify-between items-center text-sm px-2 py-1 rounded ${
                isToday 
                  ? 'bg-starlight-500/10 text-starlight-400 font-medium border border-starlight-500/20' 
                  : 'text-cosmic-300'
              }`}
              data-testid={`hours-${vetId}-${day.toLowerCase()}`}
            >
              <span className="font-medium">
                {isToday ? `${day} (Today)` : day}
              </span>
              <span className={`${isToday ? 'text-starlight-300' : 'text-cosmic-400'} flex items-center gap-1`}>
                {isToday && typeof isOpen === 'boolean' && (
                  <span className={`inline-block w-2 h-2 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'}`} />
                )}
                {dayHours}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const AnimalServicesDisplay = ({ specialties, services, vetId }: { specialties?: string[], services?: string[], vetId: string }) => {
    const animalTypes = (Array.isArray(specialties) ? specialties : []).filter(specialty => 
      specialty.toLowerCase().includes('animal') || 
      specialty.toLowerCase().includes('pet') ||
      specialty.toLowerCase().includes('care')
    );
    
    const serviceTypes = (Array.isArray(services) ? services : []).filter(service => 
      !service.toLowerCase().includes('general')
    );

    return (
      <div className="space-y-4">
        {animalTypes.length > 0 && (
          <div>
            <h4 className="text-cosmic-200 font-medium mb-2 flex items-center gap-2">
              🐾 Animals We Serve
            </h4>
            <div className="flex flex-wrap gap-2">
              {animalTypes.map((type, index) => (
                <Badge
                  key={index}
                  className="bg-mystical-purple/20 text-mystical-purple border-mystical-purple/30"
                  data-testid={`animal-type-${vetId}-${index}`}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {serviceTypes.length > 0 && (
          <div>
            <h4 className="text-cosmic-200 font-medium mb-2 flex items-center gap-2">
              ⚕️ Services Offered
            </h4>
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map((service, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-cosmic-600 text-cosmic-300"
                  data-testid={`service-type-${vetId}-${index}`}
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
                        onClick={handleSearch}
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
                      ✨ GPS coordinates acquired: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </p>
                  )}

                  {manualLocation && (
                    <div className="text-cosmic-400 text-sm mt-2 flex items-center justify-between">
                      <span>📍 Manual location set: {manualLocation.lat.toFixed(4)}, {manualLocation.lng.toFixed(4)}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {setManualLocation(null); setLocationQuery("");}}
                        className="text-xs h-6 px-2"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                  
                  {locationError && (
                    <p className="text-mystical-red text-sm mt-2">{locationError}</p>
                  )}

                  {isGeocodingLocation && (
                    <p className="text-starlight-400 text-sm mt-2 flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding location coordinates...
                    </p>
                  )}
                </div>

                {/* Search Radius */}
                <div className="pt-4 border-t border-cosmic-700">
                  <h3 className="text-cosmic-200 font-medium mb-3">Search Distance</h3>
                  <div className="flex items-center gap-4">
                    <Select value={searchRadius.toString()} onValueChange={(value) => setSearchRadius(Number(value))}>
                      <SelectTrigger className="w-48 bg-cosmic-900/50 border-cosmic-600 text-cosmic-100" data-testid="select-radius">
                        <SelectValue placeholder="Search radius" />
                      </SelectTrigger>
                      <SelectContent className="bg-cosmic-900 border-cosmic-600">
                        <SelectItem value="5" className="text-cosmic-100 hover:bg-cosmic-700 focus:bg-cosmic-700">5 miles</SelectItem>
                        <SelectItem value="10" className="text-cosmic-100 hover:bg-cosmic-700 focus:bg-cosmic-700">10 miles</SelectItem>
                        <SelectItem value="15" className="text-cosmic-100 hover:bg-cosmic-700 focus:bg-cosmic-700">15 miles</SelectItem>
                        <SelectItem value="25" className="text-cosmic-100 hover:bg-cosmic-700 focus:bg-cosmic-700">25 miles</SelectItem>
                        <SelectItem value="50" className="text-cosmic-100 hover:bg-cosmic-700 focus:bg-cosmic-700">50 miles</SelectItem>
                        <SelectItem value="100" className="text-cosmic-100 hover:bg-cosmic-700 focus:bg-cosmic-700">100 miles</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-cosmic-400 text-sm">
                      Within {searchRadius} miles of your location
                    </span>
                  </div>
                </div>

                {/* Manual Search */}
                <div className="pt-4 border-t border-cosmic-700">
                  <h3 className="text-cosmic-200 font-medium mb-3">Search by Location & Services</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Input
                        type="text"
                        placeholder="Enter location (e.g., Lansing, MI)..."
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        className="flex-1 bg-cosmic-900/50 border-cosmic-600 text-cosmic-100"
                        data-testid="input-location-query"
                      />
                      <Input
                        type="text"
                        placeholder="Services (e.g., emergency, dental)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-cosmic-900/50 border-cosmic-600 text-cosmic-100"
                        data-testid="input-service-query"
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={searchVetsMutation.isPending}
                      className="mystical-button w-full"
                      data-testid="button-combined-search"
                    >
                      {searchVetsMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="mr-2 h-4 w-4" />
                      )}
                      Search Cosmic Healers
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {vetPractices.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-mystical text-starlight-400" data-testid="text-results-header">
                  Mystical Veterinary Guardians
                </h2>
                <div className="text-cosmic-300 text-sm">
                  Showing {Math.min(visibleResults, (vetPractices || []).length)} of {(vetPractices || []).length} results
                </div>
              </div>
              
              {/* Interactive Map */}
              <Card className="cosmic-card" data-testid="card-vet-map">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-starlight-400">
                    <MapPin className="h-5 w-5" />
                    Cosmic Healer Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VetMap
                    practices={vetPractices}
                    center={
                      userLocation ? [userLocation.lat, userLocation.lng] :
                      manualLocation ? [manualLocation.lat, manualLocation.lng] :
                      [42.3314, -84.5467] // Default to Lansing, MI
                    }
                    zoom={12}
                    onMarkerClick={(practice) => {
                      toast({
                        title: practice.name,
                        description: `${practice.address}, ${practice.city}, ${practice.state}`,
                      });
                    }}
                  />
                </CardContent>
              </Card>
              
              <div className="grid gap-6">
                {(vetPractices || []).slice(0, visibleResults).map((vet) => (
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

                          {/* Contact Info */}
                          <div className="grid gap-4 mb-6">
                            <div className="flex items-center gap-2 text-cosmic-300">
                              <Phone className="h-4 w-4" />
                              <a 
                                href="tel:15174324700"
                                className="hover:text-starlight-400 transition-colors"
                                data-testid={`vet-phone-${vet.id}`}
                              >
                                (517) 432-4700
                              </a>
                            </div>
                            
                            {vet.website && (
                              <div className="flex items-center gap-2 text-cosmic-300">
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

                          {/* Animal Services */}
                          <div className="mb-6">
                            <AnimalServicesDisplay 
                              specialties={vet.specialties} 
                              services={vet.services} 
                              vetId={vet.id}
                            />
                          </div>

                          {/* Hours Display */}
                          <div className="mb-4">
                            <HoursDisplay 
                              hours={vet.hours} 
                              vetId={vet.id} 
                              isOpen={vet.isOpen} 
                              hoursLastUpdated={vet.hoursLastUpdated}
                            />
                          </div>
                        </div>

                        {/* Action Panel */}
                        <div className="space-y-4">
                          {/* Current Status */}
                          <div className="bg-cosmic-800/30 rounded-lg p-4 border border-cosmic-700">
                            <div className="text-cosmic-200 font-medium mb-2 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Current Status
                            </div>
                            <div className="text-starlight-400 font-medium">
                              {formatHours(vet.hours, vet.isOpen)}
                            </div>
                            {vet.hoursLastUpdated && (
                              <div className="text-xs text-cosmic-400 mt-1">
                                Hours updated: {new Date(vet.hoursLastUpdated).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            )}
                          </div>

                          {vet.emergencyServices && (
                            <Badge className="bg-mystical-red/20 text-mystical-red border-mystical-red/30 w-full justify-center py-2">
                              🚨 Emergency Services Available
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
                
                {/* Load More Button */}
                {visibleResults < vetPractices.length && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      size="lg"
                      className="border-starlight-500 text-starlight-500 hover:bg-starlight-500/10 px-8"
                      data-testid="button-load-more-vets"
                    >
                      Load More Healers ({vetPractices.length - visibleResults} remaining)
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchVetsMutation.data && (vetPractices || []).length === 0 && (
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
          {(vetPractices || []).length === 0 && !searchVetsMutation.data && (
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
      
      <Footer />
    </div>
  );
}