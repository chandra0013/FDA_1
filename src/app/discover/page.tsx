
import { MapVisualization } from '@/components/map-visualization';
import { ChatInterface } from '@/components/chat-interface';

export default function DiscoverPage() {
  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2 pt-20 gap-4 p-4">
      <div className="relative h-full w-full rounded-lg overflow-hidden border border-border">
          <MapVisualization />
      </div>
      <div className="relative h-full w-full rounded-lg overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
