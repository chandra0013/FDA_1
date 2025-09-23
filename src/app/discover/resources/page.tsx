
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, Bot } from 'lucide-react';
import Link from 'next/link';

const resources = [
  {
    type: 'guide',
    title: 'Build your first ARGO query',
    description: 'A hands-on guide to asking questions and getting data from the chat interface.',
  },
  {
    type: 'video',
    title: 'Forecast chlorophyll using seasonal naive',
    description: 'A video walkthrough of setting up and interpreting a simple predictive model.',
  },
  {
    type: 'notebook',
    title: 'Embed FloatChat in Streamlit',
    description: 'A Jupyter notebook demonstrating how to integrate Blue Query into a Streamlit app.',
  },
    {
    type: 'guide',
    title: 'Understanding BGC Parameters',
    description: 'An in-depth look at the biogeochemical data available and its significance.',
  },
];

const TypeIcon = ({ type }: { type: string }) => {
  if (type === 'video') return <PlayCircle className="w-5 h-5 mr-2" />;
  if (type === 'notebook') return <Bot className="w-5 h-5 mr-2" />;
  return <FileText className="w-5 h-5 mr-2" />;
};


export default function ResourcesPage() {
  return (
    <div className="container py-24 sm:py-32">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
                Resources & Tutorials
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Learn, build, and get inspired with our collection of guides, videos, and notebooks.
            </p>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource) => (
                <Card key={resource.title}>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TypeIcon type={resource.type} />
                            {resource.title}
                        </CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="secondary">
                            <Link href="#">
                                {resource.type === 'video' ? 'Watch Video' : resource.type === 'notebook' ? 'Open Notebook' : 'Read Guide'}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
