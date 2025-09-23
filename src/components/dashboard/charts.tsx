
'use client';
import {
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  Scatter,
  BarChart,
  Bar,
  LabelList,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line
} from 'recharts';
import type { ForecastDataPoint } from '@/lib/dashboard-forecast-data';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Dynamically find a relevant name/label key
    const nameKey = data.profileId || data.name || data.month || data.day || label;
    
    const tooltipData: Record<string, any> = {};
    if (nameKey) {
        tooltipData['name'] = nameKey;
    }

    payload.forEach((p: any) => {
        // Use the formatted name from the Bar/Line/etc component
        const key = p.name || p.dataKey;
        if (key !== 'payload') {
            tooltipData[key] = p.value;
        }
    });

    return (
      <div className="bg-card border border-border p-2 rounded-lg shadow-lg text-sm">
        {Object.entries(tooltipData).map(([key, value]) => (
           <p key={key} className="label capitalize">{`${key}: ${typeof value === 'number' ? value.toFixed(2) : value}`}</p>
        ))}
      </div>
    );
  }
  return null;
};


export function OceanHealthScatter({ data }: { data: any[] }) {
  const arabianSeaData = data.filter(d => d.region === 'Arabian Sea');
  const bayOfBengalData = data.filter(d => d.region === 'Bay of Bengal');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type="number" dataKey="temp" name="Temperature" unit="°C" domain={[26.5, 29.3]} stroke="hsl(var(--muted-foreground))" />
        <YAxis type="number" dataKey="nitrate" name="Nitrate" unit="µmol/kg" domain={[1.64, 2.08]} stroke="hsl(var(--muted-foreground))" />
        <ZAxis type="number" dataKey="oxygen" range={[10, 200]} name="Oxygen" unit="mg/L" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Legend />
        <Scatter name="Arabian Sea" data={arabianSeaData} fill="hsl(var(--chart-1))" shape="circle" />
        <Scatter name="Bay of Bengal" data={bayOfBengalData} fill="hsl(var(--chart-2))" shape="triangle" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function KpiBars({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} width={120}/>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="arabianSea" name="Arabian Sea" fill="hsl(var(--chart-1))" radius={[4, 4, 4, 4]}>
            <LabelList dataKey="arabianSea" position="right" formatter={(v:number) => v.toFixed(2)} />
        </Bar>
        <Bar dataKey="bayOfBengal" name="Bay of Bengal" fill="hsl(var(--chart-2))" radius={[4, 4, 4, 4]}>
            <LabelList dataKey="bayOfBengal" position="right" formatter={(v:number) => v.toFixed(2)} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export function CompositionDonut({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius="60%"
          outerRadius="80%"
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyTrendArea({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <defs>
                    <linearGradient id="colorChl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" label={{ value: 'Chlorophyll (mg m⁻³)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--chart-1))' }} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" label={{ value: 'PAR (µmol photons m⁻² s⁻¹)', angle: -90, position: 'insideRight', fill: 'hsl(var(--chart-2))' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="chlorophyll" stroke="hsl(var(--chart-1))" fill="url(#colorChl)" />
                <Area yAxisId="right" type="monotone" dataKey="par" stroke="hsl(var(--chart-2))" fill="url(#colorPar)" />
            </ComposedChart>
        </ResponsiveContainer>
    );
}

export function TornadoSensitivity({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
                <XAxis type="number" domain={[-0.25, 0.25]} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="driver" stroke="hsl(var(--muted-foreground))" width={100} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="impact">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.impact > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--chart-1))'} />
                    ))}
                     <LabelList dataKey="impact" position="right" formatter={(v:number) => `${v.toFixed(3)} ΔO2`} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export function FacilityUtilization({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
                <XAxis type="number" domain={[0, 100]} unit="%" stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" width={120} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="utilization">
                    {data.map((entry, index) => {
                        let color = 'hsl(var(--chart-1))';
                        if (entry.utilization >= 90) color = 'hsl(var(--destructive))';
                        else if (entry.utilization >= 70) color = 'hsl(var(--chart-2))';
                        return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                    <LabelList dataKey="utilization" position="right" formatter={(v:number) => `${v}%`} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}


export function StackedDailyActivity({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="P1" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="P2" stackId="a" fill="hsl(var(--chart-2))" />
                <Bar dataKey="P3" stackId="a" fill="hsl(var(--chart-3))" />
                <Bar dataKey="P4" stackId="a" fill="hsl(var(--chart-4))" />
                 {data.map((d, i) => (
                    Object.entries(d).map(([key, value]) => {
                        if (key.startsWith('P') && (value as number) > 5) {
                            return <Cell key={`${i}-${key}`} fill="hsl(var(--destructive))" />;
                        }
                        return null;
                    })
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}

export function DualRadialGauges({ data }: { data: { baseline: number; optimized: number } }) {
    const radialBarData = [
        { name: 'Optimized', value: data.optimized, fill: 'hsl(var(--chart-1))' },
        { name: 'Baseline', value: data.baseline, fill: 'hsl(var(--chart-3))' },
    ];
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
                innerRadius="50%"
                outerRadius="90%"
                data={radialBarData}
                startAngle={180}
                endAngle={0}
                barSize={20}
            >
                <RadialBar
                    minAngle={15}
                    background={{ fill: 'hsl(var(--muted) / 0.3)' }}
                    clockWise
                    dataKey="value"
                />
                 <Tooltip content={<CustomTooltip />} />
                 <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-2xl font-bold"
                >
                    {`${data.optimized.toFixed(1)}%`}
                </text>
                 <text
                    x="50%"
                    y="60%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-sm"
                >
                    Optimized
                </text>
            </RadialBarChart>
        </ResponsiveContainer>
    );
}

export function ProfileCrossSection({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <XAxis dataKey="cycle" type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-3))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="hsl(var(--chart-1))" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="salinity" stroke="hsl(var(--chart-3))" dot={{ r: 4 }} activeDot={{ r: 6 }}/>
            </LineChart>
        </ResponsiveContainer>
    );
}


export function ForecastLineChart({ data, range }: { data: ForecastDataPoint[], range: [number, number] }) {
  const forecastStartIndex = data.findIndex(p => p.type === 'forecast');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
         <defs>
          <linearGradient id="confidence-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis domain={range} stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="value" 
          name="Historical"
          stroke="hsl(var(--chart-1))" 
          strokeWidth={2} 
          dot={false}
          data={data.slice(0, forecastStartIndex + 1)}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          name="Forecast"
          stroke="hsl(var(--chart-1))" 
          strokeWidth={2} 
          strokeDasharray="5 5"
          dot={false}
          data={data.slice(forecastStartIndex)}
        />
        <Area 
          type="monotone" 
          dataKey="confidence"
          name="Confidence"
          fill="url(#confidence-band)"
          stroke="none"
          data={data.slice(forecastStartIndex)}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}



    