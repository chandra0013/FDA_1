
'use client';

import { useState, useMemo } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  generateOceanHealthData,
  generateKpiData,
  generateCompositionData,
  generateMonthlyTrendData,
  generateTornadoData,
  generateFacilityUtilizationData,
  generateStackedDailyData,
  generateRadialGaugeData,
  generateProfileCrossSectionData,
} from '@/lib/dashboard-data';
import { Button } from '@/components/ui/button';
import { Download, Filter, Expand, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const GridLayout = WidthProvider(RGL);

const initialCharts = [
  { id: 'ocean-health', title: 'Overview: Ocean Health', description: 'Temp vs. Nitrate', component: OceanHealthScatter, data: generateOceanHealthData(120), layout: { x: 0, y: 0, w: 4, h: 2 } },
  { id: 'kpi-bars', title: 'KPIs: Regional', description: 'Key variables comparison', component: KpiBars, data: generateKpiData(), layout: { x: 4, y: 0, w: 4, h: 2 } },
  { id: 'co2-drivers', title: 'CO₂ Drivers', description: 'Contribution analysis', component: CompositionDonut, data: generateCompositionData(), layout: { x: 8, y: 0, w: 4, h: 2 } },
  { id: 'monthly-trends', title: 'Monthly Trends', description: 'Chlorophyll & PAR', component: MonthlyTrendArea, data: generateMonthlyTrendData(16), layout: { x: 0, y: 2, w: 6, h: 2 } },
  { id: 'oxygen-drivers', title: 'Oxygen Drivers', description: 'Sensitivity analysis', component: TornadoSensitivity, data: generateTornadoData(), layout: { x: 6, y: 2, w: 6, h: 2 } },
  { id: 'daily-activity', title: 'Daily Activity', description: 'Profiles by platform', component: StackedDailyActivity, data: generateStackedDailyData(30), layout: { x: 0, y: 4, w: 8, h: 2 } },
  { id: 'facility-utilization', title: 'Facility Utilization', description: 'Ops percentage', component: FacilityUtilization, data: generateFacilityUtilizationData(), layout: { x: 8, y: 4, w: 4, h: 2 } },
];

const ChartTile = ({ chart, onExpand }: { chart: any, onExpand: (chart: any) => void }) => (
  <Card key={chart.id} className="bg-card/80 glassmorphism flex flex-col group">
    <CardHeader className="py-3 px-4 flex-row items-center justify-between">
      <div>
        <CardTitle className="text-sm font-semibold">{chart.title}</CardTitle>
        <CardDescription className="text-xs">{chart.description}</CardDescription>
      </div>
      <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => onExpand(chart)}>
        <Expand className="w-4 h-4" />
      </Button>
    </CardHeader>
    <CardContent className="p-1 flex-grow">
      <chart.component data={chart.data} />
    </CardContent>
  </Card>
);

export default function GlancePage() {
  const [expandedChart, setExpandedChart] = useState<any | null>(null);

  const layout = useMemo(() => initialCharts.map(c => ({...c.layout, i: c.id})), []);

  return (
    <div className="pt-24 pb-8 container mx-auto px-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          Single Shot Glance
        </h1>
        <p className="mt-2 max-w-3xl mx-auto text-muted-foreground">
          Overview of key visualizations on a single canvas. Click any tile to expand and explore.
        </p>
      </div>
      
      <Card className="p-2 mb-6 bg-card/80 glassmorphism">
        <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground"/>
            <p className="text-sm text-muted-foreground">Global Filters:</p>
            <Button variant="outline" size="sm" className="h-8">Date Range</Button>
            <Button variant="outline" size="sm" className="h-8">Region</Button>
        </div>
      </Card>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={100}
        isDraggable={false}
        isResizable={false}
        margin={[8, 8]}
      >
        {initialCharts.map((chart) => (
          <div key={chart.id}>
            <ChartTile chart={chart} onExpand={setExpandedChart} />
          </div>
        ))}
      </GridLayout>

      <Dialog open={!!expandedChart} onOpenChange={(isOpen) => !isOpen && setExpandedChart(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          {expandedChart && (
            <>
              <DialogHeader className="p-4 border-b">
                <DialogTitle>{expandedChart.title}</DialogTitle>
                <DialogDescription>{expandedChart.description}</DialogDescription>
              </DialogHeader>
              <div className="flex-grow p-4 min-h-0">
                <expandedChart.component data={expandedChart.data} />
              </div>
              <div className="p-4 border-t bg-card/50">
                  <p className="text-sm font-semibold mb-2">Options</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm"><Download className="mr-2 h-4 w-4"/>Save as Variant</Button>
                     <Button variant="outline" size="sm">Reset to Default</Button>
                  </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
