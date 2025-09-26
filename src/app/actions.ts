'use server';

import { generateFloatDashboardInsights } from '@/ai/flows/generate-float-dashboard-insights';
import { generateVisualizationSuggestion, type LidaQueryResponse } from '@/ai/flows/generate-visualization-suggestion';


interface DashboardInsightsResult {
    insights?: string[];
    error?: string;
}


export async function handleFloatDashboardInsights(floatId: string, summary: string): Promise<DashboardInsightsResult> {
    try {
        const result = await generateFloatDashboardInsights({
            floatId: floatId,
            floatDataSummary: summary,
        });
        return { insights: result.insights };
    } catch (e: any) {
        console.error("Float dashboard insights error:", e);
        return { error: e.message || 'An unknown error occurred generating insights.' };
    }
}

export async function handleLidaQuery(query: string): Promise<LidaQueryResponse> {
    try {
        return await generateVisualizationSuggestion({ query });
    } catch (e: any) {
        console.error("Lida query handler error:", e);
        throw new Error(e.message || 'An unknown error occurred with the Lida service.');
    }
}
