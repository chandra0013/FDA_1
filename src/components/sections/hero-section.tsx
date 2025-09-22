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
      <div className="relative z-10 text-center px-4">
        <ShinyText className="text-5xl font-bold md:text-7xl from-primary to-foreground">
          Oceanus AI
        </ShinyText>
        <BlurText
          text="Ocean intelligence, conversational by design"
          className="mt-4 text-lg md:text-2xl text-foreground/80"
          delay={0.5}
        />
        <div className="mt-8">
          <Button asChild variant="accent" size="lg" className="shadow-[0_0_20px_hsl(var(--accent))] hover:shadow-[0_0_30px_hsl(var(--accent))] transition-shadow">
            <Link href="/discover">
              Explore FloatChat
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
