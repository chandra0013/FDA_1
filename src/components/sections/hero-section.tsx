import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShinyText } from '../animations/shiny-text';
import { BlurText } from '../animations/blur-text';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <section className="relative h-screen w-full flex items-start justify-center pt-48">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Title + Tagline grouped */}
        <div className="flex flex-col items-center space-y-2">
          <ShinyText className="text-6xl font-bold md:text-8xl from-primary to-foreground">
            Oceanus AI
          </ShinyText>
          <BlurText
            text="AI-Powered Ocean Data Discovery"
            className="text-xl md:text-3xl text-foreground/80"
            delay={0.5}
          />
        </div>

        {/* Button */}
        <div className="mt-12">
          <Button
            asChild
            variant="accent"
            size="lg"
            className="text-lg px-10 py-6 shadow-[0_0_20px_hsl(var(--accent))] hover:shadow-[0_0_30px_hsl(var(--accent))] transition-shadow"
          >
            <Link href="/discover">
              Explore FloatChat
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
