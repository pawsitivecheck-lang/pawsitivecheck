import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

// Fix for default markers in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface VetPractice {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  website?: string;
  rating: number;
  reviewCount: number;
  services: string[];
  emergencyServices: boolean;
  distance?: number;
  latitude?: number;
  longitude?: number;
}

interface VetMapProps {
  practices: VetPractice[];
  center: [number, number];
  zoom?: number;
  onMarkerClick?: (practice: VetPractice) => void;
}

export default function VetMap({ practices, center, zoom = 10, onMarkerClick }: VetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      // Cleanup map when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current!.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for practices with coordinates
    practices.forEach(practice => {
      if (practice.latitude && practice.longitude) {
        const emergencyIcon = L.icon({
          iconUrl: practice.emergencyServices ? 
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNkYzI2MjYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI0IiB5PSI0Ij4KPHBhdGggZD0iTTcgM1YxM00zIDdIMTMiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=' :
            icon,
          shadowUrl: iconShadow,
          iconSize: practice.emergencyServices ? [30, 30] : [25, 41],
          iconAnchor: practice.emergencyServices ? [15, 15] : [12, 41],
        });

        const marker = L.marker([practice.latitude, practice.longitude], {
          icon: emergencyIcon
        }).addTo(mapInstanceRef.current);

        // Create popup content
        const popupContent = `
          <div class="vet-popup">
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
            ${practice.emergencyServices ? '<span style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500;">Emergency</span>' : ''}
            ${practice.website ? `<p style="margin: 8px 0 0 0;"><a href="${practice.website}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none; font-size: 12px;">Visit Website →</a></p>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);

        // Add click handler
        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(practice);
          }
        });

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers if there are any
    if (markersRef.current.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    } else {
      // No markers, center on provided center
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [practices, center, zoom, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      className="h-96 w-full rounded-lg border border-cosmic-600 bg-cosmic-900/50"
      data-testid="vet-map"
    />
  );
}