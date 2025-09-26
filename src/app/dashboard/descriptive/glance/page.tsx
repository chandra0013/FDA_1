
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AreaChart as AreaChartComponent,
  BarChart,
  CompositionDonut,
  ForecastLineChart,
  KpiBars,
  OceanHealthScatter,
  Histogram,
} from '@/components/dashboard/charts';
import {
  generateCompositionData,
  generateKpiData,
  generateMonthlyTrendData,
  generateOceanHealthData,
} from '@/lib/dashboard-data';
import {
  AreaChart,
  ArrowDown,
  ArrowUp,
  BarChart2,
  Calendar,
  Eye,
  GitCommitHorizontal,
  HelpCircle,
  LineChart,
  PieChart,
  RefreshCw,
  ScatterChart,
} from 'lucide-react';
import { generateAllForecasts } from '@/lib/dashboard-forecast-data';

const kpiData = [
  { title: 'Mean Temp', value: '28.1°C', delta: '+0.2°C', deltaType: 'increase' as const },
  { title: 'Salinity', value: '35.4 PSU', delta: '-0.1 PSU', deltaType: 'decrease' as const },
  { title: 'Oxygen', value: '5.8 mg/L', delta: '+0.05 mg/L', deltaType: 'increase' as const },
  { title: 'Chlorophyll', value: '1.1 mg/m³', delta: '+5%', deltaType: 'increase' as const },
  { title: 'Anomaly Rate', value: '1.2%', delta: '-0.3%', deltaType: 'decrease' as const },
  { title: 'CO₂ Proxy Index', value: '89.3', delta: '+1.2', deltaType: 'increase' as const },
];

const forecastData = generateAllForecasts({ trainingDays: 100, horizon: '30d', variables: ['temperature'] }).results[0];
const compositionData = generateCompositionData();
const regionalData = generateKpiData();
const correlationData = generateOceanHealthData(120);
const distributionData = Array.from({length: 100}, () => ({ value: 5.8 + (Math.random() - 0.5) * 0.6 }));


type ChartType = 'Line' | 'Area' | 'Bar' | 'Donut' | 'Scatter' | 'HorizontalBar' | 'Histogram';

const chartComponents: { [key in ChartType]: React.ComponentType<any> } = {
  Line: ForecastLineChart,
  Area: AreaChartComponent,
  Bar: BarChart,
  Donut: CompositionDonut,
  Scatter: OceanHealthScatter,
  HorizontalBar: KpiBars,
  Histogram: Histogram,
};

const SmartChart = ({
  data,
  defaultType,
  allowedTypes,
}: {
  data: any;
  defaultType: ChartType;
  allowedTypes: ChartType[];
}) => {
  const [chartType, setChartType] = useState<ChartType>(defaultType);
  const ChartComponent = chartComponents[chartType];

  const chartProps: any = {};
  if (chartType === 'Line' && data?.stats) {
      chartProps.data = data.data;
      chartProps.range = data.range;
  } else {
      chartProps.data = data;
  }

  return (
    <>
      <div className="h-full w-full">
        {ChartComponent ? (
          <ChartComponent {...chartProps} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Chart not available
          </div>
        )}
      </div>
      <div className="absolute top-4 right-4">
        <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
          <SelectTrigger className="w-auto h-8 text-xs bg-background/80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allowedTypes.map((type) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-2">
                  {type === 'Line' && <LineChart className="w-4 h-4" />}
                  {type === 'Area' && <AreaChart className="w-4 h-4" />}
                  {type === 'Bar' && <BarChart2 className="w-4 h-4" />}
                  {type === 'Donut' && <PieChart className="w-4 h-4" />}
                  {type === 'Scatter' && <ScatterChart className="w-4 h-4" />}
                  {type === 'HorizontalBar' && <GitCommitHorizontal className="w-4 h-4 rotate-90" />}
                  {type === 'Histogram' && <BarChart2 className="w-4 h-4" />}
                  <span className="text-xs">{type}</span>
                   {type === defaultType && <span className="text-xs text-primary ml-2">(Default)</span>}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};


const GlanceHeader = () => (
    <Card className="col-span-12 bg-card/50 backdrop-blur-sm sticky top-2 z-20">
        <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Eye className="text-primary"/>
                    <h1 className="text-lg font-bold font-headline">Single-Screen Overview</h1>
                </div>
                 <div className="flex items-center gap-2">
                    <Select defaultValue="last-7d">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last-7d">Last 7 Days</SelectItem>
                            <SelectItem value="last-30d">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="all-regions">
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Region/Segment" />
                        </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="all-regions">All Regions</SelectItem>
                            <SelectItem value="arabian-sea">Arabian Sea</SelectItem>
                             <SelectItem value="bay-of-bengal">Bay of Bengal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs h-8"><RefreshCw className="mr-2 h-4 w-4"/> Reset</Button>
                <Button size="sm" className="text-xs h-8">Apply</Button>
            </div>
        </CardContent>
    </Card>
)

const KpiCard = ({ title, value, delta, deltaType }: { title: string, value: string, delta: string, deltaType: 'increase' | 'decrease' }) => (
    <Card className="bg-card/80">
        <CardHeader className="p-3">
            <CardDescription className="text-xs text-muted-foreground">{title}</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
            <div className="text-xl font-bold">{value}</div>
            <div className={`flex items-center text-xs mt-1 ${deltaType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
                {deltaType === 'increase' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                {delta}
            </div>
        </CardContent>
    </Card>
);

const ChartTile = ({title, subtitle, children, className}: {title: string, subtitle: string, children: React.ReactNode, className?: string}) => (
    <Card className={`relative bg-card/80 ${className}`}>
        <CardHeader className="py-3 px-4">
            <CardTitle className="text-base flex items-center gap-2">
                {title}
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><HelpCircle className="w-4 h-4 text-muted-foreground"/></TooltipTrigger>
                        <TooltipContent><p>{subtitle}</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardTitle>
        </CardHeader>
        <CardContent className="p-2 h-[calc(100%-48px)]">
            {children}
        </CardContent>
    </Card>
)

export default function GlancePage() {
  return (
    <div className="h-screen w-screen bg-background text-foreground p-2 flex flex-col gap-2">
      <GlanceHeader />
      <div className="grid grid-cols-12 gap-2 flex-1">
        
        {/* KPI Strip */}
        {kpiData.map(kpi => <div key={kpi.title} className="col-span-2"><KpiCard {...kpi} /></div>)}

        {/* Primary Tiles */}
        <ChartTile title="Time Trend" subtitle="Mean Temp (by region) with forecast band" className="col-span-6">
            <SmartChart data={forecastData} defaultType="Line" allowedTypes={['Line', 'Area', 'Bar']} />
        </ChartTile>
        <ChartTile title="Composition" subtitle="CO₂ Drivers Donut (hover for percent + absolute)" className="col-span-6">
             <SmartChart data={compositionData} defaultType="Donut" allowedTypes={['Donut', 'Bar']} />
        </ChartTile>

        {/* Secondary Tiles */}
         <ChartTile title="Regional Comparison" subtitle="Avg Temp by Region, last 7d" className="col-span-4">
            <SmartChart data={regionalData} defaultType="HorizontalBar" allowedTypes={['HorizontalBar', 'Bar']} />
        </ChartTile>
        <ChartTile title="Correlation" subtitle="Scatter Temp vs Nitrate sized by Oxygen" className="col-span-4">
             <SmartChart data={correlationData} defaultType="Scatter" allowedTypes={['Scatter']} />
        </ChartTile>
        <ChartTile title="Distribution" subtitle="Histogram of Oxygen with reference range" className="col-span-4">
             <SmartChart data={distributionData} defaultType="Histogram" allowedTypes={['Histogram', 'Bar']} />
        </ChartTile>

      </div>
    </div>
  );
}
