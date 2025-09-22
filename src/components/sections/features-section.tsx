import { BrainCircuit, AreaChart, MessagesSquare, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { TiltedCard } from '../animations/tilted-card';

const features = [
  {
    icon: <MessagesSquare className="w-8 h-8 text-accent" />,
    title: 'Natural Language Queries',
    description:
      'Ask complex questions in plain English and get immediate, understandable answers from our AI.',
  },
  {
    icon: <AreaChart className="w-8 h-8 text-accent" />,
    title: 'Real-time Data Visualization',
    description:
      'Generate interactive charts and maps on-the-fly to visualize ocean parameters and trends.',
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-accent" />,
    title: 'AI-Powered Insights',
    description:
      'Our AI analyzes data to uncover hidden patterns, correlations, and anomalies you might have missed.',
  },
  {
    icon: <BookOpen className="w-8 h-8 text-accent" />,
    title: 'Educational Resources',
    description:
      'Learn about oceanography and ARGO floats through our interactive tutorials and guided learning journeys.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            A New Wave of Data Exploration
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Powerful features designed for both novice explorers and expert researchers.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <TiltedCard key={index}>
                <Card className="bg-background/50 border-border/50 text-center h-full">
                <CardHeader>
                    <div className="mx-auto bg-card p-3 rounded-full mb-4 w-fit">
                    {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="pt-2">
                    {feature.description}
                    </CardDescription>
                </CardHeader>
                </Card>
            </TiltedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
