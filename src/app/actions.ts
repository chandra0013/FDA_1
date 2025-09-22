'use server';

import { providePersonalizedLearningSummary } from '@/ai/flows/provide-personalized-learning-summary';
import { generateDataInsightsReport } from '@/ai/flows/generate-data-insights-report';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';

interface AiChatResult {
    response?: string;
    reportDataUri?: string;
    error?: string;
}

export async function handleAiChat(query: string, forReport: boolean = false): Promise<AiChatResult> {
    try {
        const lowerQuery = query.toLowerCase();
        const reportKeywords = ['report', 'analysis', 'brief', 'overview'];

        if (forReport || reportKeywords.some(keyword => lowerQuery.includes(keyword))) {
            // Generate a report
            const reportResult = await generateDataInsightsReport({
                query,
                visualizations: [] // In a real app, you'd pass chart data URIs
            });
            
            if (forReport) {
                return { reportDataUri: reportResult.reportDataUri };
            }
            // The UI will handle the download button based on this response.
            return { response: "Your PDF report is ready for download." };

        } else if (lowerQuery.includes('summary') || lowerQuery.includes('learning')) {
            // Generate personalized learning summary
            const summaryResult = await providePersonalizedLearningSummary({
                interactionData: `User asked: "${query}"` // Pass more context in a real app
            });
            return { response: summaryResult.summary };

        } else {
            // Handle general data query with a data-aware AI flow
            const response = await generateChatResponse({ query });
            return { response: response.answer };
        }
    } catch (e: any) {
        console.error("AI handler error:", e);
        return { error: e.message || 'An unknown error occurred with the AI service.' };
    }
}


export async function handleDashboardAiChat(query: string, mode: 'descriptive' | 'predictive', context?: any): Promise<AiChatResult> {
    try {
        let fullQuery = `Dashboard Mode: ${mode}. User Query: "${query}"`;
        if (mode === 'predictive' && context) {
            fullQuery += `\n\nPredictive Context:\n${JSON.stringify(context, null, 2)}`;
        }
        
        const response = await generateChatResponse({ query: fullQuery });
        return { response: response.answer };

    } catch (e: any) {
        console.error("Dashboard AI handler error:", e);
        return { error: e.message || 'An unknown error occurred with the AI service.' };
    }
}
