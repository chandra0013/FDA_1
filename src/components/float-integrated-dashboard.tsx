
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import type { ArgoFloat } from './map-visualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2, ListTree } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { handleFloatDashboardInsights } from '@/app/actions';
import {
    FloatSalinityPressureScatter,
    FloatProfileDepth,
    FloatQualityHistogram,
    FloatTSDiagram,
} from './dashboard/charts';
import { BarChart, Bar } from 'recharts';

interface FloatIntegratedDashboardProps {
  floatData: ArgoFloat;
}

// Simple pseudo-random number generator for deterministic data
const mulberry32 = (a: number) => {
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const generateDashboardData = (floatId: string) => {
    const seed = parseInt(floatId.replace( /^\D+/g, ''), 10) || 123;
    const random = mulberry32(seed);
    const randomInRange = (min: number, max: number) => min + random() * (max - min);

    // Salinity vs Pressure
    const salinityPressureData = Array.from({ length: 100 }, () => {
        const pressure = randomInRange(0, 2000);
        return {
            pressure,
            salinity: randomInRange(35.3, 35.6) - pressure/5000,
            qc: random() > 0.05 ? (random() > 0.1 ? 1 : 2) : 3,
        }
    });

    // Profile Depth
    const profileDepthData = Array.from({ length: 50 }, (_, i) => ({
        cycle: i + 1,
        depth: i < 40 ? randomInRange(1980, 2020) : randomInRange(1950, 1990),
    }));

    // Quality Histogram
    const qualityCounts = salinityPressureData.reduce((acc, d) => {
        if (d.qc === 1) acc.good++;
        else if (d.qc === 2) acc.probablyGood++;
        else acc.questionable++;
        return acc;
    }, { good: 0, probablyGood: 0, questionable: 0 });
    const total = qualityCounts.good + qualityCounts.probablyGood + qualityCounts.questionable;
    const qualityHistogramData = [
        { name: 'Good', count: qualityCounts.good, percent: (qualityCounts.good/total*100).toFixed(0) },
        { name: 'Prob Good', count: qualityCounts.probablyGood, percent: (qualityCounts.probablyGood/total*100).toFixed(0) },
        { name: 'Questionable', count: qualityCounts.questionable, percent: (qualityCounts.questionable/total*100).toFixed(0) },
    ];

    // T-S Diagram
    const tsDiagramData = Array.from({ length: 100 }, () => {
        const depth = randomInRange(0, 2000);
        return {
            depth,
            temperature: randomInRange(20, 29) - (depth / 200),
            salinity: randomInRange(35.2, 35.8) - (depth / 8000),
        }
    });

    return {
        salinityPressureData,
        profileDepthData,
        qualityHistogramData,
        tsDiagramData,
    };
};

export function FloatIntegratedDashboard({ floatData }: FloatIntegratedDashboardProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const dashboardData = useMemo(() => generateDashboardData(floatData.id), [floatData.id]);
  
  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      const summary = `
        - Temperature variability across 50 cycles: median 27.8 °C, interquartile range 0.9 °C.
        - Salinity decreases slightly with depth; most high-salinity measurements are flagged good quality.
        - Cycle depths stable at 2000 m until cycle 40, then a slight decrease.
        - Data quality: ${dashboardData.qualityHistogramData[0].percent}% good, ${dashboardData.qualityHistogramData[1].percent}% probably good.
      `;
      const result = await handleFloatDashboardInsights(floatData.id, summary);
      if (result.insights) {
        setInsights(result.insights);
      } else {
        setInsights(["Failed to generate AI insights. Please try again."]);
      }
      setIsLoading(false);
    };

    fetchInsights();
  }, [floatData.id, dashboardData]);

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#18181b', // bg-card color
        scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'px', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`float_${floatData.id}_dashboard.pdf`);

    setIsDownloading(false);
  };

  const charts = [
    { title: 'Salinity vs. Pressure', component: <FloatSalinityPressureScatter data={dashboardData.salinityPressureData} />, caption: 'Salinity decreases slightly with depth; most measurements are good quality.' },
    { title: 'Profile Depths', component: <FloatProfileDepth data={dashboardData.profileDepthData} />, caption: 'Cycle depths stable at ~2000 m until cycle 40, then a slight decrease.' },
    { title: 'Data Quality Flags', component: <FloatQualityHistogram data={dashboardData.qualityHistogramData} />, caption: `~${dashboardData.qualityHistogramData[0].percent}% of measurements flagged good, ${dashboardData.qualityHistogramData[1].percent}% probably good.` },
    { title: 'T-S Diagram', component: <FloatTSDiagram data={dashboardData.tsDiagramData} />, caption: 'Classic T-S water-mass signature: warm, salty surface over cooler, fresher deep water.' },
  ];

  return (
    <div className="py-4">
        <div ref={reportRef} className="p-4 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {charts.map((chart, index) => (
                    <Card key={index} className="md:col-span-2 bg-background">
                        <CardHeader>
                            <CardTitle className="text-base">{chart.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48 w-full">{chart.component}</div>
                            <CardDescription className="text-xs mt-2">{chart.caption}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
                <Card className="md:col-span-4 bg-background">
                     <CardHeader>
                        <CardTitle className="text-base">AI Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Generating insights...</span>
                            </div>
                        ) : (
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {insights.map((insight, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <ListTree className="h-4 w-4 mt-1 text-primary"/>
                                        <span>{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleDownloadReport} disabled={isDownloading}>
            {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            )}
          Download Report
        </Button>
      </div>
    </div>
  );
}
