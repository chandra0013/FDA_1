'use server';

import { providePersonalizedLearningSummary } from '@/ai/flows/provide-personalized-learning-summary';
import { generateDataInsightsReport } from '@/ai/flows/generate-data-insights-report';

interface AiChatResult {
    response?: string;
    reportDataUri?: string;
    error?: string;
}

// Mock data for demonstration
const mockOceanData: Record<string, any> = {
    salinity: {
        equator: "Average salinity near the equator in March 2023 was 35.2 PSU. Data shows a slight increase from previous years.",
        default: "Salinity data is available. Please specify a location and time."
    },
    bgc: {
        "arabian sea": "In the Arabian Sea, oxygen levels are relatively low (around 60 µmol/kg), while nitrate concentrations are high. This is typical for an oxygen minimum zone.",
        default: "BGC parameters can be compared. Please provide at least one region."
    },
    floats: {
        "15°n, 90°e": "The nearest ARGO float is #590324, currently located at 15.2°N, 89.8°E. Last transmission was 2 hours ago.",
        default: "I can find the nearest floats. Please provide coordinates."
    }
};

function getMockDataResponse(query: string): string {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('salinity')) {
        return lowerQuery.includes('equator') ? mockOceanData.salinity.equator : mockOceanData.salinity.default;
    }
    if (lowerQuery.includes('bgc')) {
        return lowerQuery.includes('arabian sea') ? mockOceanData.bgc["arabian sea"] : mockOceanData.bgc.default;
    }
    if (lowerQuery.includes('nearest argo float')) {
        return lowerQuery.includes('15°n, 90°e') ? mockOceanData.floats["15°n, 90°e"] : mockOceanData.floats.default;
    }
    return "I can answer questions about ocean temperature, salinity, BGC parameters, and ARGO float locations. What would you like to know?";
}


export async function handleAiChat(query: string, forReport: boolean = false): Promise<AiChatResult> {
    try {
        const lowerQuery = query.toLowerCase();

        if (forReport || lowerQuery.includes('report')) {
            // Generate a report
            const reportResult = await generateDataInsightsReport({
                query,
                visualizations: [] // In a real app, you'd pass chart data URIs
            });
            if (forReport) {
                return { reportDataUri: reportResult.reportDataUri };
            }
            return { response: "Your PDF report is ready for download." };

        } else if (lowerQuery.includes('summary') || lowerQuery.includes('learning')) {
            // Generate personalized learning summary
            const summaryResult = await providePersonalizedLearningSummary({
                interactionData: `User asked: "${query}"` // Pass more context in a real app
            });
            return { response: summaryResult.summary };

        } else {
            // Handle general data query (mocked)
            const mockResponse = getMockDataResponse(query);
            return { response: mockResponse };
        }
    } catch (e: any) {
        console.error("AI handler error:", e);
        return { error: e.message || 'An unknown error occurred with the AI service.' };
    }
}
