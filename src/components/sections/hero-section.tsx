import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShinyText } from '../animations/shiny-text';
import { BlurText } from '../animations/blur-text';
import { StarBorder } from '../animations/star-border';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <section className="relative h-screen w-full flex items-center justify-center">
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
        <ShinyText className="text-5xl font-bold md:text-7xl">
          Oceanus AI
        </ShinyText>
        <BlurText
          text="AI-Powered Ocean Data Discovery"
          className="mt-4 text-lg md:text-2xl text-foreground/80"
          delay={0.5}
        />
        <div className="mt-8">
          <StarBorder asChild>
            <Link href="/discover">Explore FloatChat</Link>
          </StarBorder>
        </div>
      </div>
    </section>
  );
}
