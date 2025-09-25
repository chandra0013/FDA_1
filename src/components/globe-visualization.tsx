
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useArgoFloats, type ArgoFloat } from '@/hooks/use-argo-floats';
import { FloatDataWindow } from './float-data-window';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { Map } from 'lucide-react';
import Link from 'next/link';

// Dynamically import react-globe.gl to avoid SSR issues
import type { GlobeMethods } from 'react-globe.gl';
import Globe from 'react-globe.gl';

export function GlobeVisualization() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [activeFloat, setActiveFloat] = useState<ArgoFloat | null>(null);
  const [isDataWindowOpen, setIsDataWindowOpen] = useState(false);
  const { argoFloats } = useArgoFloats();

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.2;
      globeRef.current.pointOfView({ lat: 20, lng: 80, altitude: 2 });
    }
  }, []);

  const handlePointClick = useCallback((point: object) => {
    const float = point as ArgoFloat;
    setActiveFloat(float);
    setIsDataWindowOpen(true);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: float.lat, lng: float.lng, altitude: 0.5 }, 1000);
      globeRef.current.controls().autoRotate = false;
    }
  }, []);

  const getPointColor = (float: ArgoFloat) => {
    return float.sea?.toLowerCase().includes('arabian') ? '#4DB6AC' : '#FFB74D';
  };

  return (
    <div className="h-screen w-full relative bg-black">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={argoFloats}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.01}
        pointRadius={0.25}
        pointColor={getPointColor}
        onPointClick={handlePointClick}
        onPointHover={(point) => {
          if (globeRef.current?.controls()) {
            (globeRef.current.controls() as any).domElement.style.cursor = point ? 'pointer' : 'default';
          }
        }}
      />
      {activeFloat && (
        <FloatDataWindow
          isOpen={isDataWindowOpen}
          onOpenChange={(isOpen) => {
            setIsDataWindowOpen(isOpen);
            if (!isOpen) {
              setActiveFloat(null);
              if (globeRef.current) {
                globeRef.current.controls().autoRotate = true;
              }
            }
          }}
          floatData={activeFloat}
        />
      )}
       <div className="absolute top-24 left-4 z-10">
        <Button asChild variant="outline">
          <Link href="/discover">
            <Map className="mr-2 h-4 w-4" />
            Back to 2D Map
          </Link>
        </Button>
      </div>
    </div>
  );
}
