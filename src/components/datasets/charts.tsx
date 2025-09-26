
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
  LineChart,
  Line,
  CartesianGrid,
  BarChart,
  Bar,
  LabelList,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  ReferenceLine,
  BoxPlot,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const nameKey = data.name || data.cycle || data.day || label;
    
    const tooltipData: Record<string, any> = {};
    if (nameKey) {
        tooltipData['name'] = nameKey;
    }

    payload.forEach((p: any) => {
        const key = p.name || p.dataKey;
        if (key !== 'payload') {
             if (Array.isArray(p.value)) {
                tooltipData[key] = p.value.join(', ');
            } else if (typeof p.value === 'number') {
                tooltipData[key] = p.value.toFixed(2);
            } else {
                tooltipData[key] = p.value;
            }
        }
    });

    // For BoxPlot
     if (data.boxValues) {
      for (const [key, value] of Object.entries(data.boxValues)) {
        tooltipData[key] = (value as number).toFixed(2);
      }
    }


    return (
      <div className="bg-card border border-border p-2 rounded-lg shadow-lg text-sm">
        {Object.entries(tooltipData).map(([key, value]) => (
           <p key={key} className="label capitalize">{`${key}: ${value}`}</p>
        ))}
      </div>
    );
  }
  return null;
};


export function TsDiagram({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis type="number" dataKey="salinity" name="Salinity" unit="PSU" domain={['dataMin - 0.1', 'dataMax + 0.1']} stroke="hsl(var(--muted-foreground))" />
        <YAxis type="number" dataKey="temperature" name="Temperature" unit="°C" stroke="hsl(var(--muted-foreground))" />
        <ZAxis type="number" dataKey="depth" range={[10, 200]} name="Depth" unit="dbar" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Legend />
        <Scatter name="Water Mass" data={data} fill="hsl(var(--chart-1))" shape="circle" isAnimationActive={false} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function VerticalProfiles({ data }: { data: { temp: any[], sal: any[] } }) {
  return (
    <div className="flex w-full h-full">
      <div className="w-1/2 h-full">
        <ResponsiveContainer>
          <LineChart data={data.temp}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis type="number" dataKey="value" name="Temperature" unit="°C" stroke="hsl(var(--muted-foreground))" domain={['dataMin - 1', 'dataMax + 1']} />
            <YAxis type="number" dataKey="depth" name="Pressure" unit="dbar" reversed stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" dot={false} name="Temperature" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-1/2 h-full">
        <ResponsiveContainer>
          <LineChart data={data.sal}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis type="number" dataKey="value" name="Salinity" unit="PSU" stroke="hsl(var(--muted-foreground))" domain={['dataMin - 0.1', 'dataMax + 0.1']} />
            <YAxis type="number" dataKey="depth" name="Pressure" reversed hide stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" dot={false} name="Salinity" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function MultiDepthTimeSeries({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--chart-1))' }} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" label={{ value: 'Salinity (PSU)', angle: -90, position: 'insideRight', fill: 'hsl(var(--chart-2))' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="surfaceTemp" stroke="hsl(var(--chart-1))" name="Surface Temp" dot={false} />
                <Line yAxisId="left" type="monotone" dataKey="deepTemp" stroke="hsl(var(--chart-3))" name="Deep Temp" dot={false} />
                <Area yAxisId="right" type="monotone" dataKey="surfaceSal" stroke="hsl(var(--chart-2))" name="Surface Salinity" fill="hsl(var(--chart-2))" fillOpacity={0.2} dot={false} />
                <Area yAxisId="right" type="monotone" dataKey="deepSal" stroke="hsl(var(--chart-4))" name="Deep Salinity" fill="hsl(var(--chart-4))" fillOpacity={0.2} dot={false} />
            </ComposedChart>
        </ResponsiveContainer>
    );
}

export function QcFlagDistribution({ data }: { data: any[] }) {
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--destructive))'];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" stackId="a" />
        <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {Object.keys(data[0] || {}).filter(key => key.startsWith('qc_')).map((key, i) => (
           <Bar key={key} dataKey={key} name={`QC ${key.split('_')[1]}`} stackId="a" fill={COLORS[i % COLORS.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DataComposition({ data }: { data: { modes: any[], platforms: any[] } }) {
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
  return (
    <div className="flex w-full h-full">
      <div className="w-1/2 h-full">
         <ResponsiveContainer>
            <PieChart>
                <Pie data={data.modes} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} label>
                     {data.modes.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                 <Tooltip content={<CustomTooltip />} />
                 <Legend wrapperStyle={{fontSize: '0.8rem'}} />
            </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-1/2 h-full">
        <ResponsiveContainer>
            <PieChart>
                <Pie data={data.platforms} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} label>
                    {data.platforms.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize: '0.8rem'}}/>
            </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CycleCount({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={50} interval={0} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cycles" fill="hsl(var(--chart-2))" />
            </BarChart>
        </ResponsiveContainer>
    );
}


export function DepthHistogram({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-45_} textAnchor="end" height={50} interval={1} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Profile Count" fill="hsl(var(--chart-3))" />
            </BarChart>
        </ResponsiveContainer>
    );
}


export function JointTempDepth({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <BoxPlot
          dataKey="box"
          fill="hsl(var(--chart-4))"
          stroke="hsl(var(--muted-foreground))"
          name="Temp Distribution"
        />
         <Scatter dataKey="outliers" fill="hsl(var(--destructive))" name="Outliers" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

