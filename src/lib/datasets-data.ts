
const mulberry32 = (a: number) => {
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
const seed = 54321;
let random = mulberry32(seed);

const randomInRange = (min: number, max: number) => min + random() * (max - min);

// Temperature-Salinity Diagram
export const generateTsData = (count: number) => {
    return Array.from({ length: count }, () => {
        const depth = randomInRange(0, 2000);
        return {
            depth,
            temperature: randomInRange(2, 28) - (depth / 150),
            salinity: randomInRange(34.5, 35.5) + (depth / 5000),
        }
    });
};

// Vertical Profiles
export const generateVerticalProfileData = (count: number) => {
    const tempProfile: any[] = [];
    const salProfile: any[] = [];
    for (let i = 0; i < count; i++) {
        const depth = i * (2000 / count);
        tempProfile.push({
            depth,
            value: randomInRange(2, 28) - (depth / 150) + (random() - 0.5) * 2,
        });
        salProfile.push({
            depth,
            value: randomInRange(34.5, 35.5) + (depth / 5000) + (random() - 0.5) * 0.1,
        });
    }
    return { temp: tempProfile, sal: salProfile };
};

// Multi-Depth Time Series
export const generateTimeSeriesData = (days: number) => {
    const data: any[] = [];
    for (let i = 0; i < days; i++) {
        const seasonalTemp = Math.sin((i / 365) * Math.PI * 2) * 2;
        const seasonalSal = Math.sin((i / 365) * Math.PI * 2) * 0.1;
        data.push({
            day: i,
            surfaceTemp: 26 + seasonalTemp + randomInRange(-0.5, 0.5),
            deepTemp: 5 + randomInRange(-0.2, 0.2),
            surfaceSal: 34.8 - seasonalSal + randomInRange(-0.05, 0.05),
            deepSal: 35.1 + randomInRange(-0.02, 0.02),
        });
    }
    return data;
};

// QC Flag Distribution
export const generateQcData = () => {
    const variables = ['PRES_QC', 'TEMP_QC', 'PSAL_QC'];
    return variables.map(name => {
        const qc_1 = randomInRange(80, 95);
        const qc_2 = randomInRange(2, 10);
        const qc_3 = randomInRange(1, 5);
        const qc_4 = randomInRange(0, 2);
        const qc_9 = randomInRange(0, 1);
        return { name, qc_1, qc_2, qc_3, qc_4, qc_9 };
    });
};

// Data Composition
export const generateCompositionData = () => {
    return {
        modes: [
            { name: 'Real-time', value: Math.floor(randomInRange(300, 400)) },
            { name: 'Adjusted', value: Math.floor(randomInRange(600, 700)) },
        ],
        platforms: [
            { name: 'ARVOR', value: Math.floor(randomInRange(40, 50)) },
            { name: 'PROVOR', value: Math.floor(randomInRange(30, 40)) },
            { name: 'APEX', value: Math.floor(randomInRange(15, 25)) },
            { name: 'Other', value: Math.floor(randomInRange(5, 10)) },
        ],
    };
};

// Cycle Count
export const generateCycleCountData = (platforms: number) => {
    return Array.from({ length: platforms }, (_, i) => ({
        name: `P${1000 + i}`,
        cycles: Math.floor(random() > 0.1 ? randomInRange(50, 150) : randomInRange(5, 49)),
    })).sort((a,b) => b.cycles - a.cycles);
};

// Depth Histogram
export const generateDepthHistogramData = (profileCount: number) => {
    const bins = Array.from({ length: 10 }, (_, i) => ({
        name: `${i * 200}-${(i + 1) * 200} dbar`,
        count: 0
    }));
    for (let i = 0; i < profileCount; i++) {
        const depth = randomInRange(0, 2000);
        const binIndex = Math.min(9, Math.floor(depth / 200));
        bins[binIndex].count++;
    }
    return bins;
};

// Joint Distribution
export const generateJointDistData = (count: number) => {
    const data = {
        '0-200m': [],
        '200-600m': [],
        '600-2000m': [],
    };
    for (let i = 0; i < count; i++) {
        const depth = randomInRange(0, 2000);
        const temp = (28 - (depth / 100)) + randomInRange(-2, 2);
        if (depth <= 200) data['0-200m'].push(temp);
        else if (depth <= 600) data['200-600m'].push(temp);
        else data['600-2000m'].push(temp);
    }
    
    return Object.entries(data).map(([name, values]) => {
        values.sort((a, b) => a - b);
        const q1 = values[Math.floor(values.length / 4)];
        const median = values[Math.floor(values.length / 2)];
        const q3 = values[Math.floor(values.length * 3 / 4)];
        const iqr = q3 - q1;
        const lowerWhisker = Math.max(values[0], q1 - 1.5 * iqr);
        const upperWhisker = Math.min(values[values.length - 1], q3 + 1.5 * iqr);
        const outliers = values.filter(v => v < lowerWhisker || v > upperWhisker);
        return {
            name,
            box: [lowerWhisker, q1, median, q3, upperWhisker],
            outliers: outliers.map(o => [name, o]),
            boxValues: { q1, median, q3 }
        };
    });
};
