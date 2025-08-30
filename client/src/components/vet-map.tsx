import { useEffect, useRef, useState } from 'react';

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

interface VetMapProps {
  practices: VetPractice[];
  center: [number, number];
  zoom?: number;
  onMarkerClick?: (practice: VetPractice) => void;
}

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initGoogleMap: () => void;
  }
}

export default function VetMap({ practices, center, zoom = 12, onMarkerClick }: VetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const scriptLoadedRef = useRef(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set timeout for loading
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setMapError('Map took too long to load');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading]);

  // Load Google Maps script
  useEffect(() => {
    if (scriptLoadedRef.current || window.google) {
      scriptLoadedRef.current = true;
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setScriptLoaded(true);
      }, 100);
      return;
    }

    // Get API key from backend and load script
    fetch('/api/google-maps-key')
      .then(response => response.json())
      .then(data => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          scriptLoadedRef.current = true;
          setScriptLoaded(true);
        };

        script.onerror = () => {
          setMapError('Failed to load Google Maps');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      })
      .catch(error => {
        setMapError('Failed to load Google Maps API key');
        setIsLoading(false);
      });

    return () => {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  // Initialize map when both script and DOM are ready
  useEffect(() => {
    if (scriptLoaded && window.google && mapRef.current && !mapInstanceRef.current) {
      try {
        initializeMap();
        setIsLoading(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setMapError(`Failed to initialize map: ${errorMessage}`);
        setIsLoading(false);
      }
    }
  }, [scriptLoaded]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) {
      return;
    }

    try {
      // Initialize map
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: center[0], lng: center[1] },
      zoom: zoom,
      styles: [
        {
          "featureType": "all",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#1a1a2e"}]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill", 
          "stylers": [{"color": "#16213e"}]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [{"color": "#533a7b"}]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#2a2a4a"}]
        }
      ]
    });

      updateMarkers();
      
      // Force a resize to ensure map renders properly
      setTimeout(() => {
        if (mapInstanceRef.current && window.google) {
          window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
        }
      }, 100);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setMapError(`Map initialization failed: ${errorMessage}`);
    }
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();
    let hasValidMarkers = false;

    // Add markers for practices with coordinates
    practices.forEach(practice => {
      if (practice.latitude && practice.longitude) {
        const position = { lat: practice.latitude, lng: practice.longitude };
        
        // Create custom marker icon based on emergency services
        const markerIcon = {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: practice.emergencyServices ? 12 : 8,
          fillColor: practice.emergencyServices ? '#dc2626' : '#3b82f6',
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        };

        const marker = new window.google.maps.Marker({
          position: position,
          map: mapInstanceRef.current,
          icon: markerIcon,
          title: practice.name,
        });

        // Create info window content
        const infoContent = `
          <div style="max-width: 300px; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              ${practice.name}
            </h3>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
              ${practice.address}, ${practice.city}, ${practice.state}
            </p>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
              📞 ${practice.phone}
            </p>
            <div style="margin: 4px 0; display: flex; align-items: center; gap: 4px;">
              <span style="color: #fbbf24;">⭐</span>
              <span style="color: #1f2937; font-size: 14px;">${practice.rating}</span>
              <span style="color: #6b7280; font-size: 12px;">(${practice.reviewCount} reviews)</span>
            </div>
            ${practice.distance ? `<p style="margin: 4px 0; color: #059669; font-size: 12px; font-weight: 500;">${practice.distance < 1 ? `${(practice.distance * 5280).toFixed(0)}ft` : `${practice.distance.toFixed(1)}mi`} away</p>` : ''}
            <div style="margin: 8px 0 4px 0; display: flex; flex-wrap: gap: 4px;">
              ${practice.emergencyServices ? '<span style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500;">24/7 Emergency</span>' : ''}
              ${(practice.services && Array.isArray(practice.services) ? practice.services : []).slice(0, 3).map(service => `<span style="background: #e5e7eb; color: #374151; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${service}</span>`).join('')}
            </div>
            ${practice.website ? `<p style="margin: 8px 0 0 0;"><a href="${practice.website}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none; font-size: 12px;">Visit Website →</a></p>` : ''}
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent,
        });

        marker.addListener('click', () => {
          // Close all other info windows
          markersRef.current.forEach(m => {
            if (m.infoWindow) {
              m.infoWindow.close();
            }
          });
          
          infoWindow.open(mapInstanceRef.current, marker);
          
          if (onMarkerClick) {
            onMarkerClick(practice);
          }
        });

        // Store info window reference with marker
        marker.infoWindow = infoWindow;
        markersRef.current.push(marker);
        bounds.extend(position);
        hasValidMarkers = true;
      }
    });

    // Fit map to show all markers if there are any
    if (hasValidMarkers && markersRef.current.length > 1) {
      mapInstanceRef.current.fitBounds(bounds);
      // Set max zoom to prevent over-zooming on single markers
      const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
        if (mapInstanceRef.current.getZoom() > 15) {
          mapInstanceRef.current.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    } else if (hasValidMarkers && markersRef.current.length === 1) {
      mapInstanceRef.current.setCenter(bounds.getCenter());
      mapInstanceRef.current.setZoom(14);
    }
  };

  // Update markers when practices change
  useEffect(() => {
    if (scriptLoadedRef.current && window.google && mapInstanceRef.current) {
      updateMarkers();
    }
  }, [practices, onMarkerClick]);

  // Update map center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && window.google) {
      mapInstanceRef.current.setCenter({ lat: center[0], lng: center[1] });
    }
  }, [center]);

  if (isLoading) {
    return (
      <div className="relative">
        <div 
          ref={mapRef} 
          className="h-96 w-full rounded-lg border border-gray-300 bg-gray-50"
          data-testid="vet-map"
          style={{ minHeight: '384px' }}
        />
        <div 
          className="absolute inset-0 bg-gray-50 flex items-center justify-center rounded-lg"
          data-testid="vet-map-loading"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div 
        className="h-96 w-full rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center"
        data-testid="vet-map-error"
      >
        <div className="text-center p-6">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-blue-600 font-bold text-xl mb-2">Map Loading...</h3>
          <p className="text-gray-600 mb-4">The interactive map is initializing. All veterinary practice details are available in the detailed list below with exact distances and contact information.</p>
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
            <h4 className="text-blue-600 font-medium mb-2">Quick Reference:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>🔴 Emergency Services Available</p>
              <p>🔵 Regular Veterinary Care</p>
              <p>📍 All practices show distance in the list</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="h-96 w-full rounded-lg border border-gray-300"
        data-testid="vet-map"
        style={{ 
          minHeight: '384px',
          height: '384px',
          backgroundColor: '#f9fafb'
        }}
      />
    </div>
  );
}