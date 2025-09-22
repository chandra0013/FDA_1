import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { TechStackSection } from '@/components/sections/tech-stack-section';
import { SampleVisualsSection } from '@/components/sections/sample-visuals-section';
import { LogoCloudSection } from '@/components/sections/logo-cloud-section';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <div className="space-y-16 sm:space-y-24">
        <AboutSection />
        <FeaturesSection />
        <SampleVisualsSection />
        <TechStackSection />
        <LogoCloudSection />
      </div>
    </div>
  );
}
