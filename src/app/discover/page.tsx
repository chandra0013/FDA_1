import { MapVisualization } from '@/components/map-visualization';

export default function DiscoverPage() {
  return (
    <div className="h-screen w-full flex flex-col pt-20">
      <div className="flex-1 p-4">
        <div className="relative h-full w-full rounded-lg overflow-hidden border border-border">
          <MapVisualization />
        </div>
      </div>
    </div>
  );
}
