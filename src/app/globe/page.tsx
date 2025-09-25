
import dynamic from 'next/dynamic';

const GlobeVisualization = dynamic(
  () => import('@/components/globe-visualization').then(mod => mod.GlobeVisualization),
  { 
    ssr: false,
    loading: () => <div className="h-screen w-full flex items-center justify-center bg-background"><p>Loading Globe...</p></div>
  }
);

export default function GlobePage() {
  return (
    <div className="h-screen w-full">
      <GlobeVisualization />
    </div>
  );
}
