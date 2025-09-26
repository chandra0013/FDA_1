
'use client';

import { useState, useMemo, useRef } from 'react';
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
} from '@/lib/dashboard-data';
import { Button } from '@/components/ui/button';
import { Download, Filter, Expand, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const GridLayout = WidthProvider(RGL);

const initialCharts = [
  { id: 'ocean-health', title: 'Ocean Health', description: 'Temp vs. Nitrate', component: OceanHealthScatter, data: generateOceanHealthData(120), layout: { x: 0, y: 0, w: 3, h: 2 } },
  { id: 'kpi-bars', title: 'Regional KPIs', description: 'Key variables', component: KpiBars, data: generateKpiData(), layout: { x: 3, y: 0, w: 3, h: 2 } },
  { id: 'co2-drivers', title: 'CO₂ Drivers', description: 'Contribution analysis', component: CompositionDonut, data: generateCompositionData(), layout: { x: 6, y: 0, w: 3, h: 2 } },
  { id: 'oxygen-drivers', title: 'Oxygen Drivers', description: 'Sensitivity analysis', component: TornadoSensitivity, data: generateTornadoData(), layout: { x: 9, y: 0, w: 3, h: 2 } },
  { id: 'monthly-trends', title: 'Monthly Trends', description: 'Chlorophyll & PAR', component: MonthlyTrendArea, data: generateMonthlyTrendData(16), layout: { x: 0, y: 2, w: 4, h: 2 } },
  { id: 'daily-activity', title: 'Daily Activity', description: 'Profiles by platform', component: StackedDailyActivity, data: generateStackedDailyData(30), layout: { x: 4, y: 2, w: 4, h: 2 } },
  { id: 'facility-utilization', title: 'Facility Utilization', description: 'Ops percentage', component: FacilityUtilization, data: generateFacilityUtilizationData(), layout: { x: 8, y: 2, w: 4, h: 2 } },
  { id: 'radial-gauges', title: 'Health Index', description: 'Baseline vs. Optimized', component: DualRadialGauges, data: generateRadialGaugeData(), layout: { x: 0, y: 4, w: 2, h: 2 } },
];

const ChartTile = ({ chart, onExpand }: { chart: any, onExpand: (chart: any) => void }) => (
  <Card key={chart.id} className="bg-card/80 glassmorphism flex flex-col group">
    <CardHeader className="py-2 px-3 flex-row items-center justify-between">
      <div>
        <CardTitle className="text-xs font-semibold">{chart.title}</CardTitle>
        <CardDescription className="text-xs">{chart.description}</CardDescription>
      </div>
      <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => onExpand(chart)}>
        <Expand className="w-3 h-3" />
      </Button>
    </CardHeader>
    <CardContent className="p-1 flex-grow">
      <chart.component data={chart.data} />
    </CardContent>
  </Card>
);

export default function GlancePage() {
  const [expandedChart, setExpandedChart] = useState<any | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const layout = useMemo(() => initialCharts.map(c => ({...c.layout, i: c.id})), []);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    const canvas = await html2canvas(reportRef.current, { 
      backgroundColor: '#1E1E1E',
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('dashboard_glance_report.pdf');
    setIsDownloading(false);
  };


  return (
    <div className="pt-24 pb-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Single Shot Glance
            </h1>
            <p className="mt-1 text-muted-foreground">
              A high-density overview of key performance indicators.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8"><Filter className="mr-2 h-3 w-3"/>Filters</Button>
            <Button onClick={handleDownloadReport} disabled={isDownloading} size="sm" className="h-8">
              {isDownloading ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <Download className="mr-2 h-3 w-3" />
              )}
              Download Report
            </Button>
          </div>
        </div>
      </div>
      
      <div ref={reportRef} className="p-2">
        <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={80}
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
      </div>

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
