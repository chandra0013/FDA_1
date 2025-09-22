'use client';

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Card, CardContent } from './ui/card';
import {
  Layers,
  Thermometer,
  Droplets,
  Loader2,
  Map as MapIcon,
  Satellite,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import argoFloatData from '@/lib/argo-float-data.json';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 11.0,
  lng: 80.0,
};

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

type ArgoFloat = {
  id: string;
  lat: number;
  lng: number;
  location: string;
  sea: 'Arabian Sea' | 'Bay of Bengal';
};

export function MapVisualization() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [activeMarker, setActiveMarker] = useState<ArgoFloat | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  const argoFloats: ArgoFloat[] = argoFloatData.argoFloats as ArgoFloat[];

  const handleMarkerMouseOver = useCallback((marker: ArgoFloat) => {
    setActiveMarker(marker);
    setHoveredMarkerId(marker.id);
  }, []);

  const handleMarkerMouseOut = useCallback(() => {
    setActiveMarker(null);
    setHoveredMarkerId(null);
  }, []);

  const getMarkerIcon = (sea: string, id: string) => {
    const isHovered = hoveredMarkerId === id;
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: isHovered ? 10 : 7,
      fillColor: sea === 'Arabian Sea' ? '#4DB6AC' : '#FFB74D',
      fillOpacity: 1,
      strokeWeight: 0,
    };
  };

  const renderMap = () => {
    if (loadError) {
      return <div>Error loading maps. Please check the API key.</div>;
    }
    if (!isLoaded) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        mapTypeId={mapType}
        options={{
          styles: mapType === 'roadmap' ? mapStyles : undefined,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {argoFloats.map((float) => (
          <Marker
            key={float.id}
            position={{ lat: float.lat, lng: float.lng }}
            icon={getMarkerIcon(float.sea, float.id)}
            onMouseOver={() => handleMarkerMouseOver(float)}
            onMouseOut={handleMarkerMouseOut}
            animation={google.maps.Animation.DROP}
          />
        ))}

        {activeMarker && (
          <InfoWindow
            position={{ lat: activeMarker.lat + 0.5, lng: activeMarker.lng }}
            onCloseClick={handleMarkerMouseOut}
          >
            <div className="p-2 bg-background text-foreground rounded-lg shadow-lg glassmorphism">
              <h4 className="font-bold text-sm text-primary">{activeMarker.id}</h4>
              <p className="text-xs text-muted-foreground">{activeMarker.location}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activeMarker.lat.toFixed(2)}°N, {activeMarker.lng.toFixed(2)}°E
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  };

  return (
    <div className="h-full w-full relative bg-background">
      {renderMap()}
      <div className="absolute top-4 left-4">
        <Card className="glassmorphism border-border">
          <CardContent className="p-4">
            <h3 className="font-bold mb-4 text-foreground">Map Layers</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span>ARGO Floats</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-primary" />
                <span>Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-primary" />
                <span>Salinity</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant={mapType === 'roadmap' ? 'secondary' : 'ghost'}
                onClick={() => setMapType('roadmap')}
                className={cn('flex-1', mapType === 'roadmap' && 'bg-primary/20')}
              >
                <MapIcon className="mr-2 h-4 w-4" />
                Map
              </Button>
              <Button
                size="sm"
                variant={mapType === 'satellite' ? 'secondary' : 'ghost'}
                onClick={() => setMapType('satellite')}
                className={cn('flex-1', mapType === 'satellite' && 'bg-primary/20')}
              >
                <Satellite className="mr-2 h-4 w-4" />
                Satellite
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="absolute bottom-4 right-4">
        <Card className="glassmorphism border-border">
          <CardContent className="p-2">
            <p className="text-xs text-muted-foreground">Interactive Map View</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
