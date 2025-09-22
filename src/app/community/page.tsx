import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitMerge, MessageSquare, LifeBuoy, Map } from 'lucide-react';
import Link from 'next/link';

const communityLinks = [
  {
    icon: <MessageSquare className="w-12 h-12 text-accent" />,
    title: 'Community Forum',
    description: 'Join the conversation, ask questions, and share your findings with fellow ocean data enthusiasts.',
    href: '#',
    cta: 'Go to Forum',
  },
  {
    icon: <GitMerge className="w-12 h-12 text-accent" />,
    title: 'Issue Tracker',
    description: 'Found a bug or have a feature idea? Report it on our GitHub issue tracker to help us improve.',
    href: '#',
cta: 'View on GitHub',
  },
  {
    icon: <LifeBuoy className="w-12 h-12 text-accent" />,
    title: 'Documentation Center',
    description: 'Dive deep into our technical guides, data format specifications, and the glossary of terms.',
    href: '#',
    cta: 'Read Docs',
  },
  {
    icon: <Map className="w-12 h-12 text-accent" />,
    title: 'Product Roadmap',
    description: 'See what features are on the horizon, from global ARGO coverage to real-time buoy integration.',
    href: '#',
    cta: 'Explore Roadmap',
  },
];

export default function CommunityPage() {
  return (
    <div className="container py-24 sm:py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          Community & Support
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Connect with the community, get help, and contribute to the future of Blue Query.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {communityLinks.map((link) => (
          <Card key={link.title} className="bg-card flex flex-col">
            <CardHeader className="items-center text-center">
              {link.icon}
              <CardTitle className="mt-4">{link.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col text-center">
              <CardDescription className="flex-grow">{link.description}</CardDescription>
              <Button asChild variant="outline" className="mt-6">
                <Link href={link.href}>{link.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
