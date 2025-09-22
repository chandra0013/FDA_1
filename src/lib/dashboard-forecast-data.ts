
import { format } from 'date-fns';

const mulberry32 = (a: number) => {
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const ARGO_RANGES = {
  temperature: [26.51, 29.27],
  salinity: [35.28, 35.70],
  ph: [7.9297, 8.0356],
  oxygen: [5.4508, 6.1149],
  chlorophyll: [0.94599, 1.27193],
  nitrate: [1.63915, 2.08097],
  bbp700: [0.003708, 0.024895],
  cdom: [0.25337, 0.31673],
  downwelling_par: [168.58, 226.57],
};
export type ForecastVariable = keyof typeof ARGO_RANGES;

export type ForecastDataPoint = {
  day: string;
  value: number;
  type: 'historical' | 'forecast';
  confidence?: [number, number];
};

export type ForecastResult = {
  variable: ForecastVariable;
  data: ForecastDataPoint[];
  stats: {
    min: number;
    max: number;
    trend: number;
    confidence: number;
    narrative: string;
  };
  range: [number, number];
};

export type ForecastData = {
  params: ForecastParams;
  results: ForecastResult[];
  narrative: string;
};

export interface ForecastParams {
  trainingDays: number;
  horizon: string;
  variables: ForecastVariable[];
}

const getHorizonInDays = (horizon: string): number => {
    if (horizon.endsWith('d')) {
        return parseInt(horizon.slice(0, -1));
    }
    if (horizon.includes('month')) {
        return 30;
    }
    return 30;
};


const generateSingleForecast = (
  variable: ForecastVariable,
  params: ForecastParams,
  seed: number
): ForecastResult => {
  const random = mulberry32(seed);
  const { trainingDays, horizon } = params;
  const horizonDays = getHorizonInDays(horizon);
  const totalDays = trainingDays + horizonDays;

  const [min, max] = ARGO_RANGES[variable];
  const range = max - min;
  
  // Historical data
  const historicalData: ForecastDataPoint[] = [];
  for(let i = 0; i < trainingDays; i++) {
    const sinusoidal = Math.sin((i / 365) * Math.PI * 2) * 0.25 + Math.sin((i / 30) * Math.PI * 2) * 0.25;
    const noise = (random() - 0.5) * 0.1;
    const normalizedValue = 0.5 + 0.5 * (sinusoidal + noise);
    const value = min + normalizedValue * range;
    historicalData.push({
      day: `D-${trainingDays - i}`,
      value: Math.max(min, Math.min(max, value)),
      type: 'historical',
    });
  }

  // Forecast data
  const forecastData: ForecastDataPoint[] = [];
  let lastVal = historicalData[historicalData.length - 1]?.value ?? (min + range / 2);

  const seasonalAmplitude = trainingDays > 30 ? (trainingDays / 100) * 0.5 : 0;
  const trend = trainingDays > 30 ? (random() - 0.5) * (range * 0.01) : 0;

  for(let i = 0; i < horizonDays; i++) {
    let seasonalVal = 0;
    if (trainingDays <= 20) { // seasonal naive
        seasonalVal = (historicalData[historicalData.length - (30 - (i % 30))]?.value ?? lastVal) - lastVal;
    } else {
        seasonalVal = Math.sin(((trainingDays + i) / 365) * Math.PI * 2) * range * 0.1 * seasonalAmplitude;
    }

    const uncertaintyNoise = (random() - 0.5) * range * 0.2 * (1 - trainingDays/120);
    let nextVal = lastVal + seasonalVal + trend + uncertaintyNoise;
    nextVal = Math.max(min, Math.min(max, nextVal));
    
    const confidenceRange = range * 0.15 * (1 - trainingDays / 120);
    const lower = Math.max(min, nextVal - confidenceRange);
    const upper = Math.min(max, nextVal + confidenceRange);

    forecastData.push({
      day: `D+${i + 1}`,
      value: nextVal,
      type: 'forecast',
      confidence: [lower, upper]
    });
    lastVal = nextVal;
  }
  
  const fullData = [...historicalData, ...forecastData];
  const forecastSlice = forecastData.map(d => d.value);
  const forecastMin = Math.min(...forecastSlice);
  const forecastMax = Math.max(...forecastSlice);
  const forecastTrend = (forecastSlice[forecastSlice.length - 1] - forecastSlice[0]) / horizonDays;

  // Generate narrative
  let narrative = '';
  const confidence = Math.round(trainingDays / 100 * 80 + 20);
  if (trainingDays <= 20) narrative = `High uncertainty (${confidence}% confidence) due to short training period. Bands are wide. `;
  else if (trainingDays <= 50) narrative = `Balanced confidence (${confidence}%) with some seasonal patterns emerging. `;
  else narrative = `Strong confidence (${confidence}%) with clear seasonal cycle. Bands are narrow. `;
  
  narrative += `Forecast shows values between ${forecastMin.toFixed(2)} and ${forecastMax.toFixed(2)}. `;
  if (Math.abs(forecastTrend * 100) > 0.01) {
    narrative += `A ${forecastTrend > 0 ? 'warming' : 'cooling'} trend of approx. ${(forecastTrend).toFixed(3)}/day is detected.`;
  } else {
    narrative += `The trend appears stable.`;
  }

  return {
    variable,
    data: fullData,
    stats: {
      min: forecastMin,
      max: forecastMax,
      trend: forecastTrend,
      confidence: confidence,
      narrative,
    },
    range: [min, max]
  };
};

const generateOverallNarrative = (results: ForecastResult[], params: ForecastParams) => {
    let narrative = `This forecast for the next **${params.horizon}**, based on **${params.trainingDays} days** of historical data, suggests the following key trends:\n\n`;

    const tempResult = results.find(r => r.variable === 'temperature');
    if (tempResult) {
        narrative += `*   **Temperature:** A ${tempResult.stats.trend > 0 ? 'gradual increase' : 'slight decrease'} is anticipated, with values remaining within the historical range. Peak temperature is expected around the end of the forecast period.\n`;
    }
    
    const chloroResult = results.find(r => r.variable === 'chlorophyll');
    if (chloroResult) {
        narrative += `*   **Chlorophyll:** We expect a ${chloroResult.stats.trend > 0 ? 'modest rise' : 'slight decline'} in chlorophyll, consistent with seasonal patterns. No significant bloom events are forecasted.\n`;
    }

    const oxygenResult = results.find(r => r.variable === 'oxygen');
    if (oxygenResult) {
        narrative += `*   **Oxygen:** Oxygen levels are projected to remain stable, with minor fluctuations potentially linked to temperature shifts. Overall ocean health appears steady.\n`;
    }

    const salinityResult = results.find(r => r.variable === 'salinity');
    if (salinityResult && Math.abs(salinityResult.stats.trend) < 0.001) {
         narrative += `*   **Salinity & pH:** Both salinity and pH are expected to show minimal variation, indicating stable chemical conditions.\n`;
    }

    narrative += `\n**Confidence:** The overall confidence in this forecast is **${Math.round(results.reduce((acc, r) => acc + r.stats.confidence, 0) / results.length)}%**. Longer training periods generally yield higher confidence.`;
    
    return narrative;
}


export const generateAllForecasts = (params: ForecastParams): ForecastData => {
  const results = params.variables.map((variable, index) => 
    generateSingleForecast(variable, params, params.trainingDays + index)
  );

  const narrative = generateOverallNarrative(results, params);

  return { params, results, narrative };
};
