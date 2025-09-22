import {
  OceanHealthScatter,
  KpiBars,
  CompositionDonut,
  MonthlyTrendArea,
  TornadoSensitivity,
  FacilityUtilization,
  StackedDailyActivity,
  DualRadialGauges,
  ProfileCrossSection,
} from '@/components/dashboard/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  generateOceanHealthData,
  generateKpiData,
  generateCompositionData,
  generateMonthlyTrendData,
  generateTornadoData,
  generateFacilityUtilizationData,
  generateStackedDailyData,
  generateRadialGaugeData,
  generateProfileCrossSectionData
} from '@/lib/dashboard-data';
import { DashboardChat } from '@/components/dashboard/dashboard-chat';


const chartComponents = [
  {
    id: 'ocean-health',
    title: 'Overview: Ocean Health',
    description: 'Thermal stress (Temp) vs. Carbon proxy (Nitrate), sized by Oxygen.',
    component: <OceanHealthScatter data={generateOceanHealthData(120)} />,
    className: 'xl:col-span-4',
  },
  {
    id: 'kpi-bars',
    title: 'KPIs: Baseline vs. Optimized',
    description: 'Comparison of key performance indicators before and after optimization.',
    component: <KpiBars data={generateKpiData()} />,
    className: 'xl:col-span-2',
  },
  {
    id: 'co2-drivers',
    title: 'Composition: CO₂ Drivers',
    description: 'Contribution of different drivers to the modeled CO₂ proxy.',
    component: <CompositionDonut data={generateCompositionData()} />,
    className: 'xl:col-span-2',
  },
  {
    id: 'monthly-trends',
    title: 'Monthly Trends: Chlorophyll & PAR',
    description: 'Seasonal variations in Chlorophyll and Downwelling PAR over 16 months.',
    component: <MonthlyTrendArea data={generateMonthlyTrendData(16)} />,
    className: 'xl:col-span-4',
  },
  {
    id: 'oxygen-drivers',
    title: 'Sensitivity: Drivers on Oxygen',
    description: 'Tornado plot showing the impact of various drivers on dissolved oxygen.',
    component: <TornadoSensitivity data={generateTornadoData()} />,
    className: 'xl:col-span-2',
  },
  {
    id: 'facility-utilization',
    title: 'Ops: Facility Utilization',
    description: 'Operational percentage for moorings, gliders, and float transects.',
    component: <FacilityUtilization data={generateFacilityUtilizationData()} />,
    className: 'xl:col-span-2',
  },
  {
    id: 'daily-activity',
    title: 'Activity: Daily Profiles by Platform',
    description: 'Number of profiles collected by each platform over the last 30 days.',
    component: <StackedDailyActivity data={generateStackedDailyData(30)} />,
    className: 'xl:col-span-4',
  },
  {
    id: 'radial-gauges',
    title: 'Index: Baseline vs. Optimized',
    description: 'Aggregate ocean health index comparison.',
    component: <DualRadialGauges data={generateRadialGaugeData()} />,
    className: 'xl-col-span-2',
  },
  {
    id: 'profile-cross-section',
    title: 'Profile: Recent Cross-Section',
    description: 'Temperature and Salinity time-series for the last 10 cycles.',
    component: <ProfileCrossSection data={generateProfileCrossSectionData(10)} />,
    className: 'xl:col-span-2',
  },
];

export default function DescriptiveDashboardPage() {
  return (
    <>
      <div className="pt-24 pb-16 container">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
              Descriptive Analytics Dashboard
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Analyzing operational and scientific performance metrics.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {chartComponents.map((chart) => (
            <Card key={chart.id} className={`bg-card border-border shadow-sm rounded-xl ${chart.className}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-bold">{chart.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">{chart.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[360px]">
                {chart.component}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <DashboardChat mode="descriptive" />
    </>
  );
}
