// Simple pseudo-random number generator for deterministic data
const mulberry32 = (a: number) => {
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
const seed = 12345;
let random = mulberry32(seed);

const randomInRange = (min: number, max: number) => min + random() * (max - min);

// Gaussian random number generator (Box-Muller transform)
const randn = (mean: number, std: number) => {
    let u1 = random();
    let u2 = random();
    let z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z * std + mean;
};

export function generateOceanHealthData(count: number) {
    const data: any[] = [];
    for (let i = 0; i < count; i++) {
        const isArabianSea = random() > 0.5;
        const region = isArabianSea ? 'Arabian Sea' : 'Bay of Bengal';
        const temp = randn(isArabianSea ? 28.0 : 28.5, 0.4);
        const nitrate = randn(isArabianSea ? 1.9 : 1.8, 0.1) - (temp - 28) * 0.1;
        const oxygen = randn(5.8, 0.2) - (temp - 28) * 0.15;
        data.push({
            profileId: `P${1000 + i}`,
            region,
            temp: Math.max(26.5, Math.min(29.3, temp)),
            nitrate: Math.max(1.64, Math.min(2.08, nitrate)),
            oxygen: Math.max(5.45, Math.min(6.11, oxygen)),
        });
    }
    return data;
}

export function generateKpiData() {
    const baselineTemp = randomInRange(27.8, 28.5);
    const baselineSalinity = randomInRange(35.4, 35.6);
    const baselineOxygen = randomInRange(5.6, 5.8);
    const baselineChlorophyll = randomInRange(1.0, 1.2);
    const baselineNitrate = randomInRange(1.8, 2.0);

    return [
        { name: 'Mean Temp (°C)', baseline: baselineTemp, optimized: baselineTemp - randomInRange(0.2, 0.4) },
        { name: 'Mean Salinity (PSU)', baseline: baselineSalinity, optimized: baselineSalinity + randomInRange(-0.02, 0.02) },
        { name: 'Mean Oxygen', baseline: baselineOxygen, optimized: baselineOxygen + randomInRange(0.05, 0.15) },
        { name: 'Mean Chlorophyll', baseline: baselineChlorophyll, optimized: baselineChlorophyll + randomInRange(-0.03, 0.02) },
        { name: 'Mean Nitrate', baseline: baselineNitrate, optimized: baselineNitrate - randomInRange(0.05, 0.15) },
    ];
}

export function generateCompositionData() {
    let temp = randomInRange(30, 40);
    let salinity = randomInRange(15, 25);
    let nitrate = randomInRange(15, 25);
    let light = 100 - temp - salinity - nitrate;

    // Adjust if light is out of 10-20 range
    if (light < 10) {
        const deficit = 10 - light;
        light = 10;
        const total = temp + salinity + nitrate;
        temp -= deficit * (temp / total);
        salinity -= deficit * (salinity / total);
        nitrate -= deficit * (nitrate / total);
    } else if (light > 20) {
        const surplus = light - 20;
        light = 20;
        const total = temp + salinity + nitrate;
        temp += surplus * (temp / total);
        salinity += surplus * (salinity / total);
        nitrate += surplus * (nitrate / total);
    }


    return [
        { name: 'Temp. sensitivity', value: temp },
        { name: 'Salinity strat.', value: salinity },
        { name: 'Nitrate limitation', value: nitrate },
        { name: 'Light (PAR) avail.', value: light },
    ];
}


export function generateMonthlyTrendData(months: number) {
    const data: any[] = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        
        const seasonalFactorChl = Math.sin((date.getMonth() / 12) * 2 * Math.PI + random() * 0.5);
        const seasonalFactorPar = Math.sin((date.getMonth() / 12) * 2 * Math.PI + Math.PI / 4 + random() * 0.5);
        
        const chlorophyll = 1.11 + seasonalFactorChl * 0.16 + randomInRange(-0.05, 0.05);
        const par = 198 + seasonalFactorPar * 29 + randomInRange(-10, 10);
        
        data.push({
            month: `${month} '${year}`,
            chlorophyll: Math.max(0.95, Math.min(1.27, chlorophyll)),
            par: Math.max(169, Math.min(227, par)),
        });
    }
    return data;
}

export function generateTornadoData() {
    return [
        { driver: 'Temp. Anomaly', impact: -randomInRange(0.08, 0.20) },
        { driver: 'Stratification', impact: -randomInRange(0.05, 0.12) },
        { driver: 'Mixing Depth', impact: randomInRange(0.06, 0.18) },
        { driver: 'Nitrate Supply', impact: randomInRange(0.03, 0.10) },
        { driver: 'PAR', impact: randomInRange(0.01, 0.05) },
    ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
}


export function generateFacilityUtilizationData() {
    return [
        { name: 'Kerala Coastal Ops', utilization: randomInRange(75, 88) },
        { name: 'Andaman Ops', utilization: randomInRange(60, 75) },
        { name: 'Arabian Sea Transect', utilization: randomInRange(85, 95) },
        { name: 'BoB Central Transect', utilization: randomInRange(55, 68) },
        { name: 'Nicobar Leg', utilization: randomInRange(91, 96) },
    ].sort((a, b) => a.utilization - b.utilization);
}


export function generateStackedDailyData(days: number) {
    const data: any[] = [];
    for (let i = 0; i < days; i++) {
        const dayData: any = { day: `Day ${i + 1}` };
        let total = 0;
        for (let j = 1; j <= 4; j++) {
            const val = random() > 0.3 ? Math.floor(randomInRange(0, 3)) : 0;
            dayData[`P${j}`] = val;
            total += val;
        }
        // Ensure some spikes
        if (random() < 0.1) {
            const platform = `P${Math.floor(randomInRange(1, 5))}`;
            dayData[platform] += Math.floor(randomInRange(2, 4));
        }

        data.push(dayData);
    }
    return data;
}

export function generateRadialGaugeData() {
    const baseline = randomInRange(72, 82);
    const optimized = Math.min(100, baseline + randomInRange(5, 10));
    return { baseline, optimized };
}

export function generateProfileCrossSectionData(cycles: number) {
    const data: any[] = [];
    const baseTemp = randomInRange(27.5, 28.5);
    const baseSalinity = randomInRange(35.3, 35.5);
    for (let i = 1; i <= cycles; i++) {
        data.push({
            cycle: i,
            temperature: baseTemp + randomInRange(-0.5, 0.5),
            salinity: baseSalinity + randomInRange(-0.1, 0.1)
        });
    }
    return data;
}
