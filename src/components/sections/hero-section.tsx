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
    <section className="relative h-screen w-full flex items-start justify-center pt-60">
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
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://ik.imagekit.io/ollvf7fhfm/Slowmotion_video_of_202509230220.mp4?updatedAt=1758574291289" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 flex flex-col items-center text-center px-4">
        {/* Title + Tagline grouped */}
        <div className="flex flex-col items-center space-y-2">
          <ShinyText className="text-6xl font-bold md:text-8xl from-primary to-foreground font-headline font-semibold">
            Blue Query
          </ShinyText>
          <BlurText
            text="Ocean Intelligence, Conversation by design"
            className="text-xl md:text-3xl text-foreground/80"
            delay={0.5}
          />
        </div>

        {/* Button */}
        <div className="mt-16">
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
