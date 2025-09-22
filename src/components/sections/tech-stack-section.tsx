import { Cpu, Database, Droplets, Library } from 'lucide-react';

const technologies = [
  { name: 'RAG Pipeline', icon: <Library className="h-8 w-8 text-primary" /> },
  { name: 'Large Language Models', icon: <Cpu className="h-8 w-8 text-primary" /> },
  { name: 'NetCDF Processing', icon: <Droplets className="h-8 w-8 text-primary" /> },
  { name: 'Vector Database', icon: <Database className="h-8 w-8 text-primary" /> },
];

export function TechStackSection() {
  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="container text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          Built on a Foundation of Innovation
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
          Integrating cutting-edge AI and data processing technologies to deliver unparalleled performance and insight.
        </p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {technologies.map((tech) => (
            <div key={tech.name} className="flex flex-col items-center gap-4">
              {tech.icon}
              <p className="text-sm font-semibold text-foreground">{tech.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
