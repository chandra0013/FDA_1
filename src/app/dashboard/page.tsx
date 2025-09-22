import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-stars"></div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Mode
          </h1>
          <p className="text-lg text-muted-foreground">
            Tailored experiences for analysis and forecasting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-card border-border p-8 hover:shadow-2xl hover:shadow-amber-500/10 transition-all">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <BarChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Descriptive Analytics Mode
              </h3>
              <p className="text-muted-foreground mb-6">
                Explore current ocean conditions with real-time visualizations and historical trend analysis
              </p>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/dashboard/descriptive">
                  Get Started →
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="bg-card border-border p-8 hover:shadow-2xl hover:shadow-primary/10 transition-all">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Predictive Analytics Mode
              </h3>
              <p className="text-muted-foreground mb-6">
                Forecast future ocean conditions using AI models and machine learning algorithms
              </p>
              <Button disabled variant="secondary">
                Join Workspace →
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
