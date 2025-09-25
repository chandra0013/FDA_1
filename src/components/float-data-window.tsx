'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParameterChart } from './parameter-chart';
import type { ArgoFloat } from './map-visualization';
import { FloatIntegratedDashboard } from './float-integrated-dashboard';

interface FloatDataWindowProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  floatData: ArgoFloat | null;
}

const parameters = [
  { value: 'temperature', label: 'Temperature (°C)' },
  { value: 'salinity', label: 'Salinity (PSU)' },
  { value: 'pressure', label: 'Pressure (dbar)' },
  { value: 'oxygen', label: 'Oxygen (mg/L)' },
  { value: 'nitrate', label: 'Nitrate (µmol kg⁻¹)' },
  { value: 'ph', label: 'pH' },
  { value: 'bbp700', label: 'BBP700 (m⁻¹)' },
  { value: 'chlorophyll', label: 'Chlorophyll (mg m⁻³)' },
  { value: 'cdom', label: 'CDOM (m⁻¹)' },
  { value: 'downwelling_par', label: 'Downwelling PAR' },
];

export function FloatDataWindow({
  isOpen,
  onOpenChange,
  floatData,
}: FloatDataWindowProps) {
  const [selectedParameter, setSelectedParameter] = useState('temperature');

  if (!floatData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl bg-card/80 glassmorphism">
        <DialogHeader>
          <DialogTitle className="text-primary">Float ID: {floatData.id}</DialogTitle>
          <DialogDescription>
            {floatData.location} ({floatData.lat.toFixed(2)}°N, {floatData.lng.toFixed(2)}°E)
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dashboard">Integrated Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="parameter-select" className="text-sm font-medium text-muted-foreground">
                  Select Parameter
                </label>
                <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                  <SelectTrigger id="parameter-select" className="w-full mt-1">
                    <SelectValue placeholder="Select a parameter" />
                  </SelectTrigger>
                  <SelectContent>
                    {parameters.map((param) => (
                      <SelectItem key={param.value} value={param.value}>
                        {param.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full h-[300px]">
                <ParameterChart
                  parameter={selectedParameter}
                  platformId={parseInt(floatData.id.replace( /^\D+/g, ''), 10)}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="dashboard">
             <FloatIntegratedDashboard floatData={floatData} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
