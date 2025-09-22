'use client';

import { useState, useRef } from 'react';
import type { ForecastData, ForecastVariable, ForecastResult } from '@/lib/dashboard-forecast-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Edit } from 'lucide-react';
import { ForecastLineChart } from './charts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ForecastDashboardProps {
  forecastData: ForecastData;
  onReconfigure: () => void;
}

export function ForecastDashboard({ forecastData, onReconfigure }: ForecastDashboardProps) {
  const { params, results, narrative } = forecastData;
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadChart = async (variable: ForecastVariable) => {
    const chartElement = document.getElementById(`chart-${variable}`);
    if (chartElement) {
        const canvas = await html2canvas(chartElement, { backgroundColor: null });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${variable}_forecast.png`;
        link.click();
    }
  };

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    const pdf = new jsPDF('p', 'px', 'a4');
    const canvas = await html2canvas(reportRef.current, { 
      scale: 2,
      backgroundColor: '#1E1E1E'
    });
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save('forecast_report.pdf');
    setIsDownloading(false);
  };


  return (
    <div className="pt-24 pb-16 container" ref={reportRef}>
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
                Predictive Analytics Dashboard
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Forecasting from {params.trainingDays} days of data for the next {params.horizon}.
            </p>
            <div className="mt-4 flex gap-4 justify-center">
                <Button onClick={onReconfigure}>
                    <Edit className="mr-2 h-4 w-4" />
                    Reconfigure
                </Button>
                <Button onClick={handleDownloadReport} disabled={isDownloading}>
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? 'Generating...' : 'Download Full Report (PDF)'}
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="xl:col-span-4 bg-card border-border shadow-sm rounded-xl">
                <CardHeader>
                    <CardTitle>Narrative Insights</CardTitle>
                    <CardDescription>Key trends and takeaways from the forecast.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-invert text-muted-foreground">
                        {narrative.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                </CardContent>
            </Card>

            {results.map((result) => (
            <Card key={result.variable} className="bg-card border-border shadow-sm rounded-xl xl:col-span-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-bold capitalize">{result.variable}</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {result.stats.narrative}
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDownloadChart(result.variable)}>
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="h-[300px]" id={`chart-${result.variable}`}>
                   <ForecastLineChart data={result.data} range={result.range} />
                </CardContent>
            </Card>
            ))}
        </div>
    </div>
  );
}
