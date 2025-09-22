'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';

const parameterConfig: Record<string, { range: [number, number]; color: string; unit: string }> = {
  temperature: { range: [26.51, 29.27], color: 'hsl(var(--chart-1))', unit: '°C' },
  salinity: { range: [35.28, 35.70], color: 'hsl(var(--chart-2))', unit: 'PSU' },
  pressure: { range: [20, 20], color: 'hsl(var(--chart-3))', unit: 'dbar' },
  ph: { range: [7.9297, 8.0356], color: 'hsl(var(--chart-4))', unit: '' },
  oxygen: { range: [5.4508, 6.1149], color: 'hsl(var(--chart-5))', unit: 'mg/L' },
  nitrate: { range: [1.63915, 2.08097], color: 'hsl(var(--chart-1))', unit: 'µmol/kg' },
  bbp700: { range: [0.003708, 0.024895], color: 'hsl(var(--chart-2))', unit: 'm⁻¹' },
  chlorophyll: { range: [0.94599, 1.27193], color: 'hsl(var(--chart-3))', unit: 'mg/m³' },
  cdom: { range: [0.25337, 0.31673], color: 'hsl(var(--chart-4))', unit: 'm⁻¹' },
  downwelling_par: { range: [168.58, 226.57], color: 'hsl(var(--chart-5))', unit: 'µmol/m²/s' },
};

// Simple pseudo-random number generator for determinism
const mulberry32 = (a: number) => {
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

interface ParameterChartProps {
  parameter: string;
  platformId: number;
}

export function ParameterChart({ parameter, platformId }: ParameterChartProps) {
  const data = useMemo(() => {
    const config = parameterConfig[parameter];
    if (!config) return [];

    const seed = platformId * (parameter.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    const random = mulberry32(seed);
    const { range } = config;
    const [min, max] = range;
    
    const chartData = Array.from({ length: 50 }, (_, i) => {
      const value = min + (random() * (max - min));
      return {
        cycle: i + 1,
        value: parseFloat(value.toFixed(4)),
      };
    });

    if (min === max) {
       chartData.forEach(d => d.value = min);
    }
    
    return chartData;
  }, [parameter, platformId]);

  const config = parameterConfig[parameter];
  if (!config) return <div className="text-center text-muted-foreground">Invalid Parameter</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id={`color-${parameter}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={config.color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={config.color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis
          dataKey="cycle"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{ value: 'Cycle Number', position: 'insideBottom', offset: -5, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={['dataMin', 'dataMax']}
          tickFormatter={(value) => `${typeof value === 'number' ? value.toFixed(2) : value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background) / 0.8)',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          }}
          labelStyle={{ color: 'hsl(var(--primary))' }}
          formatter={(value) => [`${typeof value === 'number' ? value.toFixed(4) : value} ${config.unit}`, parameter]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={config.color}
          fillOpacity={1}
          fill={`url(#color-${parameter})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
