
'use client';

import {
  TsDiagram,
  VerticalProfiles,
  MultiDepthTimeSeries,
  QcFlagDistribution,
  DataComposition,
  CycleCount,
  DepthHistogram,
  JointTempDepth,
} from '@/components/datasets/charts';
import {
    generateTsData,
    generateVerticalProfileData,
    generateTimeSeriesData,
    generateQcData,
    generateCompositionData,
    generateCycleCountData,
    generateDepthHistogramData,
    generateJointDistData,
} from '@/lib/datasets-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';


const chartComponents = [
  {
    id: 'ts-diagram',
    title: 'Temperature–Salinity (T–S) Diagram',
    description: 'Identifies distinct water masses and mixing layers based on their T-S signatures.',
    component: <TsDiagram data={generateTsData(200)} />,
    className: 'xl:col-span-2',
  },
  {
    id: 'vertical-profiles',
    title: 'Vertical Profiles (Temp & Salinity)',
    description: 'Reveals thermocline, halocline, and stratification by plotting values against depth.',
    component: <VerticalProfiles data={generateVerticalProfileData(50)} />,
    className: 'xl:col-span-2',
  },
  {
    id: 'time-series',
    title: 'Multi-Depth Time Series',
    description: 'Tracks seasonal and interannual trends at surface (≤10 dbar) vs. deep (~1000 dbar) layers.',
    component: <MultiDepthTimeSeries data={generateTimeSeriesData(365)} />,
    className: 'xl:col-span-4',
  },
  {
    id: 'qc-distribution',
    title: 'QC Flag Distribution',
    description: 'Summarizes data quality across sensors, guiding filtering and analysis decisions.',
    component: <QcFlagDistribution data={generateQcData()} />,
    className: 'xl:col-span-2',
  },
    {
    id: 'composition',
    title: 'Dataset Composition',
    description: 'Shows the mix of data modes (Real-time vs. Adjusted) and platform models in the dataset.',
    component: <DataComposition data={generateCompositionData()} />,
    className: 'xl:col-span-2',
  },
  {
    id: 'cycle-count',
    title: 'Profiles per Float (Cycle Count)',
    description: 'Identifies long-term performers vs. floats with potential early failures.',
    component: <CycleCount data={generateCycleCountData(25)} />,
    className: 'xl:col-span-2',
  },
    {
    id: 'depth-histogram',
    title: 'Depth Histogram',
    description: 'Reveals sampling density by depth, highlighting well-sampled and under-sampled ranges.',
    component: <DepthHistogram data={generateDepthHistogramData(500)} />,
    className: 'xl:col-span-2',
  },
    {
    id: 'joint-distribution',
    title: 'Joint Distribution (Temp & Depth)',
    description: 'Characterizes temperature variability and distribution at key depth ranges.',
    component: <JointTempDepth data={generateJointDistData(500)} />,
    className: 'xl:col-span-4',
  },
];

export default function DatasetsPage() {
  return (
    <>
      <div className="pt-24 pb-16 container">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
              Argo Float Dataset Explorer
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              A suite of domain-relevant visualizations for oceanographic analysis. No maps, just charts.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {chartComponents.map((chart) => (
            <Card key={chart.id} className={`bg-card border-border shadow-sm rounded-xl ${chart.className}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-bold text-base">{chart.title}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">{chart.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[300px]">
                {chart.component}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
