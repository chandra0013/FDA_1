
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const pricingTiers = [
    {
        name: 'Free',
        price: '$0',
        period: '/ month',
        description: 'For students and enthusiasts to explore the basics.',
        features: [
            'Access to demo dataset',
            '100 AI queries per month',
            'Basic RAG capabilities',
            'Community support',
        ],
        cta: 'Start for Free',
        variant: 'outline'
    },
    {
        name: 'Pro',
        price: '$49',
        period: '/ month',
        description: 'For researchers and small teams needing full capabilities.',
        features: [
            'Full ARGO dataset access',
            '10,000 AI queries per month',
            'Advanced RAG with fine-tuning',
            '30-day forecast horizon',
            'Email & chat support',
        ],
        cta: 'Go Pro',
        variant: 'default'
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large organizations with specific needs.',
        features: [
            'Unlimited queries & users',
            'Custom SLAs and support',
            'Bulk ingestion pipelines',
            'On-premise deployment options',
            'Dedicated account manager',
        ],
        cta: 'Contact Sales',
        variant: 'secondary'
    },
]

export default function PricingPage() {
  return (
    <div className="container py-24 sm:py-32">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
                Pricing & Licensing
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Choose the plan that's right for your ocean data exploration needs.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map(tier => (
                <Card key={tier.name} className={`flex flex-col ${tier.name === 'Pro' ? 'border-primary shadow-lg' : ''}`}>
                    <CardHeader>
                        <CardTitle>{tier.name}</CardTitle>
                        <CardDescription>{tier.description}</CardDescription>
                        <div className="flex items-baseline pt-4">
                            <span className="text-4xl font-bold">{tier.price}</span>
                            {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-4">
                            {tier.features.map(feature => (
                                <li key={feature} className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full" variant={tier.variant as any}>
                           <Link href="#">{tier.cta}</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
