
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Database, Download, FileText, UploadCloud } from 'lucide-react';

const flowchartNodes = [
  {
    icon: <UploadCloud className="w-12 h-12 text-accent" />,
    title: 'Data Ingestion',
    description: 'Raw NetCDF files are processed into SQL/Parquet for structured data and indexed in a Vector DB for semantic search.',
  },
  {
    icon: <Bot className="w-12 h-12 text-accent" />,
    title: 'Conversational Query',
    description: 'User queries are enhanced using Retrieval-Augmented Generation (RAG) and processed by the Gemini API for natural language understanding.',
  },
  {
    icon: <Database className="w-12 h-12 text-accent" />,
    title: 'Visualization Dashboard',
    description: 'The AI generates insights for both Descriptive (what happened) and Predictive (what will happen) analytics dashboards.',
  },
  {
    icon: <Download className="w-12 h-12 text-accent" />,
    title: 'Report Generation',
    description: 'Users can download their findings and visualizations as a comprehensive, professionally formatted PDF report.',
  },
    {
    icon: <FileText className="w-12 h-12 text-accent" />,
    title: 'Education & Tutorials',
    description: 'Interactive guides and resources help users learn about oceanography and how to use the platform effectively.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container py-24 sm:py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          How Blue Query Works
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          From raw data to actionable insights, this is the Blue Query pipeline.
        </p>
      </div>

      <div className="relative">
        <div className="flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-6xl">
                {flowchartNodes.map((node, index) => (
                <div key={node.title} className="relative flex flex-col items-center">
                    <Card className="bg-card flex flex-col text-center hover:border-primary transition-colors w-full h-full">
                    <CardHeader className="items-center">
                        {node.icon}
                        <CardTitle className="mt-4 text-base">{node.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription className="text-xs">{node.description}</CardDescription>
                    </CardContent>
                    </Card>
                    {index < flowchartNodes.length - 1 && (
                    <ArrowRight className="absolute top-1/2 -right-4 -translate-y-1/2 h-8 w-8 text-muted-foreground hidden md:block" />
                    )}
                </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
