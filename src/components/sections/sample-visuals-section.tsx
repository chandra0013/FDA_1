import { Card, CardContent } from '@/components/ui/card';
import {
  ProfileCrossSection,
  MonthlyTrendArea,
  KpiBars,
} from '@/components/dashboard/charts';
import {
  generateProfileCrossSectionData,
  generateMonthlyTrendData,
  generateKpiData,
} from '@/lib/dashboard-data';

const sampleCharts = [
  {
    title: 'Profile Cross-Section',
    component: <ProfileCrossSection data={generateProfileCrossSectionData(10)} />,
  },
  {
    title: 'Monthly Trends',
    component: <MonthlyTrendArea data={generateMonthlyTrendData(16)} />,
  },
  {
    title: 'KPI Comparison',
    component: <KpiBars data={generateKpiData()} />,
  },
];

export function SampleVisualsSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Visualize the Oceans
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            From depth profiles to time-series analysis, see the data come to life.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sampleCharts.map((chart, index) => {
            return (
              <Card key={index} className="overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative h-64 w-full bg-card p-4">
                    {chart.component}
                  </div>
                  <div className="p-6 bg-card">
                    <h3 className="text-lg font-semibold text-foreground">
                      {chart.title}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
