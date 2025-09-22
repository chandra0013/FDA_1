'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const stages = [
  "Preparing data...",
  "Training seasonal model...",
  "Generating forecasts...",
  "Computing confidence intervals...",
  "Finalizing visualizations..."
];

interface LoadingSimulationProps {
  onComplete: () => void;
}

export function LoadingSimulation({ onComplete }: LoadingSimulationProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStageIndex >= stages.length) {
      onComplete();
      return;
    }

    const stageDuration = 1000;
    const interval = setInterval(() => {
        setProgress(p => {
            const newProgress = p + 100 / (stages.length * 10);
            if (newProgress >= (currentStageIndex + 1) * (100 / stages.length)) {
                setCurrentStageIndex(i => i + 1);
            }
            return newProgress;
        });
    }, stageDuration / 10);

    return () => clearInterval(interval);
  }, [currentStageIndex, onComplete]);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-lg bg-card border-border p-8">
        <CardContent className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Running Predictive Analysis...</h2>
          <p className="text-muted-foreground mb-6">{stages[currentStageIndex] || 'Done!'}</p>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
