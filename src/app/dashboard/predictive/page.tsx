
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSimulation } from '@/components/dashboard/loading-simulation';
import { ForecastDashboard } from '@/components/dashboard/forecast-dashboard';
import type { ForecastData, ForecastVariable } from '@/lib/dashboard-forecast-data';
import { generateAllForecasts } from '@/lib/dashboard-forecast-data';
import { DashboardChat } from '@/components/dashboard/dashboard-chat';
import Link from 'next/link';
import { Eye } from 'lucide-react';


const variablesToForecast: { id: ForecastVariable, label: string }[] = [
  { id: 'temperature', label: 'Temperature' },
  { id: 'salinity', label: 'Salinity' },
  { id: 'ph', label: 'pH' },
  { id: 'oxygen', label: 'Oxygen' },
  { id: 'chlorophyll', label: 'Chlorophyll' },
  { id: 'nitrate', label: 'Nitrate' },
  { id: 'bbp700', label: 'BBP700' },
  { id: 'cdom', label: 'CDOM' },
  { id: 'downwelling_par', label: 'PAR' }
];

type PageState = 'configuring' | 'loading' | 'forecasting';

export default function PredictiveDashboardConfigPage() {
  const [pageState, setPageState] = useState<PageState>('configuring');
  const [selectedDays, setSelectedDays] = useState(50);
  const [selectedHorizon, setSelectedHorizon] = useState('30d');
  const [selectedVariables, setSelectedVariables] = useState<ForecastVariable[]>(variablesToForecast.map(v => v.id));
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  const handleRunForecasts = () => {
    setPageState('loading');
    const data = generateAllForecasts({
      trainingDays: selectedDays,
      horizon: selectedHorizon,
      variables: selectedVariables
    });
    setForecastData(data);
  };
  
  const handleToggleVariable = (variable: ForecastVariable) => {
    setSelectedVariables(prev => 
      prev.includes(variable) 
        ? prev.filter(v => v !== variable)
        : [...prev, variable]
    );
  };

  const handleSelectAll = () => setSelectedVariables(variablesToForecast.map(v => v.id));
  const handleDeselectAll = () => setSelectedVariables([]);


  if (pageState === 'loading') {
    return <LoadingSimulation onComplete={() => setPageState('forecasting')} />;
  }

  if (pageState === 'forecasting' && forecastData) {
    return <>
            <ForecastDashboard 
              forecastData={forecastData} 
              onReconfigure={() => setPageState('configuring')}
            />
            <DashboardChat 
              mode="predictive" 
              context={`Training Days: ${forecastData.params.trainingDays}, Horizon: ${forecastData.params.horizon}, Variables: ${forecastData.params.variables.join(', ')}`} 
            />
          </>;
  }

  return (
    <div className="min-h-screen bg-background p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card border-border p-8">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">
              Configure Predictive Model
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Select training parameters for ocean forecasting. Or, explore a pre-computed forecast.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-foreground font-medium mb-3 block">
                Training Period (Days)
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
                  <Button 
                    key={period} 
                    variant={selectedHorizon === period ? 'default' : 'outline'}
                    onClick={() => setSelectedHorizon(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-foreground font-medium">
                  Variables to Forecast
                </label>
                <div className="space-x-2">
                  <Button variant="link" size="sm" onClick={handleSelectAll}>Select All</Button>
                  <Button variant="link" size="sm" onClick={handleDeselectAll}>Deselect All</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md-grid-cols-3 gap-3">
                {variablesToForecast.map(variable => (
                  <div key={variable.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={variable.id} 
                      checked={selectedVariables.includes(variable.id)}
                      onCheckedChange={() => handleToggleVariable(variable.id)}
                    />
                    <label htmlFor={variable.id} className="text-foreground text-sm cursor-pointer">
                      {variable.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 flex-1"
                onClick={handleRunForecasts}
                disabled={selectedVariables.length === 0}
              >
                Run Predictive Analysis
              </Button>
               <Button asChild variant="secondary" className="text-lg py-6 flex-1">
                <Link href="/dashboard/predictive/glance">
                  <Eye className="mr-2" /> Open Glance View
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
