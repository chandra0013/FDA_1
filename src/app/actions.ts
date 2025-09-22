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
            // Handle general data query with a data-aware AI flow
            const response = await generateChatResponse({ query });
            return { response: response.answer };
        }
    } catch (e: any) {
        console.error("AI handler error:", e);
        return { error: e.message || 'An unknown error occurred with the AI service.' };
    }
}
