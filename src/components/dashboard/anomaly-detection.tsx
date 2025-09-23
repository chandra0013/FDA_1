
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { generateAnomalyData, type Anomaly } from '@/lib/dashboard-forecast-data';
import { ScrollArea } from '../ui/scroll-area';

const allAnomalies = generateAnomalyData(250);

export function AnomalyDetection() {
  const [sensitivity, setSensitivity] = useState(0.05);

  const filteredAnomalies = useMemo(() => {
    return allAnomalies.filter(a => a.anomaly_score >= sensitivity).slice(0, 50);
  }, [sensitivity]);

  return (
    <Card className="xl:col-span-4 bg-card border-border shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle>Anomaly Detection</CardTitle>
        <CardDescription>
          Identify potential sensor anomalies in the dataset using a simulated Isolation Forest model.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="sensitivity-slider" className="text-sm font-medium">Select Anomaly Detection Sensitivity</label>
          <div className="flex items-center gap-4 mt-2">
            <Slider
              id="sensitivity-slider"
              min={0.01}
              max={0.2}
              step={0.01}
              value={[sensitivity]}
              onValueChange={(value) => setSensitivity(value[0])}
            />
            <span className="text-primary font-mono text-sm w-12 text-center">{sensitivity.toFixed(2)}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Found {filteredAnomalies.length} potential anomalies in the dataset with a sensitivity of {Math.round(sensitivity * 100)}%.
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
                  <TableHead className="text-right">Nitrate</TableHead>
                  <TableHead className="text-right">pH</TableHead>
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
                    <TableCell className="text-right">{anomaly.nitrate_uM.toFixed(4)}</TableCell>
                    <TableCell className="text-right">{anomaly.pH.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        <p className="text-xs text-muted-foreground pt-2">
          The values in this table might indicate a sensor anomaly. You can adjust the sensitivity slider to find more or fewer anomalies.
        </p>
      </CardContent>
    </Card>
  );
}
