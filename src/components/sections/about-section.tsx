import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TiltedCard } from '../animations/tilted-card';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const aboutCards = [
  {
    title: 'Democratizing Data',
    description:
      'Our mission is to make complex oceanographic data accessible to researchers, students, and enthusiasts alike through an intuitive conversational interface.',
    imageId: 'about-card-1',
  },
  {
    title: 'Powered by AI',
    description:
      'Leveraging state-of-the-art Large Language Models and Retrieval-Augmented Generation to provide accurate, context-aware insights from the vast ARGO dataset.',
    imageId: 'about-card-2',
  },
  {
    title: 'Interactive Visualization',
    description:
      'Explore data like never before with dynamic charts, interactive maps, and real-time visualizations generated from your natural language queries.',
    imageId: 'about-card-3',
  },
];

export function AboutSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Discover the Depths
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Blue Query transforms how we interact with ocean data, turning complex datasets into clear, actionable knowledge.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutCards.map((card, index) => {
            const image = PlaceHolderImages.find((img) => img.id === card.imageId);
            return (
              <TiltedCard key={index}>
                <Card className="h-full overflow-hidden bg-card/80">
                  <CardContent className="p-0">
                    {image && (
                      <div className="relative aspect-[16/9] w-full">
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          data-ai-hint={image.imageHint}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-primary">{card.title}</h3>
                      <p className="mt-2 text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TiltedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
