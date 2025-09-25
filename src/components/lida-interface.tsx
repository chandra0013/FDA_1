'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Bot, User, Send, Mic, Download, Loader2, BarChart, LineChart, AreaChart, PieChart, ScatterChart, ChevronDown, FileType, ImageDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { handleLidaQuery } from '@/app/actions';
import type { LidaQueryResponse } from '@/ai/flows/generate-visualization-suggestion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import * as charts from './dashboard/charts';
import { generateKpiData, generateMonthlyTrendData, generateOceanHealthData, generateProfileCrossSectionData } from '@/lib/dashboard-data';
import Papa from 'papaparse';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  visualization?: LidaQueryResponse;
};

const chartComponents: { [key: string]: React.FC<{ data: any[] }> } = {
  KpiBars: charts.KpiBars,
  MonthlyTrendArea: charts.MonthlyTrendArea,
  OceanHealthScatter: charts.OceanHealthScatter,
  ProfileCrossSection: charts.ProfileCrossSection,
  FloatSalinityPressureScatter: charts.FloatSalinityPressureScatter,
};

const chartDataGenerators: { [key: string]: (p?: any) => any[] } = {
    KpiBars: generateKpiData,
    MonthlyTrendArea: () => generateMonthlyTrendData(16),
    OceanHealthScatter: () => generateOceanHealthData(120),
    ProfileCrossSection: () => generateProfileCrossSection-data(10),
    FloatSalinityPressureScatter: () => Array.from({length: 100}, (_, i) => ({
        pressure: Math.random() * 2000,
        salinity: 35.3 + Math.random() * 0.4 - (i/1000),
        qc: Math.random() > 0.05 ? (Math.random() > 0.1 ? 1: 2) : 3,
    })),
}

export function LidaInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onSpeechEnd: (finalTranscript) => {
        const query = (input + (finalTranscript ? (input ? ' ' : '') + finalTranscript : '')).trim();
        setInput(query);
        if (query) {
            handleSubmit(query);
        }
    }
  });

  useEffect(() => {
    if (isListening) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (query: string) => {
    if (!query.trim() || isPending) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      try {
        const result = await handleLidaQuery(query);
        const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: result.summary,
            visualization: result,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (e: any) {
        toast({ title: 'AI Error', description: e.message || 'An error occurred.', variant: 'destructive' });
      }
    });
  };

  const handleVoiceClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <Card className="h-[80vh] flex flex-col bg-card/80 glassmorphism">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Bot className="text-primary"/> Lida: Voice & Visualize
        </CardTitle>
        <CardDescription>
            Speak your query, and let our AI generate and customize relevant visualizations for you.
        </CardDescription>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback></Avatar>
              )}
              <div
                className={cn('max-w-[85%] rounded-lg p-3 text-sm', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background')}
              >
                 <ReactMarkdown>{message.content}</ReactMarkdown>
                 {message.visualization && <VisualizationRenderer visualization={message.visualization} />}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8"><AvatarFallback><User size={20} /></AvatarFallback></Avatar>
              )}
            </div>
          ))}
          {isPending && (
             <div className="flex items-start gap-3 justify-start">
               <Avatar className="w-8 h-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback></Avatar>
              <Card className="bg-background"><CardContent className="p-3"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></CardContent></Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }} className="flex items-center gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={isListening ? 'Listening...' : 'e.g., "Show me salinity profiles"'} className="flex-1" disabled={isPending} />
          <Button type="button" size="icon" variant={isListening ? 'destructive' : 'outline'} onClick={handleVoiceClick} disabled={isPending}>
            <Mic className={cn(isListening && 'text-accent animate-pulse')} />
          </Button>
          <Button type="submit" size="icon" disabled={!input.trim() || isPending}><Send /></Button>
        </form>
      </div>
    </Card>
  );
}

const getIconForChart = (chartType: string) => {
    switch (chartType) {
        case 'LineChart': return <LineChart className="mr-2 h-4 w-4" />;
        case 'BarChart': return <BarChart className="mr-2 h-4 w-4" />;
        case 'AreaChart': return <AreaChart className="mr-2 h-4 w-4" />;
        case 'PieChart': return <PieChart className="mr-2 h-4 w-4" />;
        case 'ScatterChart': return <ScatterChart className="mr-2 h-4 w-4" />;
        default: return <BarChart className="mr-2 h-4 w-4" />;
    }
};

const VisualizationRenderer = ({ visualization }: { visualization: LidaQueryResponse }) => {
    const [selectedChart, setSelectedChart] = useState(visualization.defaultChart);
    const chartRef = useRef<HTMLDivElement>(null);

    const ChartComponent = chartComponents[selectedChart];
    const chartData = chartDataGenerators[selectedChart] ? chartDataGenerators[selectedChart]() : [];

    const handleDownloadPNG = async () => {
        if (chartRef.current) {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(chartRef.current, { backgroundColor: '#18181b' });
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${selectedChart}_visualization.png`;
            link.click();
        }
    };

    const handleDownloadCSV = () => {
        const csv = Papa.unparse(chartData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-t-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedChart}_data.csv`;
        link.click();
    };

    return (
        <Card className="mt-4 bg-card/50">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Visualization</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={handleDownloadPNG}><ImageDown className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={handleDownloadCSV}><FileType className="h-4 w-4" /></Button>
                    </div>
                </div>
                <Select value={selectedChart} onValueChange={setSelectedChart}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        {visualization.suggestedCharts.map(chart => (
                            <SelectItem key={chart.chartType} value={chart.chartType}>
                                <div className="flex items-center">
                                    {getIconForChart(chart.chartComponent)}
                                    {chart.chartType}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full" ref={chartRef}>
                    {ChartComponent ? <ChartComponent data={chartData} /> : <p>Chart component not found.</p>}
                </div>
                 <p className="text-xs text-muted-foreground mt-2">{visualization.caption}</p>
                 <div className="mt-4 space-y-4">
                    {visualization.customizationOptions.map(opt => (
                        <div key={opt.label}>
                            <label className="text-xs font-medium text-muted-foreground">{opt.label}</label>
                            {opt.type === 'slider' && <Slider defaultValue={[opt.defaultValue as number]} min={opt.min} max={opt.max} step={opt.step} className="mt-2" />}
                            {opt.type === 'checkbox' && <div className="flex items-center space-x-2 mt-2"><Checkbox id={opt.label} defaultChecked={opt.defaultValue as boolean} /><label htmlFor={opt.label} className="text-xs">{opt.label}</label></div>}
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>
    )
}
