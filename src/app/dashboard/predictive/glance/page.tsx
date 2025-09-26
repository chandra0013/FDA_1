
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AreaChart as AreaChartComponent,
  BarChart,
  ForecastLineChart,
} from '@/components/dashboard/charts';
import { AnomalyDetection } from '@/components/dashboard/anomaly-detection';
import {
  generateAllForecasts
} from '@/lib/dashboard-forecast-data';
import { ArrowDown, ArrowUp, BarChart2, TrendingUp, TrendingDown, ShieldCheck, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, Bar as RechartsBar } from 'recharts';

const forecastData = generateAllForecasts({ trainingDays: 100, horizon: '30d', variables: ['temperature', 'salinity', 'oxygen', 'chlorophyll'] });


const KpiCard = ({ title, value, delta, deltaType, icon }: { title: string, value: string, delta: string, deltaType: 'increase' | 'decrease' | 'stable', icon: React.ReactNode }) => (
    <Card className="bg-card/80">
        <CardHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
                <CardDescription className="text-sm text-muted-foreground">{title}</CardDescription>
                {icon}
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold">{value}</div>
            <div className={`flex items-center text-xs mt-1 ${deltaType === 'increase' ? 'text-green-400' : deltaType === 'decrease' ? 'text-red-400' : 'text-muted-foreground'}`}>
                {deltaType === 'increase' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                {delta}
            </div>
        </CardContent>
    </Card>
);

const TrendComparisonChart = ({ results }: { results: typeof forecastData.results }) => {
    const data = results.map(r => ({
        name: r.variable,
        trend: r.stats.trend * 1000 // Scale for visibility
    }));
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 80, right: 30 }}>
                <RechartsBar dataKey="trend" fill="hsl(var(--chart-4))" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} width={80} />
            </BarChart>
        </ResponsiveContainer>
    );
};

const ConfidenceDistributionChart = ({ results }: { results: typeof forecastData.results }) => {
    const data = results.map(r => ({
        name: r.variable,
        confidence: r.stats.confidence
    }));
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <RechartsBar dataKey="confidence" unit="%" fill="hsl(var(--chart-2))" />
                <YAxis type="number" domain={[0,100]} stroke="hsl(var(--muted-foreground))" />
                <XAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" />
            </BarChart>
        </ResponsiveContainer>
    );
};


export default function PredictiveGlancePage() {
    const primaryForecast = forecastData.results[0]; // Temperature
    const overallConfidence = Math.round(forecastData.results.reduce((acc, r) => acc + r.stats.confidence, 0) / forecastData.results.length);
    const trendingUpCount = forecastData.results.filter(r => r.stats.trend > 0).length;
    const trendingDownCount = forecastData.results.filter(r => r.stats.trend < 0).length;

  return (
    <div className="h-screen w-screen bg-background text-foreground p-2 flex flex-col gap-2">
      <div className="p-3 text-center">
        <h1 className="text-2xl font-bold font-headline">Predictive Glance View</h1>
        <p className="text-muted-foreground">A consolidated summary of the multi-variable forecast.</p>
      </div>

      <div className="grid grid-cols-12 gap-2 flex-1">
        
        {/* KPI Strip */}
        <div className="col-span-3">
            <KpiCard 
                title="Overall Confidence" 
                value={`${overallConfidence}%`} 
                delta={overallConfidence > 80 ? 'High Confidence' : 'Moderate'} 
                deltaType="stable"
                icon={overallConfidence > 80 ? <ShieldCheck className="text-green-500"/> : <ShieldAlert className="text-yellow-500" />}
            />
        </div>
         <div className="col-span-3">
            <KpiCard 
                title="Variables Trending Up" 
                value={trendingUpCount.toString()} 
                delta="Increasing trend" 
                deltaType="increase"
                icon={<TrendingUp className="text-primary"/>}
            />
        </div>
        <div className="col-span-3">
            <KpiCard 
                title="Variables Trending Down" 
                value={trendingDownCount.toString()} 
                delta="Decreasing trend" 
                deltaType="decrease"
                icon={<TrendingDown className="text-primary"/>}
            />
        </div>
        <div className="col-span-3">
            <KpiCard 
                title="Primary Forecast (Temp)" 
                value={`${primaryForecast.stats.min.toFixed(1)}-${primaryForecast.stats.max.toFixed(1)}°C`}
                delta={`Trend: ${primaryForecast.stats.trend.toFixed(3)}/day`} 
                deltaType={primaryForecast.stats.trend > 0 ? 'increase' : 'decrease'}
                icon={<BarChart2 className="text-primary"/>}
            />
        </div>

        {/* Primary Tile */}
        <Card className="col-span-12 xl:col-span-7 bg-card/80">
            <CardHeader>
                <CardTitle>Primary Forecast: {primaryForecast.variable}</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ForecastLineChart data={primaryForecast.data} range={primaryForecast.range} />
            </CardContent>
        </Card>

        {/* Anomaly Detection */}
        <div className="col-span-12 xl:col-span-5 h-[450px]">
            <AnomalyDetection />
        </div>
        
         {/* Secondary Tiles */}
        <Card className="col-span-12 xl:col-span-6 bg-card/80">
            <CardHeader><CardTitle>Trend Comparison (per day, scaled)</CardTitle></CardHeader>
            <CardContent className="h-64"><TrendComparisonChart results={forecastData.results} /></CardContent>
        </d-card>
        <Card className="col-span-12 xl-col-span-6 bg-card/80">
            <CardHeader><CardTitle>Confidence Distribution</CardTitle></CardHeader>
            <CardContent className="h-64"><ConfidenceDistributionChart results={forecastData.results} /></CardContent>
        </d-card>

      </div>
    </div>
  );
}
