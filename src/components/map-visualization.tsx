
'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Card, CardContent } from './ui/card';
import {
  Layers,
  Thermometer,
  Droplets,
  Loader2,
  Map as MapIcon,
  Satellite,
  Upload,
} from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';
import { FloatDataWindow } from './float-data-window';
import { useArgoFloats, type ArgoFloat } from '@/hooks/use-argo-floats';
import { SWRConfig } from 'swr';

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


function MapInner() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [activeFloat, setActiveFloat] = useState<ArgoFloat | null>(null);
  const [isDataWindowOpen, setIsDataWindowOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { argoFloats, mutate: mutateArgoFloats } = useArgoFloats();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const parsedData = (results.data as any[]).map(row => {
              const lat = parseFloat(row.Latitude || row.lat);
              const lng = parseFloat(row.Longitude || row.lng);

              if (isNaN(lat) || isNaN(lng)) {
                throw new Error(`Invalid coordinate data for float: ${row.Float_ID || row.id}`);
              }

              const sea = row.sea || (row.Location_Reference?.toLowerCase().includes('arabian') ? 'Arabian Sea' : 'Bay of Bengal');

              return {
                id: row.Float_ID || row.id,
                lat: lat,
                lng: lng,
                location: row.Location_Reference || row.location,
                sea: sea
              };
            });
            mutateArgoFloats(parsedData, false);
            toast({
              title: "CSV Uploaded",
              description: `${parsedData.length} floats loaded onto the map.`,
            });
          } catch(error: any) {
            toast({
              title: "CSV Parsing Error",
              description: error.message || "Could not parse the CSV file. Please check the format.",
              variant: "destructive",
            });
          }
        },
        error: (error: any) => {
          toast({
            title: "File Read Error",
            description: error.message,
            variant: "destructive",
          });
        }
      });
    }
     if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleMarkerClick = useCallback((float: ArgoFloat) => {
    setActiveFloat(float);
    setIsDataWindowOpen(true);
  }, []);

  const getMarkerIcon = (sea: string, id: string) => {
    const isActive = activeFloat?.id === id && isDataWindowOpen;
    const isArabianSea = sea?.toLowerCase().includes('arabian');
    
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: isActive ? 10 : 7,
      fillColor: isArabianSea ? '#4DB6AC' : '#FFB74D',
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
        onClick={() => {
          setIsDataWindowOpen(false)
          setActiveFloat(null)
        }}
      >
        {argoFloats.map((float) => (
          <Marker
            key={float.id}
            position={{ lat: float.lat, lng: float.lng }}
            icon={getMarkerIcon(float.sea, float.id)}
            onClick={() => handleMarkerClick(float)}
            animation={google.maps.Animation.DROP}
          />
        ))}
      </GoogleMap>
    );
  };

  return (
    <div className="h-full w-full relative bg-background">
      {renderMap()}
      {activeFloat && (
          <FloatDataWindow 
            isOpen={isDataWindowOpen}
            onOpenChange={setIsDataWindowOpen}
            floatData={activeFloat}
          />
        )}
      <div className="absolute top-4 left-4">
        <Card className="glassmorphism border-border">
          <CardContent className="p-4">
            <h3 className="font-bold mb-4 text-foreground">Map Layers</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span>ARGO Floats ({argoFloats.length})</span>
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
            <div className="mt-4 flex flex-col gap-2">
               <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".csv"
              />
              <Button size="sm" variant="outline" onClick={triggerFileUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </Button>
              <div className="flex gap-2">
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

export function MapVisualization() {
  return (
    <SWRConfig>
      <MapInner />
    </SWRConfig>
  )
}
