
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { generateAnomalyData, type Anomaly } from '@/lib/dashboard-forecast-data';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { HelpCircle } from 'lucide-react';

const allAnomalies = generateAnomalyData(250);

export function AnomalyDetection() {
  const [sensitivity, setSensitivity] = useState(0.8);

  const filteredAnomalies = useMemo(() => {
    // Higher sensitivity means we want a higher anomaly score threshold.
    // The raw scores are from 0 to 0.2. We map the 0-1 slider to this range.
    const scoreThreshold = sensitivity * 0.2;
    return allAnomalies.filter(a => a.anomaly_score >= scoreThreshold).slice(0, 50);
  }, [sensitivity]);

  return (
    <Card className="xl:col-span-4 bg-card border-border shadow-sm rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Anomaly Detection</CardTitle>
            <CardDescription>
              Identify potential sensor anomalies using a simulated Isolation Forest model.
            </CardDescription>
          </div>
           <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="max-w-xs">
                    This table shows data points flagged as potential anomalies. Adjust the sensitivity slider to change the anomaly score threshold. A higher sensitivity will only show the most anomalous points.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="sensitivity-slider" className="text-sm font-medium">Detection Sensitivity</label>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-muted-foreground">Low</span>
            <Slider
              id="sensitivity-slider"
              min={0}
              max={1}
              step={0.05}
              value={[sensitivity]}
              onValueChange={(value) => setSensitivity(value[0])}
            />
             <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Found {filteredAnomalies.length} potential anomalies with current sensitivity setting.
          </p>
        </div>
        <div className="rounded-md border">
          <ScrollArea className="h-72">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Temp (°C)</TableHead>
                  <TableHead className="text-right">Salinity</TableHead>
                  <TableHead className="text-right">Oxygen</TableHead>
                  <TableHead className="text-right">Chlorophyll</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnomalies.map((anomaly) => (
                  <TableRow key={anomaly.id}>
                    <TableCell>{anomaly.platform_number}</TableCell>
                    <TableCell>{anomaly.date_str}</TableCell>
                    <TableCell className="text-right">{anomaly.temperature.toFixed(4)}</TableCell>
                    <TableCell className="text-right">{anomaly.salinity.toFixed(4)}</TableCell>
                    <TableCell className="text-right">{anomaly.oxygen_mg_per_L.toFixed(4)}</TableCell>
                    <TableCell className="text-right">{anomaly.chlorophyll_mg_m3.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
