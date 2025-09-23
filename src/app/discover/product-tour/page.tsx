
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

const tourModules = [
  {
    id: 'ingest',
    title: 'Ingest & Index',
    description: 'Easily upload your CSV or NetCDF files with a simple drag-and-drop interface. Connect directly to Firestore or BigQuery for seamless data integration.',
    image: 'https://picsum.photos/seed/tour-ingest/1200/800',
    imageHint: 'data upload interface'
  },
  {
    id: 'chat',
    title: 'Chat Interface',
    description: 'Launch the side-chat to ask questions in natural language. Use voice input for hands-free operation and explore example queries to get started quickly.',
    image: 'https://picsum.photos/seed/tour-chat/1200/800',
    imageHint: 'chat application screen'
  },
  {
    id: 'descriptive',
    title: 'Descriptive Dashboard',
    description: 'Visualize real-time ocean conditions, compare key performance indicators (KPIs), and explore data through interactive map and time-series panels.',
    image: 'https://picsum.photos/seed/tour-descriptive/1200/800',
    imageHint: 'dashboard charts'
  },
  {
    id: 'predictive',
    title: 'Predictive Dashboard',
    description: 'Configure AI models to forecast future conditions. Analyze forecast cards, review AI-generated insights, and download full reports.',
    image: 'https://picsum.photos/seed/tour-predictive/1200/800',
    imageHint: 'analytics dashboard'
  },
  {
    id: 'education',
    title: 'Educational Mode',
    description: 'Deepen your understanding with guided tutorials, a comprehensive glossary of oceanographic terms, and interactive demonstrations.',
    image: 'https://picsum.photos/seed/tour-education/1200/800',
    imageHint: 'e-learning platform'
  },
];

export default function ProductTourPage() {
  return (
    <div className="container py-24 sm:py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          Product Tour
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          A guided walkthrough of Blue Query's powerful features.
        </p>
      </div>

      <Tabs defaultValue="ingest" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          {tourModules.map(module => (
            <TabsTrigger key={module.id} value={module.id}>{module.title}</TabsTrigger>
          ))}
        </TabsList>
        {tourModules.map(module => (
          <TabsContent key={module.id} value={module.id}>
            <Card className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative aspect-video md:aspect-auto">
                        <Image 
                            src={module.image} 
                            alt={module.title}
                            data-ai-hint={module.imageHint}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-primary mb-4">{module.title}</h3>
                        <p className="text-muted-foreground">{module.description}</p>
                    </div>
                </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
