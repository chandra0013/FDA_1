import { MapVisualization } from '@/components/map-visualization';
import { ChatInterface } from '@/components/chat-interface';

export default function DiscoverPage() {
  return (
    <div className="h-screen w-full flex flex-col pt-20">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">
        <div className="relative rounded-lg overflow-hidden border border-border">
          <MapVisualization />
        </div>
        <div className="relative rounded-lg overflow-hidden border border-border">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
