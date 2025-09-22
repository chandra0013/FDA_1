'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const variablesToForecast = [
  'Temperature', 'Salinity', 'pH', 'Oxygen', 
  'Chlorophyll', 'Nitrate', 'bbp700', 'CDOM', 'PAR'
];

export default function PredictiveDashboardConfigPage() {
  const [selectedDays, setSelectedDays] = useState(20);

  const handleRunForecasts = () => {
    // Placeholder for future implementation
    console.log('Running forecasts with selected parameters...');
  };

  return (
    <div className="min-h-screen bg-background p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card border-border p-8">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">
              Configure Predictive Model
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Select training parameters for ocean forecasting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-foreground font-medium mb-3 block">
                Training Period
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[10, 20, 50, 100].map(days => (
                  <Button
                    key={days}
                    variant={selectedDays === days ? 'default' : 'outline'}
                    onClick={() => setSelectedDays(days)}
                  >
                    {days} Days
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-foreground font-medium mb-3 block">
                Forecast Horizon
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["10d", "20d", "30d", "1 month"].map(period => (
                  <Button key={period} variant="outline">
                    {period}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-foreground font-medium mb-3 block">
                Variables to Forecast
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {variablesToForecast.map(variable => (
                  <div key={variable} className="flex items-center space-x-2">
                    <Checkbox id={variable} defaultChecked />
                    <label htmlFor={variable} className="text-foreground text-sm">
                      {variable}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
              onClick={handleRunForecasts}
            >
              Run Predictive Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
