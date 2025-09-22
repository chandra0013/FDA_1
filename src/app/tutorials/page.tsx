import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, Bot } from 'lucide-react';
import Link from 'next/link';

const tutorials = [
  {
    id: 'tutorial-1',
    title: 'Comparing Salinity Profiles',
    description: 'Learn to load two ARGO floats, generate overlaid depth profiles, and interpret halocline features using FloatChat.',
    type: 'guide',
    image: 'https://picsum.photos/seed/tutorial1/800/600',
    imageHint: 'ocean profile chart',
  },
  {
    id: 'tutorial-2',
    title: 'Forecasting Seasonal Chlorophyll',
    description: 'A video walkthrough on using RAG to query bloom events and forecast productivity peaks with the predictive dashboard.',
    type: 'video',
    image: 'https://picsum.photos/seed/tutorial2/800/600',
    imageHint: 'chlorophyll data animation',
  },
  {
    id: 'tutorial-3',
    title: 'Mapping Temperature Anomalies',
    description: 'A step-by-step guide to building spatial heatmaps of sea surface temperature anomalies and exporting the results.',
    type: 'guide',
    image: 'https://picsum.photos/seed/tutorial3/800/600',
    imageHint: 'ocean heatmap',
  },
    {
    id: 'tutorial-4',
    title: 'Automating with the API',
    description: 'Explore a Jupyter Notebook demonstrating data ingestion and visualization using the FloatChat API.',
    type: 'notebook',
    image: 'https://picsum.photos/seed/tutorial4/800/600',
    imageHint: 'code script',
  },
];

const TypeIcon = ({ type }: { type: string }) => {
  if (type === 'video') return <PlayCircle className="w-5 h-5" />;
  if (type === 'notebook') return <Bot className="w-5 h-5" />;
  return <FileText className="w-5 h-5" />;
};

export default function TutorialsPage() {
  return (
    <div className="container py-24 sm:py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          Tutorials & Use Cases
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Step-by-step guides and examples to help you master ocean data analysis with Oceanus AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={tutorial.image}
                  alt={tutorial.title}
                  fill
                  className="object-cover"
                  data-ai-hint={tutorial.imageHint}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <CardTitle>{tutorial.title}</CardTitle>
              <p className="mt-2 text-muted-foreground">{tutorial.description}</p>
            </CardContent>
            <CardFooter className="p-6 bg-card/50">
              <Button asChild className="w-full">
                <Link href="#">
                  <TypeIcon type={tutorial.type} />
                  <span className="capitalize ml-2">
                    {tutorial.type === 'guide' ? 'Read Guide' : tutorial.type === 'video' ? 'Watch Video' : 'Open Notebook'}
                  </span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
