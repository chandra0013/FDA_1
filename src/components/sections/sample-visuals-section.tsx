import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const sampleCharts = [
  {
    title: "Salinity Profile",
    imageId: 'sample-chart-1'
  },
  {
    title: "Temperature over Time",
    imageId: 'sample-chart-2'
  },
  {
    title: "BGC Parameter Comparison",
    imageId: 'sample-chart-3'
  }
];

export function SampleVisualsSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Visualize the Oceans
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            From depth profiles to time-series analysis, see the data come to life.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sampleCharts.map((chart, index) => {
            const image = PlaceHolderImages.find((img) => img.id === chart.imageId);
            return (
              <Card key={index} className="overflow-hidden group">
                <CardContent className="p-0">
                  {image && (
                    <div className="relative h-64 w-full">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        data-ai-hint={image.imageHint}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 bg-card">
                    <h3 className="text-lg font-semibold text-foreground">
                      {chart.title}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
