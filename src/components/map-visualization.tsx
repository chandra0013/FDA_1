import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from './ui/card';
import { Layers, Thermometer, Droplets } from 'lucide-react';

export function MapVisualization() {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-visualization');

  return (
    <div className="h-full w-full relative bg-background">
      {mapImage && (
        <Image
          src={mapImage.imageUrl}
          alt={mapImage.description}
          data-ai-hint={mapImage.imageHint}
          fill
          className="object-cover"
        />
      )}
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
