import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Thermometer, Wind } from 'lucide-react';

const dataParameters = [
  {
    icon: <Thermometer className="w-8 h-8 text-accent" />,
    title: 'Temperature',
    description: 'A crucial parameter for understanding ocean heat content, circulation, and climate change.',
  },
  {
    icon: <Droplets className="w-8 h-8 text-accent" />,
    title: 'Salinity',
    description: 'Measures the concentration of dissolved salts, key to determining ocean density and circulation patterns.',
  },
  {
    icon: <Wind className="w-8 h-8 text-accent" />,
    title: 'BGC Parameters',
    description: 'Biogeochemical (BGC) data includes oxygen, nitrate, and pH levels, vital for studying marine ecosystems.',
  }
];

const glossaryTerms = [
  {
    term: "ARGO Float",
    definition: "A global array of autonomous robotic instruments that drift with ocean currents and measure temperature, salinity, and other parameters in the upper ocean."
  },
  {
    term: "CTD Sensor",
    definition: "A primary instrument on ARGO floats that measures Conductivity, Temperature, and Depth, from which salinity and density are calculated."
  },
  {
    term: "BGC-Argo",
    definition: "An extension of the Argo program that adds biogeochemical sensors to floats to measure parameters like oxygen, nitrate, chlorophyll, and pH."
  },
  {
    term: "NetCDF",
    definition: "Network Common Data Form, a set of software libraries and self-describing, machine-independent data formats that support the creation, access, and sharing of array-oriented scientific data."
  }
];

export default function LearnPage() {
  const floatWorksImage = PlaceHolderImages.find(img => img.id === 'learn-infographic-1');
  const floatSensorsImage = PlaceHolderImages.find(img => img.id === 'learn-infographic-2');

  return (
    <div className="container py-24 sm:py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          Educational Resources
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your guided journey into the world of oceanographic data and the technology behind it.
        </p>
      </div>

      <div className="space-y-16">
        {/* Ocean Floats 101 */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-primary">Ocean Floats 101</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">How ARGO Floats Work</h3>
              <p className="text-muted-foreground">
                ARGO floats are marvels of engineering. They autonomously sink to a 'parking' depth, typically 1,000 meters, and drift with the currents for about nine days. Then, they descend to 2,000 meters before ascending to the surface, collecting data on temperature, salinity, and pressure as they rise. At the surface, they transmit their data to satellites before repeating the cycle. This global fleet provides a continuous, real-time snapshot of the ocean's interior.
              </p>
            </div>
            {floatWorksImage && (
              <Card className="overflow-hidden">
                <Image
                  src={floatWorksImage.imageUrl}
                  alt={floatWorksImage.description}
                  data-ai-hint={floatWorksImage.imageHint}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </Card>
            )}
          </div>
        </section>

        {/* Data Parameters Guide */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-primary">Data Parameters Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dataParameters.map(param => (
              <Card key={param.title} className="bg-card">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {param.icon}
                    <CardTitle>{param.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{param.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Scientific Impact */}
        <section>
            <h2 className="text-3xl font-bold mb-8 text-primary">Scientific Impact</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                 {floatSensorsImage && (
                    <Card className="overflow-hidden order-last lg:order-first">
                        <Image
                        src={floatSensorsImage.imageUrl}
                        alt={floatSensorsImage.description}
                        data-ai-hint={floatSensorsImage.imageHint}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover"
                        />
                    </Card>
                )}
                 <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">Revolutionizing Oceanography</h3>
                    <p className="text-muted-foreground">
                        The ARGO program has fundamentally changed our understanding of the oceans. It provides essential data for climate science, improving hurricane forecasts, managing fisheries, and understanding the ocean's role in the global carbon cycle. BGC-Argo floats are further enhancing this by providing crucial insights into ocean health and marine ecosystems.
                    </p>
                </div>
            </div>
        </section>


        {/* Glossary */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-primary">Glossary</h2>
          <Accordion type="single" collapsible className="w-full">
            {glossaryTerms.map(item => (
              <AccordionItem key={item.term} value={item.term}>
                <AccordionTrigger>{item.term}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.definition}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
